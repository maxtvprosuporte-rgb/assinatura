import React, { useState, useEffect } from 'react';
import { useAuth } from '@/firebase/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import axios from 'axios';
import './Roleta.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const PREMIOS = [
  { texto: "Não foi dessa vez", dias: 0, cor: "#666666" },
  { texto: "5 dias", dias: 5, cor: "#4CAF50" },
  { texto: "10 dias", dias: 10, cor: "#2196F3" },
  { texto: "15 dias", dias: 15, cor: "#9C27B0" },
  { texto: "20 dias", dias: 20, cor: "#FF9800" },
  { texto: "25 dias", dias: 25, cor: "#E91E63" },
  { texto: "30 dias", dias: 30, cor: "#d4af37" },
];

const PACOTES_GIROS = [
  {
    quantidade: 1,
    preco: 6.99,
    link: "https://ggcheckout.app/checkout/v2/PM3zdSyF68xoiMdwNd5h"
  },
  {
    quantidade: 2,
    preco: 11.99,
    link: "https://ggcheckout.app/checkout/v2/mlpEHljCwgl9BCgwZbsY"
  },
  {
    quantidade: 3,
    preco: 16.99,
    link: "https://ggcheckout.app/checkout/v2/zfSPWwRs4tDGLIm59UW8"
  }
];

