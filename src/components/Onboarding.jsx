import React, { useState } from 'react';

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [respostas, setRespostas] = useState({
    objetivo: '',
    conexao: '',
    horario: '08:00',
    versaoBiblia: 'NVI'
  });

  const objetivos = [
    { key: 'relacionamento', text: '💑 Fortalecer meu relacionamento / casamento' },
    { key: 'paz', text: '🕊️ Reduzir ansiedade e cultivar paz interior' },
    { key: 'espiritual', text: '📖 Crescimento espiritual e leitura bíblica' },
    { key: 'conexoes', text: '🤝 Conectar intencionalmente com amigos e família' }
  ];

  const conexoes = [
    { key: 'oracao', text: '🙏 Momentos diários de oração silenciosa' },
    { key: 'leitura', text: '📖 Leitura e meditação em versículos' },
    { key: 'conselheiro', text: '🤖 Conversas e reflexões com o Conselheiro IA' },
    { key: 'pratica', text: '🚶 Praticar atitudes ativas de carinho e caridade' }
  ];

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => Math.max(0, prev - 1));
  };

  const selectObjetivo = (val) => {
    setRespostas(prev => ({ ...prev, objetivo: val }));
    handleNext();
  };

  const selectConexao = (val) => {
    setRespostas(prev => ({ ...prev, conexao: val }));
    handleNext();
  };

  const handleFinish = () => {
    localStorage.setItem('onboarding-completed', 'true');
    localStorage.setItem('onboarding-data', JSON.stringify(respostas));
    onComplete(respostas);
  };

  return (
    <div className="onboarding-overlay" style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'var(--bg-app)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '24px',
      boxSizing: 'border-box'
    }}>
      <div className="onboarding-card glass-panel" style={{
        width: '100%',
        maxWidth: '400px',
        padding: '30px 24px',
        borderRadius: '24px',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--slate-border)',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        animation: 'fadeIn 0.3s ease-out'
      }}>
        {/* Progresso */}
        {step > 0 && step < 5 && (
          <div style={{ display: 'flex', gap: '4px', width: '100%' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{
                flex: 1,
                height: '4px',
                borderRadius: '2px',
                backgroundColor: i <= step ? 'var(--orange)' : 'var(--slate-light)',
                transition: 'background-color 0.2s'
              }} />
            ))}
          </div>
        )}

        {/* Passo 0: Boas-vindas */}
        {step === 0 && (
          <div className="flex-column gap-md text-center" style={{ animation: 'fadeIn 0.2s' }}>
            <div style={{ margin: '15px 0', display: 'flex', justifyContent: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="90" height="90">
                <defs>
                  <radialGradient id="obFlame" cx="50%" cy="65%" r="55%">
                    <stop offset="0%" stopColor="#FFF0A0"/>
                    <stop offset="40%" stopColor="#FFB300"/>
                    <stop offset="100%" stopColor="#E85500"/>
                  </radialGradient>
                  <linearGradient id="obTip" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#FF6000"/>
                    <stop offset="100%" stopColor="#FFB300"/>
                  </linearGradient>
                </defs>
                <ellipse cx="50" cy="85" rx="30" ry="6" fill="rgba(0,0,0,0.12)"/>
                <path d="M50 15 C46 22 40 26 40 35 C40 44 46 48 50 50 C54 48 60 44 60 35 C60 26 54 22 50 15Z" fill="url(#obTip)"/>
                <path d="M44 28 C41 32 40 37 42 40 C44 37 45 34 47 32Z" fill="#FF8C00" opacity="0.7"/>
                <path d="M56 28 C59 32 60 37 58 40 C56 37 55 34 53 32Z" fill="#FF8C00" opacity="0.7"/>
                <ellipse cx="50" cy="55" rx="20" ry="24" fill="url(#obFlame)"/>
                <ellipse cx="44" cy="48" rx="6" ry="7" fill="rgba(255,255,200,0.35)" transform="rotate(-10,44,48)"/>
                <ellipse cx="44" cy="53" rx="4.5" ry="5" fill="#3D1A00"/>
                <ellipse cx="56" cy="53" rx="4.5" ry="5" fill="#3D1A00"/>
                <circle cx="42.5" cy="51" r="1.5" fill="white"/>
                <circle cx="54.5" cy="51" r="1.5" fill="white"/>
                <ellipse cx="38" cy="58" rx="4" ry="2.5" fill="#FF7B00" opacity="0.45"/>
                <ellipse cx="62" cy="58" rx="4" ry="2.5" fill="#FF7B00" opacity="0.45"/>
                <path d="M45 61 Q50 65 55 61" fill="none" stroke="#3D1A00" strokeWidth="2" strokeLinecap="round"/>
                <ellipse cx="42" cy="78" rx="7" ry="4" fill="#E8720A"/>
                <ellipse cx="58" cy="78" rx="7" ry="4" fill="#E8720A"/>
              </svg>
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-primary)' }}>Bem-vindo ao 1Convite</h1>
            <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Uma jornada intencional de 365 dias para trazer conexões profundas, paz espiritual e amor no seu dia a dia.
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Vamos responder 3 perguntas rápidas para personalizar sua jornada.
            </p>
            <button className="btn-primary" onClick={handleNext} style={{ marginTop: '10px', width: '100%' }}>
              Começar Personalização
            </button>
          </div>
        )}

        {/* Passo 1: Objetivo Principal */}
        {step === 1 && (
          <div className="flex-column gap-md" style={{ animation: 'fadeIn 0.2s' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Qual o seu foco principal ao usar o app?
            </h2>
            <div className="flex-column gap-sm" style={{ marginTop: '10px' }}>
              {objetivos.map(obj => (
                <button
                  key={obj.key}
                  onClick={() => selectObjetivo(obj.key)}
                  className="chat-suggest-chip"
                  style={{
                    padding: '14px 18px',
                    textAlign: 'left',
                    borderRadius: '16px',
                    fontSize: '0.925rem',
                    border: '1px solid var(--slate-border)',
                    background: 'var(--white)',
                    color: 'var(--text-primary)',
                    width: '100%',
                    whiteSpace: 'normal',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'var(--orange)';
                    e.currentTarget.style.background = 'var(--orange-light)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'var(--slate-border)';
                    e.currentTarget.style.background = 'var(--white)';
                  }}
                >
                  {obj.text}
                </button>
              ))}
            </div>
            <button className="btn-secondary" onClick={handleBack} style={{ alignSelf: 'flex-start', marginTop: '10px' }}>
              Voltar
            </button>
          </div>
        )}

        {/* Passo 2: Modo de Conexão */}
        {step === 2 && (
          <div className="flex-column gap-md" style={{ animation: 'fadeIn 0.2s' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Como você prefere se conectar com Deus e com o próximo?
            </h2>
            <div className="flex-column gap-sm" style={{ marginTop: '10px' }}>
              {conexoes.map(con => (
                <button
                  key={con.key}
                  onClick={() => selectConexao(con.key)}
                  className="chat-suggest-chip"
                  style={{
                    padding: '14px 18px',
                    textAlign: 'left',
                    borderRadius: '16px',
                    fontSize: '0.925rem',
                    border: '1px solid var(--slate-border)',
                    background: 'var(--white)',
                    color: 'var(--text-primary)',
                    width: '100%',
                    whiteSpace: 'normal',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'var(--orange)';
                    e.currentTarget.style.background = 'var(--orange-light)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'var(--slate-border)';
                    e.currentTarget.style.background = 'var(--white)';
                  }}
                >
                  {con.text}
                </button>
              ))}
            </div>
            <button className="btn-secondary" onClick={handleBack} style={{ alignSelf: 'flex-start', marginTop: '10px' }}>
              Voltar
            </button>
          </div>
        )}

        {/* Passo 3: Versão da Bíblia */}
        {step === 3 && (
          <div className="flex-column gap-md" style={{ animation: 'fadeIn 0.2s', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
              Qual versão da Bíblia você usa?
            </h2>
            <div className="flex-column gap-sm" style={{ marginTop: '10px', width: '100%' }}>
              {['NVI', 'ARA', 'NVT', 'ACF', 'OUTRAS'].map(v => (
                <button
                  key={v}
                  onClick={() => {
                    setRespostas(prev => ({ ...prev, versaoBiblia: v }));
                  }}
                  style={{
                    padding: '14px 18px',
                    borderRadius: '16px',
                    fontSize: '0.95rem',
                    fontWeight: 'bold',
                    border: respostas.versaoBiblia === v ? '2.5px solid var(--orange)' : '1px solid var(--slate-border)',
                    background: respostas.versaoBiblia === v ? 'var(--orange-light)' : 'var(--white)',
                    color: 'var(--text-primary)',
                    width: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box'
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
              <button className="btn-secondary" onClick={handleBack}>
                Voltar
              </button>
              <button className="btn-primary" onClick={handleNext}>
                Continuar
              </button>
            </div>
          </div>
        )}

        {/* Passo 4: Horário de Lembretes */}
        {step === 4 && (
          <div className="flex-column gap-md" style={{ animation: 'fadeIn 0.2s' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Que horas deseja receber seu convite/desafio diário?
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Recomendamos o início da manhã para inspirar todo o seu dia.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
              <input
                type="time"
                value={respostas.horario}
                onChange={(e) => setRespostas(prev => ({ ...prev, horario: e.target.value }))}
                style={{
                  fontSize: '2rem',
                  padding: '10px 20px',
                  borderRadius: '16px',
                  border: '2px solid var(--orange)',
                  background: 'var(--white)',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit',
                  textAlign: 'center',
                  outline: 'none'
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              <button className="btn-secondary" onClick={handleBack}>
                Voltar
              </button>
              <button className="btn-primary" onClick={handleNext}>
                Avançar
              </button>
            </div>
          </div>
        )}
        
        {/* Passo 5: Conclusão */}
        {step === 5 && (
          <div className="flex-column gap-md text-center" style={{ animation: 'fadeIn 0.2s' }}>
            <div style={{ margin: '15px 0', display: 'flex', justifyContent: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="90" height="90">
                <defs>
                  <radialGradient id="finFlame" cx="50%" cy="65%" r="55%">
                    <stop offset="0%" stopColor="#FFF0A0"/>
                    <stop offset="40%" stopColor="#FFB300"/>
                    <stop offset="100%" stopColor="#E85500"/>
                  </radialGradient>
                  <linearGradient id="finTip" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#FF6000"/>
                    <stop offset="100%" stopColor="#FFB300"/>
                  </linearGradient>
                </defs>
                <ellipse cx="50" cy="85" rx="30" ry="6" fill="rgba(0,0,0,0.12)"/>
                
                {/* Chapéu de festa */}
                <polygon points="50,18 43,5 57,5" fill="#FF4500" stroke="#FFD700" strokeWidth="1" transform="rotate(15 50 15)"/>
                <circle cx="53" cy="2" r="3" fill="#FFD700" />
                
                <path d="M50 15 C46 22 40 26 40 35 C40 44 46 48 50 50 C54 48 60 44 60 35 C60 26 54 22 50 15Z" fill="url(#finTip)"/>
                <ellipse cx="50" cy="55" rx="20" ry="24" fill="url(#finFlame)"/>
                <ellipse cx="44" cy="48" rx="6" ry="7" fill="rgba(255,255,200,0.35)" transform="rotate(-10,44,48)"/>
                
                {/* Olhos piscando de alegria */}
                <path d="M41 53 Q44 50 47 53" fill="none" stroke="#3D1A00" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M53 53 Q56 50 59 53" fill="none" stroke="#3D1A00" strokeWidth="2.5" strokeLinecap="round"/>
                
                <ellipse cx="38" cy="58" rx="4" ry="2.5" fill="#FF7B00" opacity="0.45"/>
                <ellipse cx="62" cy="58" rx="4" ry="2.5" fill="#FF7B00" opacity="0.45"/>
                
                {/* Super sorriso */}
                <path d="M44 61 Q50 67 56 61" fill="none" stroke="#3D1A00" strokeWidth="2" strokeLinecap="round"/>
                
                <ellipse cx="42" cy="78" rx="7" ry="4" fill="#E8720A"/>
                <ellipse cx="58" cy="78" rx="7" ry="4" fill="#E8720A"/>
              </svg>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>Tudo Pronto!</h2>
            <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Seu perfil de jornada foi configurado com sucesso. Prepare-se para momentos incríveis de conexão.
            </p>
            <div className="glass-panel" style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--slate-border)',
              padding: '12px 16px',
              borderRadius: '16px',
              textAlign: 'left',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)'
            }}>
              💡 <strong>Dica:</strong> Se precisar mudar seus objetivos ou desativar lembretes, acesse o painel principal a qualquer momento.
            </div>
            <button className="btn-primary" onClick={handleFinish} style={{ marginTop: '10px', width: '100%' }}>
              Entrar no Aplicativo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
