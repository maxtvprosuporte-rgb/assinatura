from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import os
import random
from models.roleta import (
    UserCreate, UserLogin, UserResponse, SpinRequest, SpinResult,
    AddGirosRequest, Transaction, UserInDB
)

router = APIRouter(prefix="/api/roleta", tags=["roleta"])

# Conexão com MongoDB
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'maxtvpro')]

# Probabilidades da roleta
PREMIOS = [
    {"premio": "Não foi dessa vez", "dias": 0, "peso": 40},
    {"premio": "5 dias de assinatura", "dias": 5, "peso": 25},
    {"premio": "10 dias de assinatura", "dias": 10, "peso": 15},
    {"premio": "15 dias de assinatura", "dias": 15, "peso": 10},
    {"premio": "20 dias de assinatura", "dias": 20, "peso": 5},
    {"premio": "25 dias de assinatura", "dias": 25, "peso": 3},
    {"premio": "30 dias de assinatura", "dias": 30, "peso": 2},
]

def sortear_premio():
    """Sorteia um prêmio baseado nas probabilidades"""
    total_peso = sum(p["peso"] for p in PREMIOS)
    sorteio = random.uniform(0, total_peso)
    
    acumulado = 0
    for premio in PREMIOS:
        acumulado += premio["peso"]
        if sorteio <= acumulado:
            return premio
    
    return PREMIOS[0]  # Fallback


# ==========================================
# ROTAS DE USUÁRIO
# ==========================================

@router.post("/user/register")
async def register_user(user: UserCreate):
    """Registra um novo usuário após criação no Firebase"""
    try:
        # Verificar se já existe
        existing = await db.users.find_one({"firebase_uid": user.firebase_uid})
        if existing:
            raise HTTPException(status_code=400, detail="Usuário já existe")
        
        # Criar usuário
        user_data = UserInDB(
            email=user.email,
            firebase_uid=user.firebase_uid,
            giros=0,
            tipo="user"
        )
        
        await db.users.insert_one(user_data.dict())
        
        return {"message": "Usuário criado com sucesso", "user_id": user_data.id}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/user/{firebase_uid}")
async def get_user(firebase_uid: str):
    """Busca dados do usuário"""
    user = await db.users.find_one({"firebase_uid": firebase_uid})
    
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    return UserResponse(
        id=user["id"],
        email=user["email"],
        giros=user["giros"],
        tipo=user["tipo"]
    )


# ==========================================
# ROTAS DA ROLETA
# ==========================================

@router.post("/spin")
async def girar_roleta(spin_request: SpinRequest):
    """Gira a roleta e retorna o prêmio"""
    try:
        # Buscar usuário
        user = await db.users.find_one({"id": spin_request.user_id})
        
        if not user:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")
        
        # Verificar giros
        if user["giros"] <= 0:
            raise HTTPException(status_code=400, detail="Você não possui giros disponíveis")
        
        # Sortear prêmio
        premio_sorteado = sortear_premio()
        
        # Subtrair 1 giro
        await db.users.update_one(
            {"id": spin_request.user_id},
            {"$inc": {"giros": -1}}
        )
        
        # Salvar resultado
        resultado = SpinResult(
            user_id=spin_request.user_id,
            premio=premio_sorteado["premio"],
            dias=premio_sorteado["dias"]
        )
        
        await db.spin_history.insert_one(resultado.dict())
        
        # Registrar transação
        transacao = Transaction(
            user_id=spin_request.user_id,
            tipo="uso",
            quantidade=-1,
            motivo="Giro da roleta"
        )
        
        await db.transactions.insert_one(transacao.dict())
        
        return {
            "success": True,
            "premio": premio_sorteado["premio"],
            "dias": premio_sorteado["dias"],
            "giros_restantes": user["giros"] - 1
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history/{user_id}")
async def get_history(user_id: str):
    """Retorna o histórico de giros do usuário"""
    historico = await db.spin_history.find({"user_id": user_id}).sort("timestamp", -1).limit(50).to_list(50)
    
    return historico


# ==========================================
# ROTAS ADMIN
# ==========================================

@router.post("/admin/add-giros")
async def add_giros(request: AddGirosRequest):
    """Admin adiciona giros para um usuário"""
    try:
        # Verificar se quem está adicionando é admin
        admin = await db.users.find_one({"email": request.admin_email})
        
        if not admin or admin["tipo"] != "admin":
            raise HTTPException(status_code=403, detail="Acesso negado. Apenas administradores podem adicionar giros")
        
        # Buscar usuário
        user = await db.users.find_one({"email": request.user_email})
        
        if not user:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")
        
        # Adicionar giros
        await db.users.update_one(
            {"email": request.user_email},
            {"$inc": {"giros": request.quantidade}}
        )
        
        # Registrar transação
        transacao = Transaction(
            user_id=user["id"],
            tipo="adicao",
            quantidade=request.quantidade,
            admin_email=request.admin_email,
            motivo=f"Adicionado por admin: {request.admin_email}"
        )
        
        await db.transactions.insert_one(transacao.dict())
        
        return {
            "success": True,
            "message": f"{request.quantidade} giros adicionados para {request.user_email}",
            "total_giros": user["giros"] + request.quantidade
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/admin/users")
async def list_users(admin_email: str):
    """Lista todos os usuários (apenas admin)"""
    # Verificar se é admin
    admin = await db.users.find_one({"email": admin_email})
    
    if not admin or admin["tipo"] != "admin":
        raise HTTPException(status_code=403, detail="Acesso negado")
    
    users = await db.users.find({}).to_list(1000)
    
    return users


@router.get("/admin/transactions")
async def list_transactions(admin_email: str):
    """Lista todas as transações (apenas admin)"""
    # Verificar se é admin
    admin = await db.users.find_one({"email": admin_email})
    
    if not admin or admin["tipo"] != "admin":
        raise HTTPException(status_code=403, detail="Acesso negado")
    
    transactions = await db.transactions.find({}).sort("timestamp", -1).limit(100).to_list(100)
    
    return transactions