const Roleta = () => {
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();
  const [girando, setGirando] = useState(false);
  const [rotacao, setRotacao] = useState(0);
  const [historico, setHistorico] = useState([]);
  const [userId, setUserId] = useState(null);
  const [giros, setGiros] = useState(0);

  useEffect(() => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }
    
    // Buscar dados do usuário no backend
    fetchUserData();
    fetchHistorico();
  }, [currentUser]);

  useEffect(() => {
    if (userData) {
      setGiros(userData.giros || 0);
    }
  }, [userData]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/roleta/user/${currentUser.uid}`);
      setUserId(response.data.id);
      setGiros(response.data.giros);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      
      // Se usuário não existe no backend, criar
      if (error.response?.status === 404) {
        try {
          await axios.post(`${BACKEND_URL}/api/roleta/user/register`, {
            email: currentUser.email,
            firebase_uid: currentUser.uid,
            password: "dummy" // Não é usado, só para manter o schema
          });
          
          // Tentar buscar novamente
          const newResponse = await axios.get(`${BACKEND_URL}/api/roleta/user/${currentUser.uid}`);
          setUserId(newResponse.data.id);
          setGiros(newResponse.data.giros);
        } catch (registerError) {
          console.error('Erro ao registrar usuário:', registerError);
        }
      }
    }
  };

  const fetchHistorico = async () => {
    if (!userId) return;
    
    try {
      const response = await axios.get(`${BACKEND_URL}/api/roleta/history/${userId}`);
      setHistorico(response.data);
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
    }
  };

  const girarRoleta = async () => {
    if (!userId) {
      toast.error('Erro ao identificar usuário');
      return;
    }
    
    if (giros <= 0) {
      toast.error('Você não possui giros disponíveis!');
      return;
    }

    if (girando) return;

    setGirando(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/roleta/spin`, {
        user_id: userId
      });

      // Atualizar giros localmente
      setGiros(response.data.giros_restantes);

      // Calcular rotação baseada no prêmio
      const premioIndex = PREMIOS.findIndex(p => p.dias === response.data.dias);
      const segmentAngle = 360 / PREMIOS.length;
      const randomOffset = Math.random() * (segmentAngle * 0.8) - (segmentAngle * 0.4);
      const targetRotation = (premioIndex * segmentAngle) + randomOffset;
      const totalRotation = 360 * 5 + targetRotation; // 5 voltas completas + posição final

      setRotacao(totalRotation);

      // Aguardar animação
      setTimeout(() => {
        setGirando(false);
        
        if (response.data.dias > 0) {
          toast.success(`🎉 Parabéns! Você ganhou ${response.data.dias} dias de assinatura!`);
        } else {
          toast.info('😔 Não foi dessa vez! Tente novamente.');
        }
        
        // Atualizar histórico
        fetchHistorico();
      }, 4000);

    } catch (error) {
      setGirando(false);
      console.error('Erro ao girar:', error);
      toast.error(error.response?.data?.detail || 'Erro ao girar a roleta');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="roleta-page">
      {/* Header */}
      <div className="roleta-header">
        <div className="header-content">
          <img src="/icon/logo.png" alt="MaxTV Pro" className="header-logo" />
          
          <div className="header-actions">
            <div className="giros-display">
              <span className="giros-label">Giros:</span>
              <span className="giros-count">{giros}</span>
            </div>
            
            <Button 
              onClick={() => navigate('/assinatura')}
              variant="outline"
              className="nav-button"
            >
              Planos
            </Button>
            
            {userData?.tipo === 'admin' && (
              <Button 
                onClick={() => navigate('/admin')}
                variant="outline"
                className="nav-button admin-button"
              >
                Admin
              </Button>
            )}
            
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="nav-button logout-button"
            >
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="roleta-container">
        <h1 className="roleta-title">
          Gire a <span>Roleta</span> e Ganhe Prêmios!
        </h1>
        
        <p className="roleta-subtitle">
          Cada giro pode te dar até 30 dias de assinatura grátis!
        </p>

        {/* Roleta */}
        <div className="roleta-wrapper">
          <div className="roleta-indicator">▼</div>
          
          <div 
            className="roleta-wheel"
            style={{
              transform: `rotate(${rotacao}deg)`,
              transition: girando ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none'
            }}
          >
            {PREMIOS.map((premio, index) => {
              const angle = (360 / PREMIOS.length) * index;
              return (
                <div
                  key={index}
                  className="roleta-segment"
                  style={{
                    transform: `rotate(${angle}deg)`,
                    background: premio.cor
                  }}
                >
                  <div className="segment-content">
                    <span>{premio.texto}</span>
                  </div>
                </div>
              );
            })}
            
            <div className="roleta-center">
              <span>MaxTV</span>
            </div>
          </div>
        </div>

        <Button 
          onClick={girarRoleta}
          disabled={girando || giros <= 0}
          className="girar-button"
        >
          {girando ? 'Girando...' : 'GIRAR ROLETA'}
        </Button>

        {giros === 0 && (
          <p className="sem-giros-msg">
            Você não possui giros. Compre abaixo!
          </p>
        )}

        {/* Pacotes de Giros */}
        <div className="pacotes-section">
          <h2 className="pacotes-title">Comprar Giros</h2>
          
          <div className="pacotes-grid">
            {PACOTES_GIROS.map((pacote, index) => (
              <Card key={index} className="pacote-card">
                <div className="pacote-header">
                  <span className="pacote-giros">{pacote.quantidade}</span>
                  <span className="pacote-label">Giro{pacote.quantidade > 1 ? 's' : ''}</span>
                </div>
                
                <div className="pacote-preco">
                  R$ {pacote.preco.toFixed(2).replace('.', ',')}
                </div>
                
                <Button
                  onClick={() => window.open(pacote.link, '_blank')}
                  className="pacote-button"
                >
                  COMPRAR
                </Button>
                
                <p className="pacote-obs">
                  Após o pagamento, entre em contato com o suporte
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Histórico */}
        {historico.length > 0 && (
          <div className="historico-section">
            <h2 className="historico-title">Histórico de Giros</h2>
            
            <div className="historico-lista">
              {historico.slice(0, 10).map((item, index) => (
                <div key={index} className="historico-item">
                  <span className="historico-premio">{item.premio}</span>
                  <span className="historico-data">
                    {new Date(item.timestamp).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="roleta-footer">
        <p>©️ 2025 MaxTV Pro • Todos os direitos reservados</p>
      </div>
    </div>
  );
};

export default Roleta;
