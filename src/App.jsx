import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('sabado'); // default tab
  const [user, setUser] = useState(null);
  const [codigoDia, setCodigoDia] = useState(null);
  const [contatos, setContatos] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Timer pedagio
  const [countdown, setCountdown] = useState(12);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [pedagioErro, setPedagioErro] = useState('');
  const [pedagioIniciado, setPedagioIniciado] = useState(false);

  // Form contatos
  const [showAddContato, setShowAddContato] = useState(false);
  const [newNome, setNewNome] = useState('');
  const [newRelacao, setNewRelacao] = useState('');
  const [newPrioritario, setNewPrioritario] = useState(false);
  const [contatoErro, setContatoErro] = useState('');

  // Audio Player
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const audioRef = useRef(null);

  // Micro-pausa Sabático
  const [breathState, setBreathState] = useState('Clique para iniciar');
  const [breathTimer, setBreathTimer] = useState(0);
  const [isBreathing, setIsBreathing] = useState(false);

  // Pagamento simulado
  const [paymentPreferenceId, setPaymentPreferenceId] = useState('');
  const [isPaying, setIsPaying] = useState(false);

  // Estado do Carrossel de Imagens no topo
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselImages = ['/Imagens/1.png', '/Imagens/2.png', '/Imagens/3.png'];

  // Estados da Bíblia
  const [bibleSearchQuery, setBibleSearchQuery] = useState('');
  const [bibleResults, setBibleResults] = useState([]);
  const [bibleLoading, setBibleLoading] = useState(false);
  const [bibleError, setBibleError] = useState('');

  const API_BASE = import.meta.env.PROD ? '/api/v1' : 'http://localhost:3001/api/v1';

  // Funções da Bíblia
  const searchBible = async (e) => {
    e.preventDefault();
    if (!bibleSearchQuery || bibleSearchQuery.length < 3) {
      setBibleError('Digite pelo menos 3 letras para buscar.');
      return;
    }
    setBibleLoading(true);
    setBibleError('');
    try {
      const res = await fetch(`${API_BASE}/biblia/busca?q=${encodeURIComponent(bibleSearchQuery)}`);
      const data = await res.json();
      if (res.ok) {
        setBibleResults(data);
        if (data.length === 0) setBibleError('Nenhum versículo encontrado.');
      } else {
        setBibleError(data.error);
      }
    } catch (err) {
      setBibleError('Erro de conexão ao buscar na Bíblia.');
    } finally {
      setBibleLoading(false);
    }
  };

  const getRandomVerse = async () => {
    setBibleLoading(true);
    setBibleError('');
    try {
      const res = await fetch(`${API_BASE}/biblia/aleatorio`);
      const data = await res.json();
      if (res.ok) {
        setBibleResults([data]);
        setBibleSearchQuery(''); // Limpa a busca pra ficar focado no aleatório
      }
    } catch (err) {
      setBibleError('Erro ao puxar promessa.');
    } finally {
      setBibleLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Versículo copiado!');
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Carrega dados iniciais
  const loadAppData = async () => {
    try {
      const resUser = await fetch(`${API_BASE}/codigo-dia`);
      if (resUser.ok) {
        const data = await resUser.json();
        setUser(data.user);
        setCodigoDia(data.code);

        // Se o checkpoint do dia não foi concluído, força a tela do pedágio
        if (data.user && !data.user.checkpoint_completado) {
          setActiveTab('pedagio');
          if (!pedagioIniciado) {
            iniciarPedagio();
          }
        } else {
          setActiveTab('sabado'); // vai para a home default
        }
      }
      
      // Carrega contatos
      const resContatos = await fetch(`${API_BASE}/contatos`);
      if (resContatos.ok) {
        const dataContatos = await resContatos.json();
        setContatos(dataContatos);
      }

      // Carrega histórico
      const resHist = await fetch(`${API_BASE}/historico`);
      if (resHist.ok) {
        const dataHist = await resHist.json();
        setHistorico(dataHist.rows || []);
      }
    } catch (err) {
      console.error('Erro de conexão com o servidor backend:', err);
    }
  };

  useEffect(() => {
    loadAppData();
  }, []);

  // Iniciar Pedágio
  const iniciarPedagio = async () => {
    try {
      setPedagioIniciado(true);
      setCountdown(12);
      setIsCountdownActive(true);
      await fetch(`${API_BASE}/checkpoint/start`, { method: 'POST' });
    } catch (err) {
      console.error(err);
    }
  };

  // Cronômetro do pedágio
  useEffect(() => {
    let timer;
    if (activeTab === 'pedagio' && isCountdownActive && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsCountdownActive(false);
    }
    return () => clearTimeout(timer);
  }, [countdown, activeTab, isCountdownActive]);

  // Completar Pedágio
  const destravarAgora = async () => {
    try {
      const res = await fetch(`${API_BASE}/sync-checkpoint`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setPedagioIniciado(false);
        setPedagioErro('');
        loadAppData(); // recarrega o estado atualizado
      } else {
        setPedagioErro(data.error || 'Erro ao destravar o Agora');
      }
    } catch (err) {
      setPedagioErro('Erro de comunicação com o servidor.');
    }
  };

  // Gerenciamento de Contatos
  const handleAddContato = async (e) => {
    e.preventDefault();
    setContatoErro('');
    if (!newNome || !newRelacao) {
      setContatoErro('Preencha todos os campos obrigatórios.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/contatos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: newNome,
          relacao: newRelacao,
          prioritario: newPrioritario
        })
      });
      const data = await res.json();
      if (res.ok) {
        setNewNome('');
        setNewRelacao('');
        setNewPrioritario(false);
        setShowAddContato(false);
        loadAppData();
      } else {
        setContatoErro(data.error || 'Erro ao cadastrar contato.');
      }
    } catch (err) {
      setContatoErro('Falha de conexão com o servidor.');
    }
  };

  const deletarContato = async (id) => {
    if (!confirm('Deseja realmente remover este contato?')) return;
    try {
      await fetch(`${API_BASE}/contatos/${id}`, { method: 'DELETE' });
      loadAppData();
    } catch (err) {
      console.error(err);
    }
  };

  const registrarAcao = async (id, tipoAcao) => {
    try {
      await fetch(`${API_BASE}/contatos/${id}/acao`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipoAcao })
      });
      loadAppData();
    } catch (err) {
      console.error(err);
    }
  };

  // Lógica de Meditação Sabática (Respiração de 3 segundos por fase)
  const iniciarRespiracao = () => {
    if (isBreathing) return;
    setIsBreathing(true);
    let step = 0;
    const states = [
      { text: 'Inspire...', class: 'inhaling', duration: 3 },
      { text: 'Segure...', class: 'holding', duration: 3 },
      { text: 'Expire...', class: 'exhaling', duration: 3 }
    ];

    const runSequence = () => {
      if (step >= states.length) {
        setBreathState('Desfrute Completo!');
        setIsBreathing(false);
        return;
      }
      const current = states[step];
      setBreathState(current.text);
      setBreathTimer(current.duration);

      let countdownVal = current.duration;
      const interval = setInterval(() => {
        countdownVal -= 1;
        setBreathTimer(countdownVal);
        if (countdownVal <= 0) {
          clearInterval(interval);
          step += 1;
          runSequence();
        }
      }, 1000);
    };

    runSequence();
  };

  // Player de Áudio
  useEffect(() => {
    if (audioRef.current) {
      if (audioPlaying) {
        audioRef.current.play().catch(() => setAudioPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [audioPlaying]);

  const onAudioTimeUpdate = () => {
    if (audioRef.current) {
      setAudioCurrentTime(audioRef.current.currentTime);
    }
  };

  const onAudioLoadedMetadata = () => {
    if (audioRef.current) {
      setAudioDuration(audioRef.current.duration);
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleProgressBarClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newPercentage = clickX / width;
    if (audioRef.current) {
      audioRef.current.currentTime = newPercentage * audioDuration;
      setAudioCurrentTime(audioRef.current.currentTime);
    }
  };

  // Fluxo de Pagamento com Mercado Pago
  const iniciarCheckoutMercadoPago = async () => {
    try {
      setIsPaying(true);
      const res = await fetch(`${API_BASE}/pagamentos/criar-preferencia`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setPaymentPreferenceId(data.preferenceId);
        setActiveTab('simular-pagamento');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPaying(false);
    }
  };

  const finalizarPagamentoSimulado = async () => {
    try {
      const res = await fetch(`${API_BASE}/pagamentos/webhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'payment.created',
          pref_id: paymentPreferenceId
        })
      });
      if (res.ok) {
        alert('Pagamento aprovado pelo Mercado Pago! Plano Premium ativado.');
        loadAppData();
        setActiveTab('sabado');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Funções administrativas/teste
  const avancarDia = async () => {
    try {
      const res = await fetch(`${API_BASE}/avancar-dia`, { method: 'POST' });
      if (res.ok) {
        loadAppData();
        alert('Avançou para o próximo dia com sucesso!');
      } else {
        alert('Erro ao avançar dia. Verifique se o Pedágio foi concluído.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const reiniciarJornada = async () => {
    if (!confirm('Deseja reiniciar ao Dia 1?')) return;
    try {
      await fetch(`${API_BASE}/reiniciar-jornada`, { method: 'POST' });
      loadAppData();
    } catch (err) {
      console.error(err);
    }
  };

  const alterarPlanoAdmin = async (plano) => {
    try {
      await fetch(`${API_BASE}/admin/definir-plano`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plano })
      });
      loadAppData();
    } catch (err) {
      console.error(err);
    }
  };

  // Verifica Alerta de 48 horas sem convite
  const verificarAlerta48h = (contato) => {
    if (!contato.prioritario) return false;
    if (contato.ultimo_convite_timestamp === 0) return true; // nunca convidado
    const diffHours = (Date.now() - contato.ultimo_convite_timestamp) / (1000 * 60 * 60);
    return diffHours >= 48;
  };

  // Renderização condicional das abas
  if (activeTab === 'pedagio' && codigoDia) {
    const isProposito = codigoDia.pilar_origem === 'PROPÓSITO_M2414';
    return (
      <div className="pedagio-overlay">
        <div className="pedagio-container">
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <img src="/LOGOMARCA.png" alt="1Convite" style={{ height: '40px', objectFit: 'contain' }} />
          </div>
          <div className="pedagio-header">
            <div className={`pedagio-badge ${isProposito ? 'badge-proposito' : 'badge-recompensa'}`}>
              {isProposito ? 'MATEUS 24:14 — PROPÓSITO' : 'APOCALIPSE 3:21 — RECOMPENSA'}
            </div>
            <h1>Dia {codigoDia.dia_id} da Jornada</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Alinhamento mental no Agora de Deus</p>
          </div>

          <div className="pedagio-card">
            <div className="pedagio-codigo">"{codigoDia.codigo_verbal}"</div>
            <div className="pedagio-versiculo">{codigoDia.versiculo_chave}</div>
            <div className="pedagio-reflexao">{codigoDia.texto_reflexao}</div>
          </div>

          <div style={{ textSelf: 'center', width: '100%' }}>
            {countdown > 0 ? (
              <div className="timer-circle">
                <span>{countdown}</span>
              </div>
            ) : null}

            {pedagioErro && <p style={{ color: '#ef4444', textAlign: 'center', marginBottom: '10px' }}>{pedagioErro}</p>}

            <button
              className="btn-primary"
              onClick={destravarAgora}
              disabled={countdown > 0}
            >
              {countdown > 0 ? 'Medite no Texto para Destravar' : 'Destravar o Agora'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header Fixo */}
      <header className="app-header">
        <div className="app-logo" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/LOGOMARCA.png" alt="1Convite" style={{ height: '28px', objectFit: 'contain' }} />
        </div>
        <div className="flex-between" style={{ gap: '10px' }}>
          {user && (
            <span className={`premium-status-badge ${user.status_plano === 'FREE' ? 'btn-secondary' : ''}`} style={{ fontSize: '0.7rem' }}>
              Plano {user.status_plano}
            </span>
          )}
          {user && (
            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>
              Dia {user.dia_atual}
            </span>
          )}
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="main-content">

        {/* --- ABA SABADO (PLAYER DO DESFRUTE E MEDITAÇÃO) --- */}
        {activeTab === 'sabado' && codigoDia && (
          <div className="flex-column gap-md">
            {/* Carrossel de Imagens no Topo */}
            <div className="carousel-container">
              <div className="carousel-wrapper" style={{ transform: `translateX(-${carouselIndex * 100}%)` }}>
                {carouselImages.map((src, idx) => (
                  <img key={idx} src={src} alt={`Banner ${idx + 1}`} className="carousel-image" />
                ))}
              </div>
              <div className="carousel-dots">
                {carouselImages.map((_, idx) => (
                  <button
                    key={idx}
                    className={`carousel-dot ${idx === carouselIndex ? 'active' : ''}`}
                    onClick={() => setCarouselIndex(idx)}
                    style={{ border: 'none', background: 'none' }}
                  />
                ))}
              </div>
            </div>

            <div className="glass-panel text-center">
              <div className={`pedagio-badge ${codigoDia.pilar_origem === 'PROPÓSITO_M2414' ? 'badge-proposito' : 'badge-recompensa'}`} style={{ marginBottom: '10px' }}>
                CÓDIGO DE HOJE
              </div>
              <h2 style={{ marginBottom: '10px', fontSize: '1.4rem' }}>{codigoDia.codigo_verbal}</h2>
              <p style={{ fontStyle: 'italic', marginBottom: '15px' }}>{codigoDia.versiculo_chave}</p>
              <p>{codigoDia.texto_reflexao}</p>
            </div>

            <div className="glass-panel">
              <h3 className="text-center" style={{ marginBottom: '15px' }}>
                Meditação Guiada
                {user?.status_plano === 'FREE' && <span className="premium-status-badge" style={{ marginLeft: '8px', fontSize: '0.6rem' }}>Premium</span>}
              </h3>
              
              {user?.status_plano === 'FREE' ? (
                <div className="text-center" style={{ padding: '10px' }}>
                  <p style={{ marginBottom: '15px' }}>Os áudios das meditações diárias são exclusivos para assinantes do plano Premium.</p>
                  <button className="btn-primary" onClick={() => setActiveTab('upgrade')}>
                    Destravar Meditações Guiadas
                  </button>
                </div>
              ) : (
                <div className="player-container">
                  {codigoDia.url_audio_meditacao && (
                    <audio
                      ref={audioRef}
                      src={codigoDia.url_audio_meditacao}
                      onTimeUpdate={onAudioTimeUpdate}
                      onLoadedMetadata={onAudioLoadedMetadata}
                    />
                  )}
                  <p style={{ fontSize: '0.9rem', color: 'var(--accent-gold)', fontWeight: '600' }}>
                    Áudio de Alinhamento - Dia {codigoDia.dia_id}
                  </p>
                  <div className="progress-bar-container" onClick={handleProgressBarClick}>
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${(audioCurrentTime / (audioDuration || 1)) * 100}%` }}
                    />
                  </div>
                  <div className="flex-between" style={{ width: '100%', fontSize: '0.8rem', marginTop: '6px' }}>
                    <span>{formatTime(audioCurrentTime)}</span>
                    <span>{formatTime(audioDuration)}</span>
                  </div>

                  <div className="player-controls">
                    <button className="btn-play-pause" onClick={() => setAudioPlaying(!audioPlaying)}>
                      {audioPlaying ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16" style={{ marginLeft: '4px' }}>
                          <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="glass-panel text-center">
              <h3 style={{ marginBottom: '10px' }}>O Botão do Descanso</h3>
              <p style={{ marginBottom: '15px', fontSize: '0.9rem' }}>Micro-pausa de 3 segundos baseada na respiração e ancoragem no Agora de Deus.</p>
              
              <div className="breath-button-container">
                <button
                  className={`breath-circle ${isBreathing ? 'inhaling' : ''}`}
                  onClick={iniciarRespiracao}
                  disabled={isBreathing}
                >
                  <span style={{ fontSize: '0.95rem' }}>{breathState}</span>
                  {isBreathing && <span style={{ fontSize: '1.2rem', marginTop: '5px' }}>{breathTimer}s</span>}
                </button>
              </div>
            </div>
            
            {/* Seção Administrativa de Teste */}
            <div className="glass-panel" style={{ border: '1px dashed rgba(229, 169, 59, 0.4)' }}>
              <h4 style={{ color: 'var(--accent-gold)', marginBottom: '10px', fontSize: '0.9rem' }}>Ferramentas de Simulação (Desenvolvedor)</h4>
              <div className="flex-column gap-sm">
                <button className="btn-secondary" style={{ padding: '8px', fontSize: '0.8rem' }} onClick={avancarDia}>
                  Simular Avanço de Dia (Avançar do Dia {user?.dia_atual} para {user?.dia_atual + 1})
                </button>
                <div className="flex-between gap-sm">
                  <button className="btn-secondary" style={{ padding: '8px', fontSize: '0.8rem', flex: 1 }} onClick={() => alterarPlanoAdmin('FREE')}>
                    Mudar para Plano FREE
                  </button>
                  <button className="btn-secondary" style={{ padding: '8px', fontSize: '0.8rem', flex: 1 }} onClick={() => alterarPlanoAdmin('PREMIUM')}>
                    Mudar para PREMIUM
                  </button>
                </div>
                <button className="btn-secondary" style={{ padding: '8px', fontSize: '0.8rem', color: '#ef4444' }} onClick={reiniciarJornada}>
                  Reiniciar ao Dia 1
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- ABA CONTATOS (MATEUS 24:14 - AÇÃO PRÁTICA) --- */}
        {activeTab === 'contatos' && (
          <div className="flex-column gap-md">
            <div className="flex-between">
              <h2>Lista de Contatos</h2>
              <button className="btn-primary" style={{ width: 'auto', padding: '8px 16px', fontSize: '0.9rem' }} onClick={() => setShowAddContato(!showAddContato)}>
                {showAddContato ? 'Fechar' : 'Novo Contato'}
              </button>
            </div>

            {/* Alertas Automáticos de Distanciamento */}
            {contatos.filter(verificarAlerta48h).map(c => (
              <div key={`alert-${c.id}`} className="glass-panel alert-warning" style={{ padding: '12px 16px', marginBottom: '0px' }}>
                <p style={{ color: '#ef4444', fontWeight: '600', fontSize: '0.9rem' }}>
                  ⚠️ Alerta de Distanciamento: Você tem notado a(o) <strong>{c.nome}</strong> ({c.relacao}) no Agora? Faça 1Convite de conexão hoje.
                </p>
              </div>
            ))}

            {showAddContato && (
              <form onSubmit={handleAddContato} className="glass-panel">
                <h3 style={{ marginBottom: '15px' }}>Adicionar Próximo</h3>
                {contatoErro && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '10px' }}>{contatoErro}</p>}
                
                <div className="form-group">
                  <label>Nome Completo</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newNome}
                    onChange={e => setNewNome(e.target.value)}
                    placeholder="Ex: Maria (Esposa), João (Filho)"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Relação / Vínculo</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newRelacao}
                    onChange={e => setNewRelacao(e.target.value)}
                    placeholder="Ex: Família, Vizinho, Trabalho"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={newPrioritario}
                      onChange={e => setNewPrioritario(e.target.checked)}
                    />
                    Contato Prioritário (Exige atenção a cada 48h)
                  </label>
                </div>

                <button type="submit" className="btn-primary">Salvar no Reino</button>
              </form>
            )}

            <div>
              {contatos.length === 0 ? (
                <p className="text-center" style={{ padding: '40px 0' }}>Nenhum contato cadastrado. Adicione pessoas do seu convívio diário para começar a notá-las ativamente.</p>
              ) : (
                contatos.map(c => (
                  <div key={c.id} className="contact-item flex-column gap-sm">
                    <div className="flex-between" style={{ width: '100%' }}>
                      <div className="contact-info">
                        <div className="contact-name">
                          {c.nome}
                          {c.prioritario && <span className="priority-tag">Prioritário</span>}
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Vínculo: {c.relacao}</span>
                      </div>
                      <button
                        onClick={() => deletarContato(c.id)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex-between" style={{ width: '100%', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px', marginTop: '5px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        Último convite:{' '}
                        {c.ultimo_convite_timestamp > 0
                          ? new Date(c.ultimo_convite_timestamp).toLocaleDateString('pt-BR')
                          : 'Nunca'}
                      </span>
                      
                      <div className="flex-between" style={{ gap: '6px' }}>
                        <button className="btn-secondary" style={{ padding: '6px 10px', fontSize: '0.75rem', borderRadius: '6px' }} onClick={() => registrarAcao(c.id, 'mensagem')}>
                          💬 Mensagem
                        </button>
                        <button className="btn-secondary" style={{ padding: '6px 10px', fontSize: '0.75rem', borderRadius: '6px' }} onClick={() => registrarAcao(c.id, 'cafe')}>
                          ☕ Café
                        </button>
                        <button className="btn-secondary" style={{ padding: '6px 10px', fontSize: '0.75rem', borderRadius: '6px' }} onClick={() => registrarAcao(c.id, 'casa_igreja')}>
                          🏠 Conectar
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {user?.status_plano === 'FREE' && contatos.length >= 3 && (
                <div className="glass-panel text-center" style={{ borderColor: 'var(--accent-gold)', marginTop: '20px' }}>
                  <p style={{ marginBottom: '10px' }}>Você atingiu o limite máximo de 3 contatos salvos na Camada Gratuita.</p>
                  <button className="btn-primary" onClick={() => setActiveTab('upgrade')}>
                    Desbloquear Contatos Ilimitados
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- ABA BÍBLIA --- */}
        {activeTab === 'biblia' && (
          <div className="flex-column gap-md">
            <h2 className="text-center" style={{ marginBottom: '10px' }}>A Palavra Viva</h2>
            
            <div className="glass-panel text-center" style={{ marginBottom: '10px' }}>
              <p style={{ marginBottom: '15px' }}>Deixe Deus falar com você hoje ou encontre a passagem ideal para convidar um amigo.</p>
              
              <button className="btn-primary" onClick={getRandomVerse} disabled={bibleLoading}>
                {bibleLoading ? 'Sorteando...' : '🎲 Puxar uma Promessa Aleatória'}
              </button>
            </div>

            <div className="glass-panel">
              <h3 style={{ marginBottom: '15px' }}>Buscador Inteligente</h3>
              <form onSubmit={searchBible} style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Ex: ansiedade, amor, perdão..."
                  value={bibleSearchQuery}
                  onChange={(e) => setBibleSearchQuery(e.target.value)}
                />
                <button type="submit" className="btn-secondary" disabled={bibleLoading}>
                  🔍 Buscar
                </button>
              </form>
              {bibleError && <p style={{ color: '#ef4444', marginTop: '10px', fontSize: '0.9rem' }}>{bibleError}</p>}
            </div>

            {/* Resultados */}
            <div className="flex-column gap-sm">
              {bibleResults.map((v, idx) => (
                <div key={idx} className="glass-panel" style={{ position: 'relative' }}>
                  <span className="premium-status-badge" style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,255,255,0.1)' }}>
                    {v.livro_nome} {v.capitulo}:{v.versiculo}
                  </span>
                  <p style={{ marginTop: '20px', fontStyle: 'italic' }}>"{v.texto}"</p>
                  
                  <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                    <button 
                      className="btn-secondary" 
                      style={{ flex: 1, padding: '8px', fontSize: '0.8rem' }}
                      onClick={() => copyToClipboard(`"${v.texto}" - ${v.livro_nome} ${v.capitulo}:${v.versiculo}`)}
                    >
                      📋 Copiar
                    </button>
                    <a 
                      href={`https://wa.me/?text=${encodeURIComponent(`*"${v.texto}"*\n_${v.livro_nome} ${v.capitulo}:${v.versiculo}_\n\n👉 *Descubra o propósito no 1Convite:* https://1convite.com.br`)}`} 
                      target="_blank" rel="noopener noreferrer"
                      className="btn-primary"
                      style={{ flex: 2, padding: '8px', fontSize: '0.8rem', textAlign: 'center', textDecoration: 'none' }}
                    >
                      📲 Enviar para Contato
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- ABA HISTÓRICO DE CÓDIGOS (EXCLUSIVO PREMIUM) --- */}
        {activeTab === 'historico' && (
          <div className="flex-column gap-md">
            <h2>Histórico de Códigos</h2>
            
            {user?.status_plano === 'FREE' ? (
              <div className="glass-panel text-center" style={{ padding: '30px 20px' }}>
                <div className="timer-circle" style={{ borderColor: 'var(--accent-gold)' }}>🔒</div>
                <h3 style={{ margin: '15px 0' }}>Funcionalidade Premium</h3>
                <p style={{ marginBottom: '20px' }}>Tenha acesso ao mural completo de códigos destravados, buscas rápidas e devocionais passadas.</p>
                <button className="btn-primary" onClick={() => setActiveTab('upgrade')}>
                  Destravar Histórico e Busca
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 1A5 5 0 1 1 8 3a5 5 0 0 1 0 10z"/>
                  </svg>
                </button>
              </div>
            ) : (
              <>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="🔍 Pesquisar código, versículo ou palavra-chave..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex-column gap-sm">
                  {historico
                    .filter(item => 
                      item.codigo_verbal.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      item.versiculo_chave.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      item.texto_reflexao.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map(item => (
                      <div key={item.dia_id} className="glass-panel" style={{ padding: '16px' }}>
                        <div className="flex-between" style={{ marginBottom: '8px' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', fontWeight: '600' }}>
                            DIA {item.dia_id} — {item.pilar_origem.replace('_', ' ')}
                          </span>
                        </div>
                        <h3 style={{ fontSize: '1rem', marginBottom: '8px' }}>{item.codigo_verbal}</h3>
                        <p style={{ fontStyle: 'italic', fontSize: '0.85rem', marginBottom: '8px', color: 'var(--text-muted)' }}>{item.versiculo_chave}</p>
                        <p style={{ fontSize: '0.9rem' }}>{item.texto_reflexao}</p>
                      </div>
                    ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* --- ABA UPGRADE (MERCADO PAGO) --- */}
        {activeTab === 'upgrade' && (
          <div className="flex-column gap-md">
            <div className="glass-panel text-center">
              <h2 style={{ fontSize: '1.6rem', color: 'var(--accent-gold)' }}>Ative o Plano Premium</h2>
              <p style={{ margin: '10px 0 20px' }}>Entre no governo do Reino e desfrute plenamente das ferramentas de transformação.</p>
              
              <div className="flex-column gap-sm" style={{ textAlign: 'left', marginBottom: '20px' }}>
                <div className="flex-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                  <span>🎧 Meditações Guiadas (365 áudios)</span>
                  <span style={{ color: 'var(--accent-teal)', fontWeight: '600' }}>Liberado</span>
                </div>
                <div className="flex-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                  <span>👥 Contatos do Ide (Mateus 24:14)</span>
                  <span style={{ color: 'var(--accent-teal)', fontWeight: '600' }}>Ilimitados</span>
                </div>
                <div className="flex-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                  <span>⚠️ Alertas de Conexão (48h)</span>
                  <span style={{ color: 'var(--accent-teal)', fontWeight: '600' }}>Automáticos</span>
                </div>
                <div className="flex-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                  <span>📖 Mural de Códigos e Pesquisa Histórica</span>
                  <span style={{ color: 'var(--accent-teal)', fontWeight: '600' }}>Liberado</span>
                </div>
              </div>

              <div style={{ margin: '20px 0' }}>
                <span style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)' }}>R$ 19,90</span>
                <span style={{ color: 'var(--text-secondary)' }}> / mensal</span>
              </div>

              <button className="btn-primary" onClick={iniciarCheckoutMercadoPago} disabled={isPaying}>
                {isPaying ? 'Gerando Preferência...' : 'Assinar com Mercado Pago'}
              </button>
            </div>
          </div>
        )}

        {/* --- TELA MOCK MERCADO PAGO --- */}
        {activeTab === 'simular-pagamento' && (
          <div className="flex-column gap-md">
            <div className="glass-panel" style={{ borderTop: '4px solid #009ee3' }}>
              <div className="flex-between" style={{ marginBottom: '15px' }}>
                <span style={{ color: '#009ee3', fontWeight: '700', fontSize: '1.2rem' }}>mercado pago</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>SANDBOX</span>
              </div>
              <h3 style={{ marginBottom: '15px' }}>Resumo da Assinatura</h3>
              <div className="flex-between" style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '8px', marginBottom: '20px' }}>
                <span>1Convite Premium - Plano Recorrente</span>
                <strong>R$ 19,90</strong>
              </div>

              <p style={{ fontSize: '0.85rem', marginBottom: '20px' }}>
                Você está no ambiente de checkout seguro do Mercado Pago. Clique no botão abaixo para simular a aprovação e retorno instantâneo do pagamento via Pix/Cartão.
              </p>

              <button className="btn-primary" style={{ background: '#009ee3', color: '#fff' }} onClick={finalizarPagamentoSimulado}>
                ⚡ Confirmar e Simular Aprovação
              </button>
              
              <button className="btn-secondary" style={{ marginTop: '10px', width: '100%' }} onClick={() => setActiveTab('upgrade')}>
                Cancelar
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Navegação por Abas inferior */}
      {activeTab !== 'pedagio' && activeTab !== 'simular-pagamento' && (
        <nav className="nav-tabs">
          <button
            className={`tab-item ${activeTab === 'sabado' ? 'active' : ''}`}
            onClick={() => setActiveTab('sabado')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            Sabático
          </button>
          
          <button
            className={`tab-item ${activeTab === 'biblia' ? 'active' : ''}`}
            onClick={() => setActiveTab('biblia')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Bíblia
          </button>
          
          <button
            className={`tab-item ${activeTab === 'contatos' ? 'active' : ''}`}
            onClick={() => setActiveTab('contatos')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Contatos
          </button>
          
          <button
            className={`tab-item ${activeTab === 'historico' ? 'active' : ''}`}
            onClick={() => setActiveTab('historico')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Histórico
          </button>

          <button
            className={`tab-item ${activeTab === 'upgrade' ? 'active' : ''}`}
            onClick={() => setActiveTab('upgrade')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            Premium
          </button>
        </nav>
      )}
    </>
  );
}

export default App;
