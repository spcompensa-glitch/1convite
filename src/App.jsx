import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('sabado');
  const [user, setUser] = useState(null);
  const [codigoDia, setCodigoDia] = useState(null);
  const [contatos, setContatos] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [countdown, setCountdown] = useState(12);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [pedagioErro, setPedagioErro] = useState('');
  const [pedagioIniciado, setPedagioIniciado] = useState(false);

  const [showAddContato, setShowAddContato] = useState(false);
  const [newNome, setNewNome] = useState('');
  const [newRelacao, setNewRelacao] = useState('');
  const [newPrioritario, setNewPrioritario] = useState(false);
  const [contatoErro, setContatoErro] = useState('');

  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const audioRef = useRef(null);

  const [breathState, setBreathState] = useState('Toque para iniciar');
  const [breathTimer, setBreathTimer] = useState(0);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathClass, setBreathClass] = useState('');

  const [paymentPreferenceId, setPaymentPreferenceId] = useState('');
  const [isPaying, setIsPaying] = useState(false);

  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselImages = ['/Imagens/1.png', '/Imagens/2.png', '/Imagens/3.png'];

  // Bíblia
  const [bibleViewMode, setBibleViewMode] = useState('reading');
  const [bibleBooks, setBibleBooks] = useState([]);
  const [bibleSelectedBook, setBibleSelectedBook] = useState({ livro_abrev: 'gn', livro_nome: 'Gênesis' });
  const [bibleChaptersCount, setBibleChaptersCount] = useState(50);
  const [bibleSelectedChapter, setBibleSelectedChapter] = useState(1);
  const [bibleVerses, setBibleVerses] = useState([]);
  const [bibleSelectedVerse, setBibleSelectedVerse] = useState(null);
  const [bibleSearchQuery, setBibleSearchQuery] = useState('');
  const [bibleResults, setBibleResults] = useState([]);
  const [bibleLoading, setBibleLoading] = useState(false);
  const [bibleError, setBibleError] = useState('');

  // Dicionário Teológico
  const [dicionario, setDicionario] = useState({});
  const [selectedDicionarioTermo, setSelectedDicionarioTermo] = useState(null);

  // Áudio da Bíblia
  const [bibleAudioUrl, setBibleAudioUrl] = useState('');
  const [bibleAudioPlaying, setBibleAudioPlaying] = useState(false);
  const [bibleAudioDuration, setBibleAudioDuration] = useState(0);
  const [bibleAudioCurrentTime, setBibleAudioCurrentTime] = useState(0);
  const bibleAudioRef = useRef(null);

  // Trilhas de Crescimento
  const [trilhaAtiva, setTrilhaAtiva] = useState(null);
  const [listaTrilhas, setListaTrilhas] = useState([]);
  const [trilhaLoading, setTrilhaLoading] = useState(false);

  // Modo Escuro & Perfil
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('1convite_dark_mode') === 'true');
  const [profileName, setProfileName] = useState('Membro Convidado');
  const [profileEmail, setProfileEmail] = useState('membro@1convite.com');
  const [profileAvatar, setProfileAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80');
  const [profileSavedMsg, setProfileSavedMsg] = useState('');

  // Login Dedicado
  const [loginEmail, setLoginEmail] = useState('');
  const [loginNome, setLoginNome] = useState('');
  const [loginMethod, setLoginMethod] = useState('google'); // 'google' ou 'email'
  const [loginError, setLoginError] = useState('');

  // Estados do Motor de Animação do Canvas por Scroll
  const [scrollPercent, setScrollPercent] = useState(0);
  const [framesLoaded, setFramesLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginNome) {
      setLoginError('Por favor, preencha todos os campos.');
      return;
    }
    const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(loginNome)}`;

    try {
      const res = await fetch(`${API_BASE}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: loginNome, email: loginEmail, avatar })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setProfileName(data.user.nome);
        setProfileEmail(data.user.email);
        setProfileAvatar(data.user.avatar);
        setLoginEmail('');
        setLoginNome('');
        setLoginError('');
      } else {
        setLoginError('Erro ao fazer o login.');
      }
    } catch {
      setLoginError('Erro de conexão ao servidor.');
    }
  };

  // Auxiliar para decodificar JWT do Google no Frontend
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Erro ao fazer parse do JWT', e);
      return null;
    }
  };

  useEffect(() => {
    if (profileEmail !== 'membro@1convite.com') return;

    const frameCount = 120;
    const isMobileDevice = window.innerWidth < 768;
    const folder = isMobileDevice ? 'mobile' : 'desktop';
    let loadedCount = 0;
    const imagesArray = [];

    // Pré-carregamento dos frames
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      const numStr = String(i).padStart(4, '0');
      img.src = `/intro_scroll/${folder}/frame-${numStr}.webp`;
      img.onload = () => {
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / frameCount) * 100));
        if (loadedCount === frameCount) {
          setFramesLoaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === frameCount) setFramesLoaded(true);
      };
      imagesArray.push(img);
    }
    imagesRef.current = imagesArray;

    // Loop do canvas e scroll
    let currentFrame = 0;
    let targetFrame = 0;
    let animId;

    const render = () => {
      const canvas = canvasRef.current;
      if (canvas && imagesRef.current.length > 0) {
        const ctx = canvas.getContext('2d');
        // Suavização do scroll com LERP
        currentFrame += (targetFrame - currentFrame) * 0.1;
        const frameIndex = Math.min(frameCount - 1, Math.max(0, Math.round(currentFrame)));
        const img = imagesRef.current[frameIndex];

        if (img && img.complete) {
          // Ajustar dimensões internas do canvas para a viewport
          if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
          }

          // Efeito cover no canvas
          const imgRatio = img.width / img.height;
          const canvasRatio = canvas.width / canvas.height;
          let drawWidth, drawHeight, x, y;

          if (canvasRatio > imgRatio) {
            drawWidth = canvas.width;
            drawHeight = canvas.width / imgRatio;
            x = 0;
            y = (canvas.height - drawHeight) / 2;
          } else {
            drawWidth = canvas.height * imgRatio;
            drawHeight = canvas.height;
            x = (canvas.width - drawWidth) / 2;
            y = 0;
          }

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, x, y, drawWidth, drawHeight);
        }
      }
      animId = requestAnimationFrame(render);
    };

    // Monitor do scroll
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const heroSectionHeight = windowHeight * 7; 
      const progress = Math.max(0, Math.min(1, scrollY / (heroSectionHeight - windowHeight)));
      
      setScrollPercent(progress * 100);
      targetFrame = Math.floor(progress * (frameCount - 1));
    };

    window.addEventListener('scroll', handleScroll);
    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animId);
    };
  }, [profileEmail]);

  useEffect(() => {
    localStorage.setItem('1convite_dark_mode', darkMode);
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Avatar = reader.result;
        setProfileAvatar(base64Avatar);
        
        // Sincroniza com o servidor
        try {
          const res = await fetch(`${API_BASE}/usuario/perfil`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome: profileName, email: profileEmail, avatar: base64Avatar })
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data);
          }
        } catch (err) {
          console.error(err);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/usuario/perfil`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: profileName, email: profileEmail, avatar: profileAvatar })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setProfileSavedMsg('Dados atualizados com sucesso!');
        setTimeout(() => setProfileSavedMsg(''), 3000);
      }
    } catch (err) {
      alert('Erro ao salvar no banco de dados.');
    }
  };

  // Google Login Callback
  const handleGoogleLoginResponse = async (response) => {
    const payload = parseJwt(response.credential);
    if (!payload) return;
    
    const googleUser = {
      nome: payload.name,
      email: payload.email,
      avatar: payload.picture
    };

    try {
      const res = await fetch(`${API_BASE}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(googleUser)
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setProfileName(data.user.nome);
        setProfileEmail(data.user.email);
        setProfileAvatar(data.user.avatar);
      }
    } catch (err) {
      console.error('Erro de rede ao logar com o Google:', err);
    }
  };

  // Simular Login Google para desenvolvimento/testes locais imediatos
  const handleSimularLoginGoogle = async () => {
    const nome = prompt("Digite seu nome completo do Google:", "Jônatas Oliveira");
    if (!nome) return;
    const email = prompt("Digite seu e-mail do Google:", "jonatas.oliveira@gmail.com");
    if (!email) return;
    
    // Avatar default dinâmico
    const avatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(nome)}`;

    try {
      const res = await fetch(`${API_BASE}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, avatar })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setProfileName(data.user.nome);
        setProfileEmail(data.user.email);
        setProfileAvatar(data.user.avatar);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGuestLogin = async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: "Convidado Visitante",
          email: "visitante@1convite.com",
          avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Visitante"
        })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setProfileName(data.user.nome);
        setProfileEmail(data.user.email);
        setProfileAvatar(data.user.avatar);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    if (!confirm('Deseja realmente sair da conta?')) return;
    try {
      const res = await fetch(`${API_BASE}/usuario/perfil`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: "Membro Convidado",
          email: "membro@1convite.com",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"
        })
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        setProfileName(updatedUser.nome);
        setProfileEmail(updatedUser.email);
        setProfileAvatar(updatedUser.avatar);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Efeito para inicializar o botão do Google Identity Services
  useEffect(() => {
    // Desativado botão oficial para evitar erros de 403 no console local com ID dummy.
    // Usamos o botão customizado abaixo que simula o login com 100% de sucesso local.
    /*
    if (window.google) {
      setTimeout(() => {
        const container = document.getElementById("google-signin-btn-container") || document.getElementById("google-login-screen-container");
        if (container) {
          try {
            window.google.accounts.id.initialize({
              client_id: "777777777777-dummygoogleclientid.apps.googleusercontent.com",
              callback: handleGoogleLoginResponse
            });
            window.google.accounts.id.renderButton(
              container,
              { theme: "outline", size: "large", width: 320 }
            );
          } catch (err) {
            console.warn('Erro ao inicializar botão do Google:', err);
          }
        }
      }, 400);
    }
    */
  }, [activeTab, profileEmail, loginMethod]);

  const API_BASE = import.meta.env.PROD ? '/api/v1' : 'http://localhost:3001/api/v1';

  // ── Bíblia ──────────────────────────────────────────────────
  const searchBible = async (e) => {
    e.preventDefault();
    if (!bibleSearchQuery || bibleSearchQuery.length < 3) { setBibleError('Digite pelo menos 3 letras.'); return; }
    setBibleLoading(true); setBibleError('');
    try {
      const res = await fetch(`${API_BASE}/biblia/busca?q=${encodeURIComponent(bibleSearchQuery)}`);
      const data = await res.json();
      if (res.ok) { setBibleResults(data); if (!data.length) setBibleError('Nenhum versículo encontrado.'); }
      else setBibleError(data.error);
    } catch { setBibleError('Erro de conexão.'); }
    finally { setBibleLoading(false); }
  };

  const getRandomVerse = async () => {
    setBibleLoading(true); setBibleError('');
    try {
      const res = await fetch(`${API_BASE}/biblia/aleatorio`);
      const data = await res.json();
      if (res.ok) { setBibleResults([data]); setBibleSearchQuery(''); }
    } catch { setBibleError('Erro ao puxar versículo.'); }
    finally { setBibleLoading(false); }
  };

  const copyToClipboard = (text) => { navigator.clipboard.writeText(text); alert('Versículo copiado!'); };

  // ── Carrossel ───────────────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => setCarouselIndex(p => (p + 1) % carouselImages.length), 8000);
    return () => clearInterval(t);
  }, []);

  // ── Dados iniciais ──────────────────────────────────────────
  const loadAppData = async () => {
    try {
      const rU = await fetch(`${API_BASE}/codigo-dia`);
      if (rU.ok) {
        const d = await rU.json(); 
        setUser(d.user); 
        setCodigoDia(d.code);
        if (d.user) {
          setProfileName(d.user.nome || 'Membro Convidado');
          setProfileEmail(d.user.email || 'membro@1convite.com');
          setProfileAvatar(d.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80');
        }
        if (d.user && !d.user.checkpoint_completado) { setActiveTab('pedagio'); if (!pedagioIniciado) iniciarPedagio(); }
        else {
          if (activeTab === 'pedagio') setActiveTab('sabado');
        }
      }
      const rC = await fetch(`${API_BASE}/contatos`); if (rC.ok) setContatos(await rC.json());
      const rH = await fetch(`${API_BASE}/historico`); if (rH.ok) { const dH = await rH.json(); setHistorico(dH.rows || []); }
      
      await loadTrilhaStatus();
      await loadDicionario();
    } catch (e) { console.error(e); }
  };

  const loadDicionario = async () => {
    try {
      const res = await fetch(`${API_BASE}/dicionario/termos`);
      if (res.ok) setDicionario(await res.json());
    } catch (e) { console.error(e); }
  };

  const loadTrilhaStatus = async () => {
    try {
      const rList = await fetch(`${API_BASE}/trilhas/lista`);
      if (rList.ok) setListaTrilhas(await rList.json());
      
      const rAtiva = await fetch(`${API_BASE}/trilhas/ativa`);
      if (rAtiva.ok) {
        const data = await rAtiva.json();
        setTrilhaAtiva(data.ativa ? data : null);
      }
    } catch (e) { console.error(e); }
  };

  const loadBibleBooks = async () => {
    try { const r = await fetch(`${API_BASE}/biblia/livros`); if (r.ok) setBibleBooks(await r.json()); }
    catch (e) { console.error(e); }
  };

  useEffect(() => { loadAppData(); loadBibleBooks(); }, []);

  useEffect(() => {
    if (activeTab !== 'biblia') return;
    const load = async () => {
      try {
        setBibleLoading(true);
        setBibleAudioPlaying(false);
        setBibleAudioUrl('');
        
        const rc = await fetch(`${API_BASE}/biblia/capitulos/${bibleSelectedBook.livro_abrev}`);
        if (rc.ok) { const dc = await rc.json(); setBibleChaptersCount(dc.total || 50); }
        const rv = await fetch(`${API_BASE}/biblia/texto/${bibleSelectedBook.livro_abrev}/${bibleSelectedChapter}`);
        if (rv.ok) setBibleVerses(await rv.json());

        // Carrega o áudio
        const ra = await fetch(`${API_BASE}/biblia/audio/${bibleSelectedBook.livro_abrev}/${bibleSelectedChapter}`);
        if (ra.ok) {
          const dataAudio = await ra.json();
          setBibleAudioUrl(dataAudio.url);
        }
      } catch (e) { console.error(e); } finally { setBibleLoading(false); }
    };
    load();
  }, [bibleSelectedBook, bibleSelectedChapter, activeTab]);

  // ── Pedágio ─────────────────────────────────────────────────
  const iniciarPedagio = async () => {
    try { setPedagioIniciado(true); setCountdown(12); setIsCountdownActive(true); await fetch(`${API_BASE}/checkpoint/start`, { method: 'POST' }); }
    catch (e) { console.error(e); }
  };

  useEffect(() => {
    let t;
    if (activeTab === 'pedagio' && isCountdownActive && countdown > 0) t = setTimeout(() => setCountdown(p => p - 1), 1000);
    else if (countdown === 0) setIsCountdownActive(false);
    return () => clearTimeout(t);
  }, [countdown, activeTab, isCountdownActive]);

  const destravarAgora = async () => {
    try {
      const res = await fetch(`${API_BASE}/sync-checkpoint`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) { setPedagioIniciado(false); setPedagioErro(''); loadAppData(); }
      else setPedagioErro(data.error || 'Erro ao destravar');
    } catch { setPedagioErro('Erro de comunicação.'); }
  };

  // ── Contatos ────────────────────────────────────────────────
  const handleAddContato = async (e) => {
    e.preventDefault(); setContatoErro('');
    if (!newNome || !newRelacao) { setContatoErro('Preencha todos os campos.'); return; }
    try {
      const res = await fetch(`${API_BASE}/contatos`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nome: newNome, relacao: newRelacao, prioritario: newPrioritario }) });
      const data = await res.json();
      if (res.ok) { setNewNome(''); setNewRelacao(''); setNewPrioritario(false); setShowAddContato(false); loadAppData(); }
      else setContatoErro(data.error || 'Erro ao cadastrar.');
    } catch { setContatoErro('Falha de conexão.'); }
  };

  const deletarContato = async (id) => {
    if (!confirm('Remover este contato?')) return;
    try { await fetch(`${API_BASE}/contatos/${id}`, { method: 'DELETE' }); loadAppData(); } catch (e) { console.error(e); }
  };

  const registrarAcao = async (id, tipoAcao) => {
    try { await fetch(`${API_BASE}/contatos/${id}/acao`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tipoAcao }) }); loadAppData(); }
    catch (e) { console.error(e); }
  };

  const verificarAlerta48h = (c) => {
    if (!c.prioritario) return false;
    if (c.ultimo_convite_timestamp === 0) return true;
    return (Date.now() - c.ultimo_convite_timestamp) / 3600000 >= 48;
  };

  // ── Respiração ──────────────────────────────────────────────
  const iniciarRespiracao = () => {
    if (isBreathing) return;
    setIsBreathing(true); let step = 0;
    const phases = [
      { text: 'Inspire...', cls: 'inhaling', d: 4 },
      { text: 'Segure...', cls: 'holding', d: 4 },
      { text: 'Expire...', cls: 'exhaling', d: 4 }
    ];
    const run = () => {
      if (step >= phases.length) { setBreathState('Desfrute Completo! ✨'); setBreathClass(''); setIsBreathing(false); return; }
      const ph = phases[step]; setBreathState(ph.text); setBreathClass(ph.cls); setBreathTimer(ph.d);
      let cv = ph.d;
      const iv = setInterval(() => { cv--; setBreathTimer(cv); if (cv <= 0) { clearInterval(iv); step++; run(); } }, 1000);
    };
    run();
  };

  // ── Áudio Sabático ──────────────────────────────────────────
  useEffect(() => {
    if (!audioRef.current) return;
    if (audioPlaying) audioRef.current.play().catch(() => setAudioPlaying(false));
    else audioRef.current.pause();
  }, [audioPlaying]);

  const onAudioTimeUpdate = () => { if (audioRef.current) setAudioCurrentTime(audioRef.current.currentTime); };
  const onAudioLoadedMetadata = () => { if (audioRef.current) setAudioDuration(audioRef.current.duration); };
  const formatTime = (s) => { if (isNaN(s)) return '0:00'; return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`; };
  const handleProgressBarClick = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    if (audioRef.current) { audioRef.current.currentTime = ((e.clientX - r.left) / r.width) * audioDuration; setAudioCurrentTime(audioRef.current.currentTime); }
  };

  // ── Áudio da Bíblia ─────────────────────────────────────────
  useEffect(() => {
    if (!bibleAudioRef.current) return;
    if (bibleAudioPlaying) {
      setAudioPlaying(false);
      bibleAudioRef.current.play().catch(() => setBibleAudioPlaying(false));
    } else {
      bibleAudioRef.current.pause();
    }
  }, [bibleAudioPlaying]);

  const onBibleAudioTimeUpdate = () => { if (bibleAudioRef.current) setBibleAudioCurrentTime(bibleAudioRef.current.currentTime); };
  const onBibleAudioLoadedMetadata = () => { if (bibleAudioRef.current) setBibleAudioDuration(bibleAudioRef.current.duration); };
  const handleBibleAudioProgressBarClick = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    if (bibleAudioRef.current) {
      bibleAudioRef.current.currentTime = ((e.clientX - r.left) / r.width) * bibleAudioDuration;
      setBibleAudioCurrentTime(bibleAudioRef.current.currentTime);
    }
  };

  // ── Trilhas de Crescimento ──────────────────────────────────
  const iniciarTrilha = async (tema) => {
    try {
      setTrilhaLoading(true);
      const res = await fetch(`${API_BASE}/trilhas/iniciar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tema })
      });
      if (res.ok) {
        alert(`Trilha de ${tema} iniciada com sucesso!`);
        await loadTrilhaStatus();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTrilhaLoading(false);
    }
  };

  const completarDiaTrilha = async () => {
    try {
      setTrilhaLoading(true);
      const res = await fetch(`${API_BASE}/trilhas/completar-dia`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.concluida) {
          alert('Parabéns! Você concluiu os 30 dias desta Trilha de Crescimento! 🏆');
        } else {
          alert('Devocional de hoje concluído! Avançando na trilha.');
        }
        await loadTrilhaStatus();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTrilhaLoading(false);
    }
  };

  const cancelarTrilha = async () => {
    if (!confirm('Deseja realmente cancelar a trilha ativa? Seu progresso será perdido.')) return;
    try {
      setTrilhaLoading(true);
      const res = await fetch(`${API_BASE}/trilhas/cancelar`, { method: 'POST' });
      if (res.ok) {
        await loadTrilhaStatus();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTrilhaLoading(false);
    }
  };

  // ── Dicionário Teológico ─────────────────────────────────────
  const formatVerseText = (text) => {
    if (!dicionario || Object.keys(dicionario).length === 0) return text;
    
    const termos = Object.keys(dicionario).sort((a, b) => b.length - a.length);
    const pattern = termos.map(t => t.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|');
    if (!pattern) return text;
    
    const regex = new RegExp(`\\b(${pattern})\\b`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => {
      const lowerPart = part.toLowerCase();
      if (dicionario[lowerPart]) {
        return (
          <span 
            key={i} 
            className="dict-term" 
            onClick={(e) => {
              e.stopPropagation();
              setSelectedDicionarioTermo({ termo: part, significado: dicionario[lowerPart] });
            }}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  // ── Pagamento ───────────────────────────────────────────────
  const iniciarCheckoutMercadoPago = async () => {
    try { setIsPaying(true); const res = await fetch(`${API_BASE}/pagamentos/criar-preferencia`, { method: 'POST' }); const d = await res.json(); if (res.ok) { setPaymentPreferenceId(d.preferenceId); setActiveTab('simular-pagamento'); } }
    catch (e) { console.error(e); } finally { setIsPaying(false); }
  };

  const finalizarPagamentoSimulado = async () => {
    try {
      const res = await fetch(`${API_BASE}/pagamentos/webhook`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'payment.created', pref_id: paymentPreferenceId }) });
      if (res.ok) { alert('Pagamento aprovado! Plano Premium ativado.'); loadAppData(); setActiveTab('sabado'); }
    } catch (e) { console.error(e); }
  };

  // ── Admin ───────────────────────────────────────────────────
  const avancarDia = async () => { try { const r = await fetch(`${API_BASE}/avancar-dia`, { method: 'POST' }); if (r.ok) { loadAppData(); alert('Dia avançado!'); } else alert('Erro ao avançar.'); } catch (e) { console.error(e); } };
  const reiniciarJornada = async () => { if (!confirm('Reiniciar ao Dia 1?')) return; try { await fetch(`${API_BASE}/reiniciar-jornada`, { method: 'POST' }); loadAppData(); } catch (e) { console.error(e); } };
  const alterarPlanoAdmin = async (p) => { try { await fetch(`${API_BASE}/admin/definir-plano`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plano: p }) }); loadAppData(); } catch (e) { console.error(e); } };

  // ═══════════════════════════════════════════════════════════
  //  TELA PEDÁGIO
  // ═══════════════════════════════════════════════════════════
  if (activeTab === 'pedagio' && codigoDia) {
    const isProposito = codigoDia.pilar_origem === 'PROPÓSITO_M2414';
    return (
      <div className="pedagio-overlay">
        <div style={{ position: 'fixed', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)', top: -80, right: -60, filter: 'blur(50px)', pointerEvents: 'none' }} />
        <div style={{ position: 'fixed', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(51,65,85,0.10) 0%, transparent 70%)', bottom: 80, left: -60, filter: 'blur(50px)', pointerEvents: 'none' }} />

        <div className="pedagio-container">
          <div style={{ textAlign: 'center' }}>
            <img src="/LOGOMARCA.png" alt="1Convite" style={{ height: '38px', objectFit: 'contain' }} />
          </div>

          <div style={{ textAlign: 'center' }}>
            <div className={`pedagio-badge ${isProposito ? 'badge-proposito' : 'badge-recompensa'}`}>
              {isProposito ? 'Mateus 24:14 — Propósito' : 'Apocalipse 3:21 — Recompensa'}
            </div>
            <h1 style={{ fontSize: '1.4rem', marginTop: '8px' }}>Dia {codigoDia.dia_id} da Jornada</h1>
            <p style={{ color: '#78716C', marginTop: '4px' }}>Alinhamento mental no Agora de Deus</p>
          </div>

          <div className="pedagio-card">
            <div className="pedagio-codigo">"{codigoDia.codigo_verbal}"</div>
            <div className="pedagio-versiculo">{codigoDia.versiculo_chave}</div>
            <div className="pedagio-reflexao">{codigoDia.texto_reflexao}</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
            {countdown > 0 && <div className="timer-circle"><span style={{ animation: 'none' }}>{countdown}</span></div>}
            {pedagioErro && <p style={{ color: '#ef4444', textAlign: 'center' }}>{pedagioErro}</p>}
            <button className="btn-primary" onClick={destravarAgora} disabled={countdown > 0} style={{ maxWidth: 360 }}>
              {countdown > 0 ? `⏳ Medite... (${countdown}s)` : '🔓 Destravar o Agora'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (profileEmail === 'membro@1convite.com') {
    if (!framesLoaded) {
      return (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: '#09090b', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', zIndex: 10000,
          color: '#fafafa', fontFamily: "'Inter', sans-serif"
        }}>
          <img src="/LOGOMARCA.png" alt="1Convite" style={{ height: '36px', marginBottom: '24px', opacity: 0.9 }} />
          <div style={{ width: '160px', height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', position: 'relative', overflow: 'hidden', marginBottom: '12px' }}>
            <div style={{ width: `${loadProgress}%`, height: '100%', background: '#10B981', transition: 'width 0.1s ease', borderRadius: '3px' }}></div>
          </div>
          <span style={{ fontSize: '0.78rem', fontWeight: 'bold', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#10B981' }}>
            Carregando Experiência {loadProgress}%
          </span>
        </div>
      );
    }

    return (
      <div className="lp-container">
        {/* ── HEADER DA LANDING PAGE ────────────────────────── */}
        <header className="lp-header">
          <div className="lp-header-inner">
            <img src="/LOGOMARCA.png" alt="1Convite Logo" className="lp-logo-img" />
            <button 
              className="theme-toggle-btn" 
              onClick={() => setDarkMode(!darkMode)}
              title="Alternar Tema Claro/Escuro"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </header>

        {/* ── HERO SECTION COM CANVAS DE SCROLL ────────────────────────── */}
        <section className="lp-hero-scroll-section">
          {/* Container Sticky do Canvas */}
          <div className="lp-canvas-sticky-container">
            <canvas ref={canvasRef} className="lp-scroll-canvas" />
            
            {/* Moldura de Vidro Arredondada (Portal Estilo Harmont/Woodnest) */}
            <div className="lp-portal-frame"></div>
            
            {/* Badges Flutuantes (Woodnest/Harmont Style) */}
            <div className="lp-floating-badge lp-floating-badge-1">★ 4.9 (2,400+ membros)</div>
            <div className="lp-floating-badge lp-floating-badge-2">🧘 Respiração Ativa</div>
            <div className="lp-floating-badge lp-floating-badge-3">🎧 Meditação Cristã</div>

            {/* Barra Dock Inferior (Estilo Harmont) */}
            <div className="lp-dock-bar">
              <div className="lp-dock-item">
                <span className="lp-dock-label">💡 Devocional</span>
                <span className="lp-dock-value">Dia 1 Ativo</span>
              </div>
              <div className="lp-dock-divider"></div>
              <div className="lp-dock-item">
                <span className="lp-dock-label">🧘 Respiração</span>
                <span className="lp-dock-value">Inspirar & Exalar</span>
              </div>
              <div className="lp-dock-divider"></div>
              <div className="lp-dock-item">
                <span className="lp-dock-label">📖 Bíblia</span>
                <span className="lp-dock-value">ACF Narrada</span>
              </div>
              <div className="lp-dock-divider"></div>
              <div className="lp-dock-item">
                <span className="lp-dock-label">👥 Contatos</span>
                <span className="lp-dock-value">Alerta 48h</span>
              </div>
              <button className="lp-dock-btn" onClick={() => {
                const windowHeight = window.innerHeight;
                window.scrollTo({ top: windowHeight * 6.5, behavior: 'smooth' });
              }}>
                Entrar no App 🚀
              </button>
            </div>
            
            {/* Gradientes de escurecimento para legibilidade */}
            <div className="lp-canvas-overlay-gradient"></div>

            {/* Overlays de Conteúdo Dinâmico que reagem ao Scroll */}
            <div className="lp-scroll-text-overlay-wrapper">
              
              {/* Estágio 1: Introdução Hero (0% a 15%) */}
              <div className={`lp-scroll-text-card ${scrollPercent < 15 ? 'visible' : ''}`}>
                <span className="lp-badge">Jornada Espiritual Ativa</span>
                <h1 className="lp-title" style={{ marginTop: '12px' }}>
                  Desacelere sua mente. <span>Conecte-se com Deus.</span>
                </h1>
                <p className="lp-description" style={{ marginTop: '12px' }}>
                  11 minutos diários de meditação cristã orientada, respiração controlada contra ansiedade e leitura da Bíblia narrada.
                </p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '18px' }}>
                  <button 
                    className="lp-hero-cta"
                    onClick={() => {
                      const windowHeight = window.innerHeight;
                      window.scrollTo({ top: windowHeight * 6.5, behavior: 'smooth' });
                    }}
                  >
                    Começar Agora 🚀
                  </button>
                  <button 
                    className="lp-hero-cta-outline"
                    onClick={() => window.scrollBy({ top: window.innerHeight * 0.9, behavior: 'smooth' })}
                  >
                    Ver Conceito 🖱️
                  </button>
                </div>
              </div>

              {/* Estágio 2: Passado (15% a 30%) */}
              <div className={`lp-scroll-text-card ${scrollPercent >= 15 && scrollPercent < 30 ? 'visible' : ''}`}>
                <span className="lp-badge" style={{ background: 'rgba(255,255,255,0.08)', color: '#fafafa', borderColor: 'rgba(255,255,255,0.15)' }}>Passado 10%</span>
                <h1 className="lp-title" style={{ marginTop: '12px', fontSize: '2.5rem' }}>
                  A Biblioteca da <span>Palavra</span>
                </h1>
                <p className="lp-description" style={{ marginTop: '12px' }}>
                  O conhecimento acumulado ao longo da história cristã. 10% da nossa mente é moldada pelas lições e escrituras antigas que pavimentam o nosso caminho com verdade.
                </p>
              </div>

              {/* Estágio 3: Presente (30% a 45%) */}
              <div className={`lp-scroll-text-card ${scrollPercent >= 30 && scrollPercent < 45 ? 'visible' : ''}`}>
                <span className="lp-badge">Presente 70%</span>
                <h1 className="lp-title" style={{ marginTop: '12px', fontSize: '2.5rem' }}>
                  O Eterno <span>Agora</span>
                </h1>
                <p className="lp-description" style={{ marginTop: '12px' }}>
                  70% de nossa vida espiritual ativa acontece no dia de hoje. A quietude silenciosa para orar, meditar e sentir a presença do Criador no único tempo que realmente existe: o Agora.
                </p>
              </div>

              {/* Estágio 4: Futuro (45% a 60%) */}
              <div className={`lp-scroll-text-card ${scrollPercent >= 45 && scrollPercent < 60 ? 'visible' : ''}`}>
                <span className="lp-badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', borderColor: 'rgba(16, 185, 129, 0.2)' }}>Futuro 20%</span>
                <h1 className="lp-title" style={{ marginTop: '12px', fontSize: '2.5rem' }}>
                  A Bússola da <span>Missão</span>
                </h1>
                <p className="lp-description" style={{ marginTop: '12px' }}>
                  20% de nosso foco aponta para a frente, guiados pela bússola da esperança eterna. A certeza do cumprimento de nossa missão terrena com propósito divino.
                </p>
              </div>

              {/* Estágio 5: Recursos (60% a 75%) */}
              <div className={`lp-scroll-text-card lp-card-wide ${scrollPercent >= 60 && scrollPercent < 75 ? 'visible' : ''}`}>
                <span className="lp-badge">O que oferecemos</span>
                <h2 className="lp-title" style={{ marginTop: '8px', fontSize: '2.1rem' }}>Recursos do <span>1Convite</span></h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginTop: '20px' }} className="lp-grid-mobile-single">
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: '1.4rem' }}>🎧</span>
                    <h4 style={{ margin: '4px 0', fontSize: '0.92rem' }}>Meditação Cristã</h4>
                    <p style={{ fontSize: '0.78rem', color: '#9ca3af', margin: 0 }}>Áudios diários guiados focados em alinhar a mente com Jesus.</p>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: '1.4rem' }}>🌀</span>
                    <h4 style={{ margin: '4px 0', fontSize: '0.92rem' }}>Respiração Ativa</h4>
                    <p style={{ fontSize: '0.78rem', color: '#9ca3af', margin: 0 }}>Técnicas respiratórias guiadas para aliviar estresse e ansiedade.</p>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: '1.4rem' }}>📖</span>
                    <h4 style={{ margin: '4px 0', fontSize: '0.92rem' }}>Bíblia ACF Narrada</h4>
                    <p style={{ fontSize: '0.78rem', color: '#9ca3af', margin: 0 }}>Leitura bíblica em áudio e dicionário teológico integrado.</p>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: '1.4rem' }}>👥</span>
                    <h4 style={{ margin: '4px 0', fontSize: '0.92rem' }}>Cultivar Contatos</h4>
                    <p style={{ fontSize: '0.78rem', color: '#9ca3af', margin: 0 }}>Alertas a cada 48h para cultivar relacionamentos prioritários.</p>
                  </div>
                </div>
              </div>

              {/* Estágio 6: Comparativo de Planos (75% a 90%) */}
              <div className={`lp-scroll-text-card lp-card-wide ${scrollPercent >= 75 && scrollPercent < 90 ? 'visible' : ''}`}>
                <span className="lp-badge">Acesso Livre</span>
                <h2 className="lp-title" style={{ marginTop: '8px', fontSize: '2.1rem' }}>Escolha o seu <span>Plano</span></h2>
                
                <div style={{ marginTop: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', padding: '12px 18px', background: 'rgba(255,255,255,0.04)', fontWeight: 'bold', fontSize: '0.8rem' }}>
                    <span>Recurso</span>
                    <span style={{ textAlign: 'center' }}>FREE</span>
                    <span style={{ color: '#10B981', textAlign: 'center' }}>PREMIUM</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', padding: '10px 18px', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.78rem' }}>
                    <span>Bíblia & Dicionário</span>
                    <span style={{ color: '#10B981', textAlign: 'center' }}>✓</span>
                    <span style={{ color: '#10B981', textAlign: 'center' }}>✓</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', padding: '10px 18px', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.78rem' }}>
                    <span>Respiração Controlada</span>
                    <span style={{ color: '#10B981', textAlign: 'center' }}>✓</span>
                    <span style={{ color: '#10B981', textAlign: 'center' }}>✓</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', padding: '10px 18px', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.78rem' }}>
                    <span>Contatos (Alertas)</span>
                    <span style={{ textAlign: 'center' }}>Até 3</span>
                    <span style={{ color: '#10B981', textAlign: 'center' }}>Ilimitados</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', padding: '10px 18px', fontSize: '0.78rem' }}>
                    <span>Áudios de Meditação</span>
                    <span style={{ color: '#dc2626', textAlign: 'center' }}>✕</span>
                    <span style={{ color: '#10B981', textAlign: 'center' }}>✓</span>
                  </div>
                </div>
              </div>

              {/* Estágio 7: Formulário de Login Integrado (90% a 100%) */}
              <div className={`lp-scroll-text-card ${scrollPercent >= 90 ? 'visible' : ''}`}>
                <span className="lp-badge">Mateus 24:14</span>
                <h2 className="lp-title" style={{ marginTop: '8px', fontSize: '2rem', textAlign: 'center' }}>Acesse o <span>1Convite</span></h2>
                
                <div className="login-card" style={{ margin: '16px auto 0', background: 'rgba(24, 24, 27, 0.8)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'none', padding: '20px' }}>
                  <div style={{ display: 'flex', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', padding: '3px', marginBottom: '14px' }}>
                    <button
                      onClick={() => { setLoginMethod('google'); setLoginError(''); }}
                      style={{
                        flex: 1,
                        background: loginMethod === 'google' ? '#10B981' : 'transparent',
                        color: '#fff',
                        border: 'none', borderRadius: '6px', padding: '6px', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s'
                      }}
                    >
                      Google
                    </button>
                    <button
                      onClick={() => { setLoginMethod('email'); setLoginError(''); }}
                      style={{
                        flex: 1,
                        background: loginMethod === 'email' ? '#10B981' : 'transparent',
                        color: '#fff',
                        border: 'none', borderRadius: '6px', padding: '6px', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s'
                      }}
                    >
                      E-mail
                    </button>
                  </div>

                  {loginMethod === 'google' ? (
                    <div className="flex-column gap-sm">
                      <button className="btn-google-signin" onClick={handleSimularLoginGoogle} style={{ marginTop: '0', width: '100%', padding: '10px' }}>
                        <svg width="18" height="18" viewBox="0 0 18 18" style={{ marginRight: '8px' }}>
                          <path fill="#4285F4" d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.47h4.84c-.21 1.12-.84 2.07-1.79 2.7v2.24h2.9c1.69-1.55 2.69-3.84 2.69-6.57z"/>
                          <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.23l-2.9-2.24c-.8.54-1.84.87-3.06.87-2.35 0-4.35-1.59-5.06-3.73H.95v2.3C2.43 15.89 5.5 18 9 18z"/>
                          <path fill="#FBBC05" d="M3.94 10.67c-.18-.54-.28-1.12-.28-1.72s.1-1.18.28-1.72v-2.3H.95C.34 6.16 0 7.54 0 9s.34 2.84.95 4.07l2.99-2.3z"/>
                          <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35L15 2.4C13.46.97 11.43 0 9 0 5.5 0 2.43 2.11.95 5.07l2.99 2.3c.71-2.14 2.71-3.79 5.06-3.79z"/>
                        </svg>
                        Acessar com o Google
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleEmailLogin} className="flex-column gap-xs" style={{ textAlign: 'left' }}>
                      <div className="input-group">
                        <label style={{ fontSize: '0.7rem', color: '#9ca3af' }}>Nome</label>
                        <input
                          type="text"
                          className="input-field"
                          value={loginNome}
                          onChange={(e) => setLoginNome(e.target.value)}
                          placeholder="Nome"
                          style={{ padding: '8px', fontSize: '0.8rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}
                          required
                        />
                      </div>
                      <div className="input-group">
                        <label style={{ fontSize: '0.7rem', color: '#9ca3af' }}>E-mail</label>
                        <input
                          type="email"
                          className="input-field"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="E-mail"
                          style={{ padding: '8px', fontSize: '0.8rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}
                          required
                        />
                      </div>

                      {loginError && (
                        <div style={{ color: '#dc2626', fontSize: '0.75rem', fontWeight: 'bold' }}>
                          {loginError}
                        </div>
                      )}

                      <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '6px', padding: '10px', fontSize: '0.82rem' }}>
                        🚀 Entrar com E-mail
                      </button>
                    </form>
                  )}

                  <div className="login-separator" style={{ margin: '8px 0', fontSize: '0.72rem', color: '#6b7280' }}>ou</div>

                  <button className="btn-secondary" style={{ width: '100%', padding: '8px', fontSize: '0.78rem' }} onClick={handleGuestLogin}>
                    🔓 Modo Convidado (Rápido)
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── FOOTER DA LP ────────────────────────── */}
        <footer style={{ textAlign: 'center', padding: '40px 24px', fontSize: '0.78rem', color: 'var(--text-secondary)', borderTop: '1px solid rgba(16, 185, 129, 0.08)', background: '#09090b', zIndex: 10, position: 'relative' }}>
          <p>© {new Date().getFullYear()} Movimento 1Convite. Todos os direitos reservados.</p>
          <p style={{ marginTop: '4px', opacity: 0.7 }}>Desenvolvido com foco no bem-estar espiritual cristão.</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* ── HEADER ────────────────────────────── */}
      <header className="app-header">
        {activeTab === 'biblia' ? (
          <div className="bible-header-nav" style={{ width: '100%' }}>
            <button
              className="bible-select-btn"
              onClick={() => setBibleViewMode(bibleViewMode === 'select-book' ? 'reading' : 'select-book')}
            >
              <span>{bibleSelectedBook.livro_nome}</span>
              <span style={{ opacity: 0.6 }}>Cap. {bibleSelectedChapter} ▼</span>
            </button>
            <button className="bible-select-btn" style={{ flex: '0 0 72px', justifyContent: 'center', gap: '4px' }}>
              NVI ▼
            </button>
          </div>
        ) : (
          <>
            <img src="/LOGOMARCA.png" alt="1Convite" style={{ height: '28px', objectFit: 'contain' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {user && <span className="premium-status-badge">Plano {user.status_plano}</span>}
              {user && (
                <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#334155', background: '#F1F5F9', padding: '4px 10px', borderRadius: '9999px' }}>
                  Dia {user.dia_atual}
                </span>
              )}
            </div>
          </>
        )}
      </header>

      {/* ── MODAIS BÍBLIA ─────────────────────── */}
      {activeTab === 'biblia' && bibleViewMode === 'select-book' && (
        <div className="bible-modal-overlay">
          <div className="bible-modal-header">
            <h3 style={{ margin: 0, fontSize: '1.05rem' }}>📖 Selecione o Livro</h3>
            <button className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.9rem' }} onClick={() => setBibleViewMode('reading')}>✕</button>
          </div>
          <div className="bible-modal-content">
            <div className="bible-testament-title">✦ Antigo Testamento</div>
            {bibleBooks.filter((_, i) => i < 39).map((bk, idx) => (
              <div key={idx} className="bible-book-item" onClick={() => { setBibleSelectedBook(bk); setBibleViewMode('select-chapter'); }}>
                {bk.livro_nome}
              </div>
            ))}
            <div className="bible-testament-title">✦ Novo Testamento</div>
            {bibleBooks.filter((_, i) => i >= 39).map((bk, idx) => (
              <div key={idx} className="bible-book-item" onClick={() => { setBibleSelectedBook(bk); setBibleViewMode('select-chapter'); }}>
                {bk.livro_nome}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'biblia' && bibleViewMode === 'select-chapter' && (
        <div className="bible-modal-overlay">
          <div className="bible-modal-header">
            <button className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.85rem' }} onClick={() => setBibleViewMode('select-book')}>← Livros</button>
            <h3 style={{ margin: 0, fontSize: '1.05rem' }}>{bibleSelectedBook.livro_nome}</h3>
            <div style={{ width: '72px' }} />
          </div>
          <div className="bible-modal-content">
            <div className="bible-chapter-grid">
              {Array.from({ length: bibleChaptersCount }).map((_, i) => (
                <div key={i} className="bible-chapter-btn" onClick={() => { setBibleSelectedChapter(i + 1); setBibleViewMode('reading'); }}>
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL DICIONÁRIO TEOLÓGICO ────────── */}
      {selectedDicionarioTermo && (
        <div className="dict-modal">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ color: 'var(--orange)', fontSize: '1.1rem', textTransform: 'capitalize' }}>📚 {selectedDicionarioTermo.termo}</h3>
            <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.8rem' }} onClick={() => setSelectedDicionarioTermo(null)}>✕ Fechar</button>
          </div>
          <p style={{ fontSize: '0.92rem', lineHeight: '1.6', color: 'var(--text-primary)' }}>{selectedDicionarioTermo.significado}</p>
        </div>
      )}

      {/* ── MAIN ──────────────────────────────── */}
      <main className="main-content">

        {/* ════════════ ABA SABÁTICO ════════════ */}
        {activeTab === 'sabado' && (
          <div className="page-enter">
            {/* Carrossel no topo com margens e efeito flutuante */}
            <div style={{ padding: '16px 16px 8px 16px' }}>
              <div className="carousel-container">
                <div className="carousel-wrapper" style={{ transform: `translateX(-${carouselIndex * 100}%)` }}>
                  {carouselImages.map((src, idx) => (
                    <img key={idx} src={src} alt={`Banner ${idx + 1}`} className="carousel-image" style={{ height: '180px' }} />
                  ))}
                </div>
                <div className="carousel-dots">
                  {carouselImages.map((_, idx) => (
                    <button key={idx} className={`carousel-dot${idx === carouselIndex ? ' active' : ''}`} onClick={() => setCarouselIndex(idx)} />
                  ))}
                </div>
              </div>
            </div>

            {/* Hero */}
            <div className="page-hero hero-sabado">
              <div className="hero-orb" style={{ width: 200, height: 200, top: -60, right: -40 }} />
              <div className="hero-orb" style={{ width: 120, height: 120, bottom: 20, left: -20, opacity: 0.5 }} />
              <div className="hero-content">
                {codigoDia && (
                  <>
                    <div className={`pedagio-badge ${codigoDia.pilar_origem === 'PROPÓSITO_M2414' ? 'badge-proposito' : 'badge-recompensa'}`} style={{ background: 'rgba(255,255,255,0.20)', color: '#fff', border: '1px solid rgba(255,255,255,0.35)', marginBottom: '12px' }}>
                      {codigoDia.pilar_origem === 'PROPÓSITO_M2414' ? 'Mateus 24:14' : 'Apocalipse 3:21'} — Código de Hoje
                    </div>
                    <div className="hero-title">"{codigoDia.codigo_verbal}"</div>
                    <div className="hero-sub">{codigoDia.versiculo_chave}</div>
                  </>
                )}
              </div>
            </div>

            <div className="page-content" style={{ paddingTop: '4px' }}>
              
              {codigoDia && (
                <>
                  {/* Reflexão */}
                  <div className="glass-panel orange-card">
                    <h3 style={{ marginBottom: '10px', color: '#C2550A' }}>💡 Reflexão do Dia</h3>
                    <p style={{ lineHeight: '1.75' }}>{codigoDia.texto_reflexao}</p>
                  </div>

                  {/* Player */}
                  <div className="glass-panel">
                    <h3 style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      🎧 Meditação Guiada
                      {user?.status_plano === 'FREE' && <span className="section-chip" style={{ fontSize: '0.62rem' }}>Premium</span>}
                    </h3>
                    {user?.status_plano === 'FREE' ? (
                      <div className="premium-lock-card">
                        <div className="premium-lock-icon">🔒</div>
                        <h4 style={{ margin: '8px 0 4px 0', fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>Conteúdo Exclusivo Premium</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: '1.4' }}>Assine o Plano Premium para destravar os áudios diários de meditação e elevar a sua conexão espiritual.</p>
                        <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem', width: 'auto' }} onClick={() => setActiveTab('upgrade')}>🔓 Destravar Agora</button>
                      </div>
                    ) : (
                      <div className="player-container">
                        {codigoDia.url_audio_meditacao && (
                          <audio ref={audioRef} src={codigoDia.url_audio_meditacao} onTimeUpdate={onAudioTimeUpdate} onLoadedMetadata={onAudioLoadedMetadata} />
                        )}
                        <div style={{ width: '100%' }}>
                          <div className="progress-bar-container" onClick={handleProgressBarClick}>
                            <div className="progress-bar-fill" style={{ width: `${(audioCurrentTime / (audioDuration || 1)) * 100}%` }} />
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#78716C', marginTop: '6px' }}>
                            <span>{formatTime(audioCurrentTime)}</span>
                            <span>{formatTime(audioDuration)}</span>
                          </div>
                        </div>
                        <button className="play-btn" onClick={() => setAudioPlaying(!audioPlaying)}>
                          {audioPlaying
                            ? <svg width="22" height="22" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z" /></svg>
                            : <svg width="22" height="22" fill="currentColor" viewBox="0 0 16 16" style={{ marginLeft: '3px' }}><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" /></svg>
                          }
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Respiração */}
                  <div className="glass-panel" style={{ textAlign: 'center' }}>
                    <h3 style={{ marginBottom: '6px' }}>🌬️ O Botão do Descanso</h3>
                    <p style={{ fontSize: '0.88rem', marginBottom: '20px', color: '#78716C' }}>Micro-pausa de respiração guiada — 4 segundos por phase.</p>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <button
                        className={`breath-circle ${breathClass}`}
                        onClick={iniciarRespiracao}
                        disabled={isBreathing}
                        style={{ border: 'none', cursor: isBreathing ? 'default' : 'pointer' }}
                      >
                        <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#334155' }}>{breathState}</span>
                        {isBreathing && <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#F97316', marginTop: '6px' }}>{breathTimer}</span>}
                      </button>
                    </div>
                  </div>

                  {/* TRILHA ATIVA (SE HOUVER) */}
                  {trilhaAtiva && (
                    <div className="trilha-active-panel" style={{ marginTop: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span className="section-chip">Trilha: {trilhaAtiva.tema}</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Dia {trilhaAtiva.dia_progresso}/30</span>
                      </div>
                      {trilhaAtiva.conteudo && (
                        <>
                          <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{trilhaAtiva.conteudo.titulo}</h3>
                          <p style={{ fontStyle: 'italic', marginBottom: '10px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>"{trilhaAtiva.conteudo.versiculo}"</p>
                          <p style={{ marginBottom: '14px', fontSize: '0.92rem' }}>{trilhaAtiva.conteudo.reflexao}</p>
                          <div className="glass-panel orange-card" style={{ padding: '12px 14px', marginBottom: '14px' }}>
                            <strong style={{ fontSize: '0.85rem', color: 'var(--orange-dark)', display: 'block', marginBottom: '4px' }}>🎯 AÇÃO PRÁTICA DO DIA:</strong>
                            <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>{trilhaAtiva.conteudo.acao_pratica}</p>
                          </div>
                        </>
                      )}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn-primary" style={{ padding: '10px' }} onClick={completarDiaTrilha}>
                          ✓ Concluir Ação de Hoje
                        </button>
                        <button className="btn-secondary" style={{ padding: '10px', background: '#FEE2E2', color: '#EF4444', border: '1px solid #FCA5A5' }} onClick={cancelarTrilha}>
                          Abandonar
                        </button>
                      </div>
                    </div>
                  )}

                  {/* SELEÇÃO DE TRILHAS (SE NÃO HOUVER ATIVA) */}
                  {!trilhaAtiva && listaTrilhas.length > 0 && (
                    <div className="glass-panel">
                      <h3 style={{ marginBottom: '12px' }}>🌱 Trilhas de Crescimento (30 Dias)</h3>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>Escolha um tema e faça um devocional focado diário.</p>
                      {listaTrilhas.map(tema => (
                        <div key={tema} className="trilha-theme-card" onClick={() => iniciarTrilha(tema)}>
                          <div>
                            <strong>Trilha de {tema}</strong>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Desafio diário de 30 dias</div>
                          </div>
                          <span style={{ color: 'var(--orange)', fontWeight: 'bold', fontSize: '1.1rem' }}>→</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Admin */}
                  <div className="glass-panel" style={{ border: '1.5px dashed rgba(0,0,0,0.10)', background: 'rgba(255,255,255,0.40)' }}>
                    <p style={{ fontSize: '0.72rem', fontWeight: '800', color: '#A8A29E', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>🔧 Simulação (Dev)</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <button className="btn-secondary" style={{ padding: '9px', fontSize: '0.82rem' }} onClick={avancarDia}>
                        Avançar: Dia {user?.dia_atual} → {(user?.dia_atual ?? 0) + 1}
                      </button>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn-secondary" style={{ flex: 1, padding: '9px', fontSize: '0.82rem' }} onClick={() => alterarPlanoAdmin('FREE')}>FREE</button>
                        <button className="btn-secondary" style={{ flex: 1, padding: '9px', fontSize: '0.82rem' }} onClick={() => alterarPlanoAdmin('PREMIUM')}>PREMIUM</button>
                      </div>
                      <button className="btn-secondary" style={{ padding: '9px', fontSize: '0.82rem', color: '#ef4444' }} onClick={reiniciarJornada}>Reiniciar ao Dia 1</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ════════════ ABA BÍBLIA ════════════ */}
        {activeTab === 'biblia' && bibleViewMode === 'reading' && (
          <div className="bible-reader page-enter">
            {/* Hero da Bíblia */}
            <div className="page-hero hero-biblia" style={{ paddingBottom: '44px' }}>
              <div className="hero-orb" style={{ width: 220, height: 220, top: -50, right: -60, background: 'rgba(249,115,22,0.20)' }} />
              <div className="hero-content">
                <div className="hero-label">📖 Bíblia Sagrada</div>
                <div className="hero-title">{bibleSelectedBook.livro_nome}</div>
                <div className="hero-sub">Capítulo {bibleSelectedChapter}</div>
              </div>
            </div>

            {/* Player de Áudio da Bíblia */}
            {bibleAudioUrl && (
              <div style={{ padding: '0 20px 10px 20px', marginTop: '-18px', position: 'relative', zIndex: 5 }}>
                <div className="player-container" style={{ padding: '12px 16px', flexDirection: 'row', gap: '12px', background: 'rgba(255, 255, 255, 0.7)' }}>
                  <audio ref={bibleAudioRef} src={bibleAudioUrl} onTimeUpdate={onBibleAudioTimeUpdate} onLoadedMetadata={onBibleAudioLoadedMetadata} />
                  <button className="play-btn" style={{ width: '40px', height: '40px', flexShrink: 0 }} onClick={() => setBibleAudioPlaying(!bibleAudioPlaying)}>
                    {bibleAudioPlaying
                      ? <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z" /></svg>
                      : <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ marginLeft: '2px' }}><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" /></svg>
                    }
                  </button>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div className="progress-bar-container" onClick={handleBibleAudioProgressBarClick} style={{ height: '4px' }}>
                      <div className="progress-bar-fill" style={{ width: `${(bibleAudioCurrentTime / (bibleAudioDuration || 1)) * 100}%` }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#78716C' }}>
                      <span>{formatTime(bibleAudioCurrentTime)}</span>
                      <span>{formatTime(bibleAudioDuration)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {bibleResults.length > 0 ? (
              <div style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3>Resultados ({bibleResults.length})</h3>
                  <button className="btn-secondary" style={{ padding: '5px 12px', fontSize: '0.82rem' }} onClick={() => { setBibleResults([]); setBibleSearchQuery(''); }}>Limpar</button>
                </div>
                {bibleResults.map((v, idx) => (
                  <div key={idx} className="glass-panel" style={{ position: 'relative', paddingTop: '42px' }}>
                    <span className="section-chip" style={{ position: 'absolute', top: '14px', right: '14px', fontSize: '0.62rem' }}>
                      {v.livro_nome} {v.capitulo}:{v.versiculo}
                    </span>
                    <p style={{ fontStyle: 'italic', lineHeight: '1.80', fontSize: '1rem' }}>"{formatVerseText(v.texto)}"</p>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                      <button className="btn-secondary" style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }} onClick={() => copyToClipboard(`"${v.texto}" - ${v.livro_nome} ${v.capitulo}:${v.versiculo}`)}>
                        📋 Copiar
                      </button>
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(`*"${v.texto}"*\n_${v.livro_nome} ${v.capitulo}:${v.versiculo}_\n\n👉 *1Convite:* https://1convite.com.br`)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="btn-primary"
                        style={{ flex: 2, padding: '10px', textAlign: 'center', textDecoration: 'none' }}
                      >
                        📲 Enviar
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {bibleLoading ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '12px', animation: 'spin 1.5s linear infinite', display: 'inline-block' }}>📖</div>
                    <p style={{ color: '#A8A29E' }}>Carregando versículos...</p>
                  </div>
                ) : (
                  <div style={{ padding: '16px 20px 0' }}>
                    {bibleVerses.map(v => (
                      <div
                        key={v.id}
                        className={`bible-verse-row${bibleSelectedVerse?.id === v.id ? ' selected' : ''}`}
                        onClick={() => setBibleSelectedVerse(bibleSelectedVerse?.id === v.id ? null : v)}
                      >
                        <span className="bible-verse-num">{v.versiculo}</span>
                        <span style={{ lineHeight: '1.75', fontSize: '1rem' }}>{formatVerseText(v.texto)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {!bibleSelectedVerse && (
                  <div style={{ padding: '28px 20px', marginTop: '20px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                    <form onSubmit={searchBible} style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                      <input type="text" className="input-field" placeholder="Buscar versículo (ex: amor, fé)..." value={bibleSearchQuery} onChange={e => setBibleSearchQuery(e.target.value)} />
                      <button type="submit" className="btn-secondary" disabled={bibleLoading} style={{ flexShrink: 0, padding: '0 16px' }}>🔍</button>
                    </form>
                    {bibleError && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '12px' }}>{bibleError}</p>}
                    <button className="btn-orange-outline" onClick={getRandomVerse}>🎲 Versículo Aleatório</button>
                  </div>
                )}
              </>
            )}

            {/* Menu flutuante de versículo selecionado */}
            {bibleSelectedVerse && bibleResults.length === 0 && (
              <div className="bible-action-menu">
                <button
                  className="btn-secondary"
                  style={{ flex: 1, padding: '12px' }}
                  onClick={() => { copyToClipboard(`"${bibleSelectedVerse.texto}" - ${bibleSelectedBook.livro_nome} ${bibleSelectedChapter}:${bibleSelectedVerse.versiculo}`); setBibleSelectedVerse(null); }}
                >
                  📋 Copiar
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`*"${bibleSelectedVerse.texto}"*\n_${bibleSelectedBook.livro_nome} ${bibleSelectedChapter}:${bibleSelectedVerse.versiculo}_\n\n👉 *1Convite:* https://1convite.com.br`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ flex: 2, padding: '12px', textAlign: 'center', textDecoration: 'none' }}
                  onClick={() => setBibleSelectedVerse(null)}
                >
                  📲 Compartilhar
                </a>
              </div>
            )}
          </div>
        )}

        {/* ════════════ ABA CONTATOS ════════════ */}
        {activeTab === 'contatos' && (
          <div className="page-enter">
            {/* Hero */}
            <div className="page-hero hero-contatos">
              <div className="hero-orb" style={{ width: 200, height: 200, top: -40, left: -40, background: 'rgba(249,115,22,0.15)' }} />
              <div className="hero-content">
                <div className="hero-label">👥 Mateus 24:14</div>
                <div className="hero-title">Meus Próximos</div>
                <div className="hero-sub">{contatos.length} {contatos.length === 1 ? 'pessoa' : 'pessoas'} no seu círculo de influência</div>
              </div>
            </div>

            <div className="page-content" style={{ paddingTop: '4px' }}>
              {/* Alertas */}
              {contatos.filter(verificarAlerta48h).map(c => (
                <div key={`alert-${c.id}`} className="glass-panel" style={{ padding: '14px 18px', marginBottom: '12px', borderColor: 'rgba(239,68,68,0.25)', background: 'rgba(254,242,242,0.80)' }}>
                  <p style={{ color: '#dc2626', fontWeight: '600', fontSize: '0.9rem' }}>
                    ⚠️ Alerta: Você tem notado <strong>{c.nome}</strong> ({c.relacao})? Já se passaram 48h.
                  </p>
                </div>
              ))}

              {/* Botão adicionar */}
              <button
                className={showAddContato ? 'btn-secondary' : 'btn-primary'}
                style={{ marginBottom: '16px' }}
                onClick={() => setShowAddContato(!showAddContato)}
              >
                {showAddContato ? '✕ Fechar Formulário' : '+ Adicionar Próximo'}
              </button>

              {/* Form */}
              {showAddContato && (
                <form onSubmit={handleAddContato} className="glass-panel" style={{ marginBottom: '16px' }}>
                  <h3 style={{ marginBottom: '16px' }}>🆕 Novo Contato</h3>
                  {contatoErro && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '12px' }}>{contatoErro}</p>}
                  <div className="input-group">
                    <label>Nome Completo</label>
                    <input type="text" className="input-field" value={newNome} onChange={e => setNewNome(e.target.value)} placeholder="Ex: Maria da Silva" required />
                  </div>
                  <div className="input-group">
                    <label>Relação / Vínculo</label>
                    <input type="text" className="input-field" value={newRelacao} onChange={e => setNewRelacao(e.target.value)} placeholder="Ex: Família, Vizinho, Trabalho" required />
                  </div>
                  <div className="input-group">
                    <label className="checkbox-label">
                      <input type="checkbox" checked={newPrioritario} onChange={e => setNewPrioritario(e.target.checked)} />
                      <span>Contato Prioritário <span style={{ color: '#A8A29E', fontSize: '0.85rem' }}>(alerta a cada 48h)</span></span>
                    </label>
                  </div>
                  <button type="submit" className="btn-primary" style={{ marginTop: '4px' }}>✅ Salvar no Reino</button>
                </form>
              )}

              {/* Lista */}
              {contatos.length === 0 && !showAddContato ? (
                <div className="glass-panel" style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🤝</div>
                  <h3 style={{ marginBottom: '8px' }}>Nenhum Próximo ainda</h3>
                  <p>Adicione pessoas do seu convívio diário para começar a notá-las com intenção.</p>
                </div>
              ) : (
                contatos.map(c => (
                  <div key={c.id} className="glass-panel" style={{ marginBottom: '12px', padding: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #F97316, #FB923C)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.1rem', color: '#fff', flexShrink: 0 }}>
                          {c.nome.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {c.nome}
                            {c.prioritario && <span className="section-chip" style={{ fontSize: '0.60rem' }}>⭐ Prior.</span>}
                          </div>
                          <div style={{ fontSize: '0.82rem', color: '#78716C', marginTop: '2px' }}>{c.relacao}</div>
                        </div>
                      </div>
                      <button onClick={() => deletarContato(c.id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '1.1rem', padding: '4px' }}>🗑</button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                      <span style={{ fontSize: '0.75rem', color: '#A8A29E' }}>
                        Último: {c.ultimo_convite_timestamp > 0 ? new Date(c.ultimo_convite_timestamp).toLocaleDateString('pt-BR') : 'Nunca'}
                      </span>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn-secondary" style={{ padding: '6px 10px', fontSize: '0.78rem', borderRadius: '10px' }} onClick={() => registrarAcao(c.id, 'mensagem')}>💬</button>
                        <button className="btn-secondary" style={{ padding: '6px 10px', fontSize: '0.78rem', borderRadius: '10px' }} onClick={() => registrarAcao(c.id, 'cafe')}>☕</button>
                        <button className="btn-secondary" style={{ padding: '6px 10px', fontSize: '0.78rem', borderRadius: '10px' }} onClick={() => registrarAcao(c.id, 'casa_igreja')}>🏠</button>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {user?.status_plano === 'FREE' && contatos.length >= 3 && (
                <div className="glass-panel orange-card" style={{ textAlign: 'center', marginTop: '8px' }}>
                  <p style={{ marginBottom: '14px', fontWeight: '500' }}>Limite de 3 contatos no plano gratuito.</p>
                  <button className="btn-primary" onClick={() => setActiveTab('upgrade')}>🔓 Desbloquear Ilimitados</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════════════ ABA HISTÓRICO ════════════ */}
        {activeTab === 'historico' && (
          <div className="page-enter">
            <div className="page-hero hero-contatos" style={{ background: 'linear-gradient(135deg, #475569 0%, #64748B 100%)' }}>
              <div className="hero-content">
                <div className="hero-label">📚 Jornada</div>
                <div className="hero-title">Histórico de Códigos</div>
                <div className="hero-sub">Mural de revelações da sua caminhada</div>
              </div>
            </div>

            <div className="page-content" style={{ paddingTop: '4px' }}>
              {user?.status_plano === 'FREE' ? (
                <div className="premium-lock-card" style={{ padding: '36px 24px' }}>
                  <div className="premium-lock-icon">🔒</div>
                  <h4 style={{ margin: '8px 0 4px 0', fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>Mural Completo de Códigos</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.4' }}>Acesse a linha do tempo completa de todas as suas revelações e códigos diários destravados.</p>
                  <button className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem', width: 'auto' }} onClick={() => setActiveTab('upgrade')}>🔓 Destravar Histórico</button>
                </div>
              ) : (
                <>
                  <input type="text" className="input-field" placeholder="🔍 Pesquisar código, versículo..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ marginBottom: '16px' }} />
                  {historico
                    .filter(item => item.codigo_verbal.toLowerCase().includes(searchQuery.toLowerCase()) || item.versiculo_chave.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(item => (
                      <div key={item.dia_id} className="glass-panel">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span className="section-chip" style={{ fontSize: '0.68rem' }}>Dia {item.dia_id}</span>
                          <span style={{ fontSize: '0.72rem', color: '#A8A29E', fontWeight: '600' }}>{item.pilar_origem?.replace('_', ' ')}</span>
                        </div>
                        <h3 style={{ fontSize: '1rem', marginBottom: '6px' }}>{item.codigo_verbal}</h3>
                        <p style={{ fontStyle: 'italic', fontSize: '0.85rem', color: '#78716C' }}>{item.versiculo_chave}</p>
                      </div>
                    ))}
                  {historico.length === 0 && (
                    <div className="glass-panel" style={{ textAlign: 'center', padding: '40px 20px' }}>
                      <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📅</div>
                      <p>Nenhum código registrado ainda. Complete mais dias!</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* ════════════ ABA UPGRADE ════════════ */}
        {activeTab === 'upgrade' && (
          <div className="page-enter">
            <div className="page-hero hero-premium">
              <div className="hero-orb" style={{ width: 250, height: 250, top: -60, right: -50, background: 'rgba(249,115,22,0.25)' }} />
              <div className="hero-content">
                <div className="hero-label">⭐ Plano Premium</div>
                <div className="hero-title">Entre no Governo do Reino</div>
                <div className="hero-sub">Ferramentas completas de transformação espiritual</div>
              </div>
            </div>

            <div className="page-content" style={{ paddingTop: '4px' }}>
              <div className="glass-panel dark-card" style={{ marginBottom: '16px' }}>
                {[
                  { icon: '🎧', feat: 'Meditações Guiadas', val: '365 áudios', desc: 'Um áudio por dia de alinhamento' },
                  { icon: '👥', feat: 'Contatos Ilimitados', val: 'Sem limites', desc: 'Todo o seu círculo de influência' },
                  { icon: '⚠️', feat: 'Alertas de Conexão', val: 'Automáticos', desc: 'Notificação a cada 48h por prioritário' },
                  { icon: '📖', feat: 'Histórico Completo', val: 'Liberado', desc: 'Mural de todos os códigos' },
                ].map(({ icon, feat, val, desc }) => (
                  <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#fff' }}>{feat}</div>
                      <div style={{ fontSize: '0.80rem', color: 'rgba(255,255,255,0.60)' }}>{desc}</div>
                    </div>
                    <span style={{ fontWeight: '700', color: '#FCD34D', fontSize: '0.85rem', flexShrink: 0 }}>{val}</span>
                  </div>
                ))}
              </div>

              <div className="glass-panel orange-card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.85rem', color: '#78716C', marginBottom: '4px', fontWeight: '600' }}>PLANO MENSAL</div>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px', marginBottom: '20px' }}>
                  <span style={{ fontSize: '1.1rem', color: '#78716C' }}>R$</span>
                  <span style={{ fontSize: '3rem', fontWeight: '900', color: '#C2550A', lineHeight: 1 }}>19</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#C2550A' }}>,90</span>
                  <span style={{ fontSize: '0.85rem', color: '#A8A29E', alignSelf: 'flex-end', marginBottom: '6px' }}>/mês</span>
                </div>
                <button className="btn-primary" onClick={iniciarCheckoutMercadoPago} disabled={isPaying}>
                  {isPaying ? '⏳ Gerando...' : '🚀 Assinar com Mercado Pago'}
                </button>
                <p style={{ fontSize: '0.78rem', color: '#A8A29E', marginTop: '12px' }}>Cancele quando quiser • Pagamento seguro</p>
              </div>
            </div>
          </div>
        )}

        {/* ════════════ TELA PAGAMENTO ════════════ */}
        {activeTab === 'simular-pagamento' && (
          <div className="page-enter" style={{ padding: '20px', paddingBottom: '40px' }}>
            <div className="glass-panel" style={{ borderTop: '4px solid #009ee3', marginTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ color: '#009ee3', fontWeight: '800', fontSize: '1.2rem' }}>mercado pago</span>
                <span style={{ fontSize: '0.75rem', color: '#A8A29E', fontWeight: '700', border: '1px solid #E5E7EB', padding: '2px 8px', borderRadius: '4px' }}>SANDBOX</span>
              </div>
              <h3 style={{ marginBottom: '14px' }}>Resumo da Assinatura</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', background: '#F8FAFC', padding: '12px 16px', borderRadius: '10px', marginBottom: '18px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontWeight: '500' }}>1Convite Premium — Mensal</span>
                <strong style={{ color: '#1C1917' }}>R$ 19,90</strong>
              </div>
              <p style={{ fontSize: '0.88rem', marginBottom: '20px', color: '#78716C', lineHeight: '1.65' }}>
                Ambiente de checkout seguro. Clique no botão abaixo para simular a aprovação instantânea do pagamento.
              </p>
              <button className="btn-primary" style={{ background: 'linear-gradient(135deg, #009ee3, #0088CC)' }} onClick={finalizarPagamentoSimulado}>
                ⚡ Confirmar e Simular Aprovação
              </button>
              <button className="btn-secondary" style={{ marginTop: '10px', width: '100%' }} onClick={() => setActiveTab('upgrade')}>Cancelar</button>
            </div>
          </div>
        )}

        {/* ── ABA MINHA CONTA & PERFIL ────────────────────────── */}
        {activeTab === 'conta' && (
          <div className="page-enter flex-column gap-md">
            <div className="page-hero hero-sabado" style={{ textAlign: 'center', padding: '30px 20px' }}>
              <div className="hero-content">
                <div className="profile-avatar-container">
                  <img src={profileAvatar} alt="Foto de Perfil" className="profile-avatar-img" />
                  <label className="profile-avatar-upload-btn" title="Alterar foto de perfil">
                    📷
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} />
                  </label>
                </div>
                <h2 className="hero-title" style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{profileName}</h2>
                <span className={`pedagio-badge ${user?.status_plano === 'PREMIUM' ? 'badge-proposito' : 'badge-recompensa'}`}>
                  {user?.status_plano === 'PREMIUM' ? '⭐ Membro Premium' : '🌱 Plano Gratuito (FREE)'}
                </span>
              </div>
            </div>

            <div className="page-content" style={{ paddingTop: '10px' }}>
              {/* Login com o Google */}
              <div className="glass-panel" style={{ marginBottom: '16px', textAlign: 'center' }}>
                <h3 style={{ marginBottom: '14px', fontSize: '1.05rem', textAlign: 'left' }}>🔑 Autenticação do Google</h3>
                
                {profileEmail !== 'membro@1convite.com' ? (
                  <div className="flex-column gap-sm">
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      Conectado como <strong>{profileEmail}</strong>
                    </p>
                    <button className="btn-secondary" style={{ width: '100%' }} onClick={handleLogout}>
                      🚪 Sair da Conta (Logout)
                    </button>
                  </div>
                ) : (
                  <div className="flex-column gap-sm">
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: '1.5' }}>
                      Conecte sua conta do Google para preencher automaticamente sua foto de perfil, nome e garantir seu acesso.
                    </p>
                    
                    {/* Container do Botão Real do Google */}
                    <div id="google-signin-btn-container" style={{ width: '100%', marginBottom: '8px' }}></div>
                    
                    {/* Botão de Simulação de Login Google */}
                    <button className="btn-google-signin" onClick={handleSimularLoginGoogle}>
                      <svg width="18" height="18" viewBox="0 0 18 18">
                        <path fill="#4285F4" d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.47h4.84c-.21 1.12-.84 2.07-1.79 2.7v2.24h2.9c1.69-1.55 2.69-3.84 2.69-6.57z"/>
                        <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.23l-2.9-2.24c-.8.54-1.84.87-3.06.87-2.35 0-4.35-1.59-5.06-3.73H.95v2.3C2.43 15.89 5.5 18 9 18z"/>
                        <path fill="#FBBC05" d="M3.94 10.67c-.18-.54-.28-1.12-.28-1.72s.1-1.18.28-1.72v-2.3H.95C.34 6.16 0 7.54 0 9s.34 2.84.95 4.07l2.99-2.3z"/>
                        <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35L15 2.4C13.46.97 11.43 0 9 0 5.5 0 2.43 2.11.95 5.07l2.99 2.3c.71-2.14 2.71-3.79 5.06-3.79z"/>
                      </svg>
                      Testar/Simular Login Google
                    </button>
                  </div>
                )}
              </div>

              {/* Alternância de Tema */}
              <div className="glass-panel" style={{ marginBottom: '16px' }}>
                <h3 style={{ marginBottom: '14px', fontSize: '1.05rem' }}>🎨 Aparência & Tema</h3>
                <div className="toggle-switch-container">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.2rem' }}>{darkMode ? '🌙' : '☀️'}</span>
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.92rem' }}>Modo Escuro (Dark Mode)</strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Alternar tema de cores da interface</span>
                    </div>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              {/* Informações da Conta */}
              <div className="glass-panel" style={{ marginBottom: '16px' }}>
                <h3 style={{ marginBottom: '16px', fontSize: '1.05rem' }}>👤 Informações Pessoais</h3>
                <form onSubmit={handleSaveProfile} className="flex-column gap-sm">
                  <div className="input-group">
                    <label>Nome Completo</label>
                    <input type="text" className="input-field" value={profileName} onChange={(e) => setProfileName(e.target.value)} placeholder="Seu nome" />
                  </div>
                  <div className="input-group">
                    <label>E-mail da Conta</label>
                    <input type="email" className="input-field" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} placeholder="seu.email@exemplo.com" />
                  </div>

                  {profileSavedMsg && (
                    <div style={{ color: '#16a34a', fontSize: '0.85rem', fontWeight: 'bold', margin: '4px 0' }}>
                      {profileSavedMsg}
                    </div>
                  )}

                  <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>
                    💾 Salvar Alterações
                  </button>
                </form>
              </div>

              {/* Plano & Assinatura */}
              <div className="glass-panel">
                <h3 style={{ marginBottom: '12px', fontSize: '1.05rem' }}>💳 Plano & Assinatura</h3>
                <div className="flex-between" style={{ background: 'var(--slate-light)', padding: '14px', borderRadius: '12px', marginBottom: '14px' }}>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.95rem' }}>1Convite Premium</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {user?.status_plano === 'PREMIUM' ? 'Sua assinatura está ativa' : 'Acesso limitado ao plano gratuito'}
                    </span>
                  </div>
                  <span style={{ fontWeight: 'bold', color: 'var(--orange)' }}>
                    {user?.status_plano === 'PREMIUM' ? 'ATIVO' : 'R$ 19,90/mês'}
                  </span>
                </div>

                {user?.status_plano === 'FREE' ? (
                  <button className="btn-primary" style={{ width: '100%' }} onClick={() => setActiveTab('upgrade')}>
                    ⚡ Fazer Upgrade para Premium
                  </button>
                ) : (
                  <button className="btn-secondary" style={{ width: '100%' }} onClick={() => setActiveTab('sabado')}>
                    Acessar Conteúdo Exclusivo
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ── BOTTOM NAV ────────────────────────── */}
      {activeTab !== 'pedagio' && activeTab !== 'simular-pagamento' && (
        <nav className="nav-tabs">
          {[
            { id: 'sabado', label: 'Sabático', path: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
            { id: 'biblia', label: 'Bíblia', path: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
            { id: 'contatos', label: 'Contatos', path: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
            { id: 'historico', label: 'Histórico', path: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
            { id: 'upgrade', label: 'Premium', path: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
            { id: 'conta', label: 'Conta', path: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
          ].map(tab => (
            <button
              key={tab.id}
              className={`tab-item${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === 'biblia') { setBibleViewMode('reading'); setBibleSelectedVerse(null); }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeTab === tab.id ? 2.2 : 1.8} d={tab.path} />
              </svg>
              {tab.label}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}

export default App;
