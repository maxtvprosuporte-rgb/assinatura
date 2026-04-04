"""
Script para criar usuário admin inicial
Executar apenas uma vez
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
import uuid
from datetime import datetime

ROOT_DIR = Path(__file__).parent.parent
load_dotenv(ROOT_DIR / '.env')

async def create_admin():
    # Conectar ao MongoDB
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ.get('DB_NAME', 'maxtvpro')]
    
    admin_email = "maxtvpro.suporte@gmail.com"
    firebase_uid = "ADMIN_FIREBASE_UID"  # Será atualizado após primeiro login
    
    # Verificar se já existe
    existing = await db.users.find_one({"email": admin_email})
    
    if existing:
        print(f"✅ Admin já existe: {admin_email}")
        print(f"   Giros: {existing.get('giros', 0)}")
        print(f"   Tipo: {existing.get('tipo')}")
    else:
        # Criar admin
        admin_data = {
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "firebase_uid": firebase_uid,
            "giros": 0,
            "tipo": "admin",
            "created_at": datetime.utcnow().isoformat()
        }
        
        await db.users.insert_one(admin_data)
        print(f"✅ Admin criado com sucesso: {admin_email}")
        print(f"   Senha: @SSantosmattheuSS1998")
        print(f"   Tipo: admin")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(create_admin())
