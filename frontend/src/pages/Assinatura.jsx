import React from 'react';
import './Assinatura.css';

const Assinatura = () => {
  // Todos os planos organizados por período (do menor para o maior)
  const todosOsPlanos = [
    // 30 DIAS
    {
      duracao: "30 Dias",
      dias: 30,
      dispositivos: 1,
      preco: 19.99,
      precoAvista: null,
      economia: null,
      link: "https://ggcheckout.app/checkout/v2/Pis4HsvYCsHZC00Ewfy7"
    },
    {
      duracao: "30 Dias",
      dias: 30,
      dispositivos: 2,
      preco: 39.98,
      precoAvista: null,
      economia: null,
      link: "https://ggcheckout.app/checkout/v2/v7DUPxVfvvMxBYTx0BKM"
    },
    // 90 DIAS
    {
      duracao: "90 Dias",
      dias: 90,
      dispositivos: 1,
      preco: 59.98,
      precoAvista: null,
      economia: null,
      link: "https://ggcheckout.app/checkout/v2/4sSJinT0no9N6JRoPewd"
    },
    {
      duracao: "90 Dias",
      dias: 90,
      dispositivos: 2,
      preco: 119.94,
      precoAvista: null,
      economia: null,
      link: "https://ggcheckout.app/checkout/v2/9RDOqNeO95bnkgxELf6G"
    },
    // 180 DIAS
    {
      duracao: "180 Dias",
      dias: 180,
      dispositivos: 1,
      preco: 119.94,
      precoAvista: 107.95,
      economia: "10% OFF",
      link: "https://ggcheckout.app/checkout/v2/iUVsV2w3ru7Y1NM5rcyc"
    },
    {
      duracao: "180 Dias",
      dias: 180,
      dispositivos: 2,
      preco: 239.88,
      precoAvista: 225.49,
      economia: "6% OFF",
      link: "https://ggcheckout.app/checkout/v2/Ar76hWe0TSyENUlighUI"
    },
    // 270 DIAS
    {
      duracao: "270 Dias",
      dias: 270,
      dispositivos: 1,
      preco: 179.91,
      precoAvista: 156.52,
      economia: "13% OFF",
      link: "https://ggcheckout.app/checkout/v2/5s3XekSreE3BSjaaSdNE"
    },
    {
      duracao: "270 Dias",
      dias: 270,
      dispositivos: 2,
      preco: 359.82,
      precoAvista: 316.64,
      economia: "12% OFF",
      link: "https://ggcheckout.app/checkout/v2/Lo91WEsvoxeOAf9ZRW59"
    },
    // 360 DIAS
    {
      duracao: "360 Dias",
      dias: 360,
      dispositivos: 1,
      preco: 239.88,
      precoAvista: 191.90,
      economia: "20% OFF",
      link: "https://ggcheckout.app/checkout/v2/q6SXzFz4AVOE9gTbme7z"
    },
    {
      duracao: "360 Dias",
      dias: 360,
      dispositivos: 2,
      preco: 479.76,
      precoAvista: 388.81,
      economia: "20% OFF",
      link: "https://ggcheckout.app/checkout/v2/TRlqpA2IuE89Bltbdaxh"
    }
  ];

  const formatPreco = (valor) => {
    return valor.toFixed(2).replace('.', ',');
  };

  const calcularPrecoMensal = (precoTotal, dias) => {
    const meses = dias / 30;
    return precoTotal / meses;
  };

  return (
    <div className="assinatura-page">
      {/* LOGO */}
      <section className="logo-section">
        <div className="container">
          <img src="/icon/logo.png" alt="MaxTV Pro" className="logo-img" />
        </div>
      </section>

      {/* PLANOS */}
      <section className="planos-section">
        <div className="container">
          <h1 className="titulo">
            Escolha Seu <span>Plano</span>
          </h1>
          
          <p className="subtexto">
            Selecione o período e quantidade de dispositivos ideal para você
          </p>

          <div className="planos-grid-all">
            {todosOsPlanos.map((plano, index) => {
              const precoMensal = calcularPrecoMensal(plano.preco, plano.dias);
              const economiaValor = plano.precoAvista ? plano.preco - plano.precoAvista : 0;

              return (
                <div key={index} className="plano-item">
                  <div className="plano-badge">
                    {plano.dispositivos === 1 ? '📱 1 Dispositivo' : '📱📱 2 Dispositivos'}
                  </div>
                  
                  <div className="plano-header">
                    <div className="plano-duracao">{plano.duracao}</div>
                    <div className="plano-preco">R$ {formatPreco(plano.preco)}</div>
                    <div className="plano-preco-mensal">R$ {formatPreco(precoMensal)}/mês</div>
                    
                    {plano.precoAvista && (
                      <>
                        <div className="plano-preco-avista">
                          <span className="label">💰 Pagamento à vista no PIX</span>
                          <div className="valor">R$ {formatPreco(plano.precoAvista)}</div>
                        </div>
                        <div className="plano-economia">
                          Economize R$ {formatPreco(economiaValor)} • {plano.economia}
                        </div>
                      </>
                    )}
                  </div>
                  
                  <ul className="plano-beneficios">
                    <li>Acesso completo ao catálogo</li>
                    <li>{plano.dispositivos} dispositivo{plano.dispositivos > 1 ? 's' : ''} simultâneo{plano.dispositivos > 1 ? 's' : ''}</li>
                    <li>Qualidade HD e 4K</li>
                    <li>Suporte técnico incluído</li>
                    <li>Sem permanência</li>
                  </ul>
                  
                  <a 
                    href={plano.link} 
                    className="btn-assinar" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    🛒 ASSINAR AGORA
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer-section">
        <p>©️ 2025 • MaxTV Pro • Todos os direitos reservados</p>
        <p style={{ marginTop: '10px', fontSize: '0.85rem' }}>
          IPTV Premium com mais de 10.000 clientes satisfeitos
        </p>
      </footer>

      {/* BOTÃO FLUTUANTE WHATSAPP */}
      <a 
        href="https://wa.me/5541997043607?text=Olá!%20Tenho%20dúvidas%20sobre%20os%20planos%20MaxTV%20Pro."
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="Fale conosco no WhatsApp"
      >
        <span className="whatsapp-icon">💬</span>
      </a>
    </div>
  );
};

export default Assinatura;
