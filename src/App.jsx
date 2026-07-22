import React, { useState, useEffect, useRef } from 'react';
import Onboarding from './components/Onboarding';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [codigoDia, setCodigoDia] = useState(null);
  const [contatos, setContatos] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Customização de Temas & Cores
  const [theme, setTheme] = useState(() => localStorage.getItem('app-theme') || 'theme-green');
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem('onboarding-completed'));

  useEffect(() => {
    document.body.classList.remove('theme-orange', 'theme-blue', 'theme-green', 'theme-purple', 'theme-sepia');
    document.body.classList.add(theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  // Login com ChatGPT
  const [chatFontSize, setChatFontSize] = useState('md');
  const [chatGptUser, setChatGptUser] = useState(null);
  const [lwcState, setLwcState] = useState('unauthenticated');
  const [lwcDeviceCode, setLwcDeviceCode] = useState(null);
  const [lwcPollingActive, setLwcPollingActive] = useState(false);

  // Chat IA
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Olá! Sou o Conselheiro Inteligente do 1Convite. Como posso te apoiar hoje em suas reflexões, relacionamentos ou espiritualidade?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef(null);

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
  const [breathTechnique, setBreathTechnique] = useState('simple');
  const [breathRounds, setBreathRounds] = useState(5);
  const [currentRound, setCurrentRound] = useState(1);
  const breathIntervalRef = useRef(null);
  const isBreathingActiveRef = useRef(false);

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

  // Destaques e Comentários da Bíblia
  const [bibleHighlights, setBibleHighlights] = useState(() => JSON.parse(localStorage.getItem('bible-highlights')) || {});
  const [bibleComments, setBibleComments] = useState(() => JSON.parse(localStorage.getItem('bible-comments')) || {});
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [bibleShowAudioPlayer, setBibleShowAudioPlayer] = useState(false);
  const [activeSabadoBlock, setActiveSabadoBlock] = useState('menu');
  const [isNarrating, setIsNarrating] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  // Estados específicos para o player de Meditação Guiada TTS
  const [meditationPlaying, setMeditationPlaying] = useState(false);
  const [meditationCurrentTime, setMeditationCurrentTime] = useState(0);
  const [meditationDuration, setMeditationDuration] = useState(120);
  const [showMeditationLyrics, setShowMeditationLyrics] = useState(false);
  const meditationIntervalRef = useRef(null);
  const [meditationCompleted, setMeditationCompleted] = useState(false);
  
  // Som ambiente de fundo e velocidade para Meditação
  const [activeAmbient, setActiveAmbient] = useState('none');
  const [ambientVolume, setAmbientVolume] = useState(0.15);
  const [narrationRate, setNarrationRate] = useState(0.82);
  const ambientAudioRef = useRef(null);
  const meditationTimeoutRef = useRef(null);
  const currentSegmentIndexRef = useRef(0);
  const meditationVideoRef = useRef(null);

  useEffect(() => {
    if (meditationVideoRef.current) {
      if (meditationPlaying) {
        meditationVideoRef.current.play().catch(() => {});
      } else {
        meditationVideoRef.current.pause();
      }
    }
  }, [meditationPlaying]);

  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState(localStorage.getItem('preferred_voice') || '');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        const ptVoices = voices.filter(v => v.lang.startsWith('pt'));
        setAvailableVoices(ptVoices);
        if (!localStorage.getItem('preferred_voice') && ptVoices.length > 0) {
          const best = ptVoices.find(v => v.name.includes('Natural')) || 
                       ptVoices.find(v => v.name.includes('Google')) || 
                       ptVoices[0];
          setSelectedVoiceName(best.name);
        }
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

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

    // Forçar fundo preto no body e transparente no root para o vídeo de background aparecer
    const originalBodyBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#030303';
    
    const rootEl = document.getElementById('root');
    let originalRootBg = '';
    if (rootEl) {
      originalRootBg = rootEl.style.backgroundColor;
      rootEl.style.backgroundColor = 'transparent';
    }

    const video = document.getElementById("lp-bg-video");
    if (video) {
      video.load();
      video.currentTime = 0.01;
      
      const initScrollTrigger = () => {
        if (window.gsap && window.ScrollTrigger) {
          const gsap = window.gsap;
          const ScrollTrigger = window.ScrollTrigger;
          
          gsap.registerPlugin(ScrollTrigger);
          
          ScrollTrigger.create({
            trigger: ".lp-container",
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5,
            onUpdate: (self) => {
              if (video.duration) {
                const targetTime = self.progress * video.duration;
                gsap.to(video, {
                  currentTime: targetTime,
                  duration: 0.1,
                  overwrite: "auto",
                  ease: "none"
                });
              }
            }
          });
        }
      };

      if (video.readyState >= 1) {
        initScrollTrigger();
      } else {
        video.addEventListener('loadedmetadata', initScrollTrigger);
      }

      return () => {
        document.body.style.backgroundColor = originalBodyBg;
        if (rootEl) rootEl.style.backgroundColor = originalRootBg;
        video.removeEventListener('loadedmetadata', initScrollTrigger);
      };
    }
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

  const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') 
    ? 'http://localhost:3001/api/v1' 
    : '/api/v1';

  // ── ChatGPT Integration & Chat IA ──────────────────────────
  useEffect(() => {
    fetch(`${API_BASE}/chatgpt/session`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data && data.status === 'authenticated') {
          setLwcState('authenticated');
          setChatGptUser(data.user);
        }
      })
      .catch(err => console.error('Erro ao verificar sessão do ChatGPT:', err));
  }, [API_BASE]);

  const startLwcPolling = (intervalSeconds) => {
    setLwcPollingActive(true);
    const intervalMs = intervalSeconds * 1000;
    
    const poll = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE}/chatgpt/status`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'authenticated') {
            clearInterval(poll);
            setLwcPollingActive(false);
            setLwcState('authenticated');
            setChatGptUser(data.user);
            setLwcDeviceCode(null);
          } else if (data.status === 'expired' || data.status === 'error') {
            clearInterval(poll);
            setLwcPollingActive(false);
            setLwcState('unauthenticated');
            setLwcDeviceCode(null);
          }
        }
      } catch (err) {
        console.error('Erro ao obter status do ChatGPT:', err);
      }
    }, intervalMs);

    return () => clearInterval(poll);
  };

  const handleConnectChatGPT = async () => {
    try {
      setLwcState('pending');
      const res = await fetch(`${API_BASE}/chatgpt/login`, { method: 'POST', credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setLwcDeviceCode(data);
        startLwcPolling(data.interval || 5);
      } else {
        setLwcState('unauthenticated');
        alert('Erro ao iniciar conexão com ChatGPT.');
      }
    } catch (err) {
      setLwcState('unauthenticated');
      console.error(err);
    }
  };

  const handleDisconnectChatGPT = async () => {
    try {
      const res = await fetch(`${API_BASE}/chatgpt/logout`, { method: 'POST', credentials: 'include' });
      if (res.ok) {
        setLwcState('unauthenticated');
        setChatGptUser(null);
        setLwcDeviceCode(null);
      }
    } catch (err) {
      console.error('Erro ao desconectar ChatGPT:', err);
    }
  };

  const parseStreamChunk = (chunk) => {
    let text = '';
    const lines = chunk.split('\n');
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const dataStr = line.slice(6).trim();
        if (dataStr === '[DONE]') continue;
        try {
          const data = JSON.parse(dataStr);
          if (data.type === 'response.output_text.delta' && typeof data.delta === 'string') {
            text += data.delta;
          } else if (data.type === 'response.content_part.updated' || data.type === 'response.content_part.delta') {
            if (data.part?.text) text += data.part.text;
            else if (data.delta?.text) text += data.delta.text;
          } else if (data.type === 'text_delta') {
            text += data.text;
          } else if (data.delta?.content) {
            text += data.delta.content;
          } else if (data.part?.type === 'text' && data.part.text) {
            text += data.part.text;
          } else if (data.choices?.[0]?.delta?.content) {
            text += data.choices[0].delta.content;
          }
        } catch {
          // Ignore
        }
      }
    }
    return text;
  };

  const handleSendChatMessage = async (e, customText = null) => {
    if (e) e.preventDefault();
    const textToSend = customText || chatInput;
    if (!textToSend.trim() || chatLoading) return;

    if (lwcState !== 'authenticated') {
      alert('Conecte sua conta do ChatGPT na aba "Conta" para conversar com o Conselheiro IA.');
      return;
    }

    const newUserMessage = { role: 'user', content: textToSend };
    setChatMessages(prev => [...prev, newUserMessage]);
    setChatInput('');
    setChatLoading(true);

    try {
      const history = chatMessages.concat(newUserMessage);
      
      const payload = {
        stream: true,
        instructions: 'Você é o Conselheiro Inteligente do aplicativo 1Convite. Seu objetivo é ajudar o usuário com aconselhamento de relacionamentos, paz interior, espiritualidade e ideias de convites/conexões intencionais (café, reflexões, jantares, tempo de qualidade). Seja caloroso, empático, bíblico e focado no momento presente (o Agora). Responda sempre em português do Brasil.',
        input: history.map(msg => ({
          role: msg.role,
          content: [
            { 
              type: msg.role === 'user' ? 'input_text' : 'output_text', 
              text: msg.content 
            }
          ]
        }))
      };

      const res = await fetch(`${API_BASE}/chatgpt/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
      });

      if (!res.ok) {
        throw new Error('Falha ao obter resposta do ChatGPT.');
      }

      setChatMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const newText = parseStreamChunk(chunk);
        if (newText) {
          accumulatedText += newText;
          setChatMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: 'assistant', content: accumulatedText };
            return updated;
          });
        }
      }
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Desculpe, ocorreu um erro ao obter a resposta.' }]);
    } finally {
      setChatLoading(false);
    }
  };

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

  // ── Respiração (Botão do Descanso Pró) ──────────────────────
  const playChime = (freq = 440, type = 'sine', duration = 1.2) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('AudioContext bloqueado:', e);
    }
  };

  const triggerHaptic = (ms = 50) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(ms);
    }
  };

  const pararRespiracao = () => {
    isBreathingActiveRef.current = false;
    setIsBreathing(false);
    setBreathState('Toque para iniciar');
    setBreathClass('');
    if (breathIntervalRef.current) {
      clearInterval(breathIntervalRef.current);
      breathIntervalRef.current = null;
    }
  };

  const iniciarRespiracao = () => {
    if (isBreathing) return;
    isBreathingActiveRef.current = true;
    setIsBreathing(true);
    setCurrentRound(1);
    
    let phases = [];
    if (breathTechnique === 'box') {
      phases = [
        { text: 'Inspire...', cls: 'inhaling', d: 4, freq: 528, osc: 'sine' },
        { text: 'Segure...', cls: 'holding', d: 4, freq: 639, osc: 'sine' },
        { text: 'Expire...', cls: 'exhaling', d: 4, freq: 396, osc: 'triangle' },
        { text: 'Aguarde...', cls: 'holding-empty', d: 4, freq: 432, osc: 'sine' }
      ];
    } else if (breathTechnique === 'relax') {
      phases = [
        { text: 'Inspire...', cls: 'inhaling', d: 4, freq: 528, osc: 'sine' },
        { text: 'Segure...', cls: 'holding', d: 7, freq: 639, osc: 'sine' },
        { text: 'Expire...', cls: 'exhaling', d: 8, freq: 396, osc: 'triangle' }
      ];
    } else {
      phases = [
        { text: 'Inspire...', cls: 'inhaling', d: 4, freq: 528, osc: 'sine' },
        { text: 'Segure...', cls: 'holding', d: 4, freq: 639, osc: 'sine' },
        { text: 'Expire...', cls: 'exhaling', d: 4, freq: 396, osc: 'triangle' }
      ];
    }

    let round = 1;
    let step = 0;

    const run = () => {
      if (!isBreathingActiveRef.current) return;
      
      if (round > breathRounds) {
        playChime(528, 'sine', 1.8);
        setTimeout(() => playChime(432, 'sine', 2.0), 100);
        triggerHaptic([80, 50, 80]);
        setBreathState('Desfrute Completo! ✨');
        setBreathClass('');
        setIsBreathing(false);
        isBreathingActiveRef.current = false;
        return;
      }

      if (step >= phases.length) {
        step = 0;
        round++;
        if (round <= breathRounds) {
          setCurrentRound(round);
          run();
        } else {
          // Finalização
          playChime(528, 'sine', 1.8);
          setTimeout(() => playChime(432, 'sine', 2.0), 100);
          triggerHaptic([80, 50, 80]);
          setBreathState('Desfrute Completo! ✨');
          setBreathClass('');
          setIsBreathing(false);
          isBreathingActiveRef.current = false;
        }
        return;
      }

      const ph = phases[step];
      setBreathState(ph.text);
      setBreathClass(ph.cls);
      setBreathTimer(ph.d);
      
      playChime(ph.freq, ph.osc, 1.2);
      triggerHaptic(50);

      let cv = ph.d;
      breathIntervalRef.current = setInterval(() => {
        if (!isBreathingActiveRef.current) {
          clearInterval(breathIntervalRef.current);
          return;
        }
        cv--;
        setBreathTimer(cv);
        if (cv <= 0) {
          clearInterval(breathIntervalRef.current);
          step++;
          run();
        }
      }, 1000);
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

  const speakReflection = () => {
    if (!('speechSynthesis' in window)) {
      alert('Narração de voz não disponível no navegador.');
      return;
    }
    if (isNarrating) {
      window.speechSynthesis.cancel();
      setIsNarrating(false);
      return;
    }
    const texto = `${codigoDia.codigo_verbal}. Versículo chave: ${codigoDia.versiculo_chave}. Reflexão: ${codigoDia.texto_reflexao.replace(/\n/g, ' ')}`;
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.05;

    if ('speechSynthesis' in window) {
      const voices = window.speechSynthesis.getVoices();
      let selectedVoice = voices.find(v => v.lang.startsWith('pt') && v.name.includes('Natural'));
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.startsWith('pt') && v.name.includes('Google'));
      }
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.startsWith('pt'));
      }
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    utterance.onend = () => setIsNarrating(false);
    utterance.onerror = () => setIsNarrating(false);
    setIsNarrating(true);
    window.speechSynthesis.speak(utterance);
  };

  const generateDailyReflectionWithAI = async () => {
    if (!codigoDia) return;
    try {
      setAiGenerating(true);
      const prompt = `Você é o teólogo e historiador oficial do aplicativo 1Convite.
Gere um devocional cristão inspirador e um script de Oração Guiada no Estilo de Jesus (Ação de Graças, Certeza de que o Pai ouve e Alinhamento com o Propósito) para o Dia ${codigoDia.dia_id}.
O pilar bíblico deste dia é ${codigoDia.pilar_origem === 'PROPÓSITO_M2414' ? 'Mateus 24:14 (Propósito)' : 'Apocalipse 3:21 (Recompensa)'}.

Você deve responder EXCLUSIVAMENTE em formato JSON (sem formatação markdown fora do JSON ou explicações extras):
{
  "codigo_verbal": "Código ${codigoDia.dia_id}: [Escreva um título/código curto e impactante sobre relacionamento intencional, mesa, comunhão, desacelerar ou servir]",
  "versiculo_chave": "[Insira um versículo bíblico real e sua referência no formato Livro Capítulo:Versículo]",
  "texto_reflexao": "[Escreva a reflexão prática do dia inspirada no versículo. Após a reflexão, insira duas quebras de linha e conte uma história real e verídica da história do cristianismo que exemplifique perfeitamente este tema (ex: biographies de heróis da fé, missionários, momentos de avivamento). Insira a história sob o título '📖 HISTÓRIA CRISTÃ REAL:\\n[sua história aqui]']",
  "texto_meditacao": "[Escreva um Roteiro de Oração Guiada no Estilo de Jesus com cerca de 4 blocos. Use os seguintes títulos de blocos no roteiro: '🟢 1. O Ponto de Partida: Ação de Graças pelo Hoje' (Tom de voz: Calmo, grato, pausado), '🟡 2. O Alinhamento: Tudo o que Tenho é Suficiente', '🟠 3. O Propósito e o Mover no Agora' (Tom de voz: Firme, consciente, de governo), '🔴 4. A Selagem do Convite' (Tom de voz: Decidido, pronto para a ação). Insira marcadores de silêncio programados como '(Pausa de 3 segundos)' ou '(Pausa de 4 segundos)' de forma estratégica entre os parágrafos para simular pausas reais na leitura.]"
}

Importante: O JSON deve ser 100% válido.`;

      const res = await fetch(`${API_BASE}/chatgpt/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'Você é um assistente teológico que responde estritamente no formato JSON puro especificado pelo usuário.' },
            { role: 'user', content: prompt }
          ]
        }),
        credentials: 'include'
      });

      if (res.ok) {
        const data = await res.json();
        const contentText = data.choices[0].message.content;
        const cleanJson = contentText.replace(/```json|```/g, '').trim();
        const generated = JSON.parse(cleanJson);

        const saveRes = await fetch(`${API_BASE}/codigo-dia/save`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dia_id: codigoDia.dia_id,
            codigo_verbal: generated.codigo_verbal,
            versiculo_chave: generated.versiculo_chave,
            texto_reflexao: generated.texto_reflexao,
            texto_meditacao: generated.texto_meditacao
          })
        });

        if (saveRes.ok) {
          setCodigoDia({
            ...codigoDia,
            codigo_verbal: generated.codigo_verbal,
            versiculo_chave: generated.versiculo_chave,
            texto_reflexao: generated.texto_reflexao,
            texto_meditacao: generated.texto_meditacao
          });
        } else {
          alert('Erro ao salvar reflexão gerada.');
        }
      } else {
        alert('Erro ao solicitar resposta do ChatGPT.');
      }
    } catch (err) {
      console.error('Erro na geração com IA:', err);
      alert('Falha na geração: verifique sua conexão com o ChatGPT.');
    } finally {
      setAiGenerating(false);
    }
  };

  const ambientTracks = [
    { id: 'none', label: '🔕 Silêncio', url: '' },
    { id: 'chuva', label: '🌧️ Chuva', url: '/rain.mp3' },
    { id: 'mar', label: '🌊 Ondas', url: '/ocean.mp3' },
    { id: 'piano', label: '🎹 Piano', url: '/piano.mp3' }
  ];

  useEffect(() => {
    if (ambientAudioRef.current) {
      ambientAudioRef.current.volume = ambientVolume;
    }
  }, [ambientVolume]);

  useEffect(() => {
    if (!ambientAudioRef.current) return;
    ambientAudioRef.current.pause();
    
    const track = ambientTracks.find(t => t.id === activeAmbient);
    if (track && track.url) {
      ambientAudioRef.current.src = track.url;
      ambientAudioRef.current.loop = true;
      if (meditationPlaying) {
        ambientAudioRef.current.volume = ambientVolume;
        ambientAudioRef.current.play().catch(() => {});
      }
    }
  }, [activeAmbient]);

  const stopMeditation = () => {
    window.speechSynthesis.cancel();
    setMeditationPlaying(false);
    if (ambientAudioRef.current) {
      ambientAudioRef.current.pause();
    }
    if (meditationIntervalRef.current) {
      clearInterval(meditationIntervalRef.current);
      meditationIntervalRef.current = null;
    }
    if (meditationTimeoutRef.current) {
      clearTimeout(meditationTimeoutRef.current);
      meditationTimeoutRef.current = null;
    }
  };

  const toggleMeditationTTS = () => {
    if (!('speechSynthesis' in window)) {
      alert('Narração de voz não disponível no navegador.');
      return;
    }

    if (meditationPlaying) {
      stopMeditation();
      return;
    }

    const rawText = codigoDia.texto_meditacao || 'Respire fundo... e concentre-se.';
    
    // Parser profissional: extrai pausas programadas e tons de voz
    const lines = rawText.split('\n');
    const segments = [];
    let currentRate = narrationRate;
    
    for (let line of lines) {
      line = line.trim();
      if (!line) continue;
      
      // Ignorar metadados de guia
      if (line.startsWith('Roteiro de Meditação') || line.startsWith('Duração') || line.startsWith('Trilha de fundo') || line.startsWith('🟢') || line.startsWith('🟡') || line.startsWith('🟠') || line.startsWith('🔴')) {
        continue;
      }
      
      // Tom de voz
      if (line.startsWith('(Tom de voz:')) {
        if (line.includes('Suave') || line.includes('pausado')) {
          currentRate = narrationRate * 0.9;
        } else if (line.includes('Firme') || line.includes('ritmo')) {
          currentRate = narrationRate * 1.05;
        } else {
          currentRate = narrationRate;
        }
        continue;
      }
      
      // Pausa programada
      const pauseMatch = line.match(/\(Pausa de (\d+) segundos\)/i);
      if (pauseMatch) {
        const secs = parseInt(pauseMatch[1], 10);
        segments.push({ type: 'pause', duration: secs * 1000 });
        continue;
      }
      
      const cleanLine = line.replace(/^["']|["']$/g, '');
      if (cleanLine) {
        segments.push({ type: 'text', text: cleanLine, rate: currentRate });
      }
    }

    if (segments.length === 0) {
      segments.push({ type: 'text', text: rawText, rate: narrationRate });
    }

    // Calcular duração com precisão (considerando velocidade da fala e pausas de respiração)
    let totalSecs = 0;
    segments.forEach(seg => {
      if (seg.type === 'pause') {
        totalSecs += seg.duration / 1000;
      } else {
        const wc = seg.text.split(' ').length;
        totalSecs += Math.max(3.5, Math.round((wc * 0.65) / seg.rate));
      }
    });

    setMeditationDuration(totalSecs);
    setMeditationCurrentTime(0);
    setMeditationPlaying(true);
    setMeditationCompleted(false);

    if (activeAmbient !== 'none' && ambientAudioRef.current) {
      const track = ambientTracks.find(t => t.id === activeAmbient);
      if (track && track.url) {
        ambientAudioRef.current.src = track.url;
        ambientAudioRef.current.loop = true;
        ambientAudioRef.current.volume = ambientVolume;
        ambientAudioRef.current.play().catch(() => {});
      }
    }

    const startTime = Date.now();
    meditationIntervalRef.current = setInterval(() => {
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      setMeditationCurrentTime(Math.min(elapsed, totalSecs));
    }, 1000);

    const playSegment = (index) => {
      if (index >= segments.length) {
        setMeditationCompleted(true);
        // Mantém som ambiente por mais 15s de contemplação antes de terminar
        meditationTimeoutRef.current = setTimeout(() => {
          stopMeditation();
          setMeditationCurrentTime(totalSecs);
        }, 15000);
        return;
      }

      currentSegmentIndexRef.current = index;
      const seg = segments[index];

      if (seg.type === 'pause') {
        meditationTimeoutRef.current = setTimeout(() => {
          playSegment(index + 1);
        }, seg.duration);
      } else {
        const utterance = new SpeechSynthesisUtterance(seg.text);
        utterance.lang = 'pt-BR';
        utterance.rate = seg.rate;
        utterance.pitch = 0.95;

        if ('speechSynthesis' in window) {
          const voice = window.speechSynthesis.getVoices().find(v => v.name === selectedVoiceName);
          if (voice) {
            utterance.voice = voice;
          }
        }

        utterance.onend = () => {
          meditationTimeoutRef.current = setTimeout(() => {
            playSegment(index + 1);
          }, 800);
        };

        utterance.onerror = () => {
          stopMeditation();
        };

        window.speechSynthesis.speak(utterance);
      }
    };

    playSegment(0);
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
    return (
      <div className="lp-container">
        {/* Video em Background controlado pelo ScrollTrigger */}
        <video 
          id="lp-bg-video"
          src="/Imagens/video.mp4.mp4"
          preload="auto"
          playsInline
          webkit-playsinline="true"
          muted
          loop
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: -2,
            pointerEvents: 'none'
          }}
        />
        {/* Overlay escuro para contraste e legibilidade */}
        <div className="lp-video-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.45)',
          zIndex: -1,
          pointerEvents: 'none'
        }} />

        {/* ── HEADER DA LANDING PAGE ────────────────────────── */}
        <header className="lp-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 40px', background: 'rgba(3, 3, 3, 0.45)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', zIndex: 100, width: '100%', position: 'sticky', top: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
            <img src="/LOGOMARCA.png" alt="1Convite Logo" style={{ height: '30px', objectFit: 'contain' }} />
            <button 
              className="btn-secondary" 
              onClick={() => {
                const loginEl = document.getElementById('secao-login');
                if (loginEl) loginEl.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 20px', fontSize: '0.85rem', fontWeight: 'bold', background: 'transparent', color: '#00f08f', border: '1.5px solid rgba(0, 240, 143, 0.4)', borderRadius: '9999px', cursor: 'pointer', transition: 'all 0.3s' }}
              onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(0, 240, 143, 0.08)'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              Acessar App 🔑
            </button>
          </div>
        </header>

        {/* ── SEÇÃO 1: HERO (100vh) ────────────────────────── */}
        <section className="lp-section">
          <div style={{ maxWidth: '800px', width: '100%', padding: '0 24px', zIndex: 5, textAlign: 'center' }}>
            <span className="lp-badge">Jornada Espiritual Ativa</span>
            <h1 className="lp-title" style={{ marginTop: '24px', fontSize: '3.5rem', lineHeight: '1.1', color: '#ffffff' }}>
              Desacelere sua mente. <br /><span>Conecte-se com Deus.</span>
            </h1>
            <p className="lp-description" style={{ marginTop: '20px', fontSize: '1.15rem', color: '#e4e4e7', margin: '20px auto 30px' }}>
              11 minutos diários de meditação cristã orientada, respiração controlada contra ansiedade e leitura da Bíblia narrada.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button 
                className="lp-hero-cta"
                onClick={() => {
                  const loginEl = document.getElementById('secao-login');
                  if (loginEl) loginEl.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Começar Agora 🚀
              </button>
              <button 
                className="lp-hero-cta-outline"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: '1.05rem', fontWeight: '700', padding: '16px 36px', borderRadius: '9999px', textDecoration: 'none', border: '1.5px solid rgba(255, 255, 255, 0.25)', cursor: 'pointer', transition: 'all 0.3s' }}
                onClick={() => {
                  const nextEl = document.getElementById('secao-escritura');
                  if (nextEl) nextEl.scrollIntoView({ behavior: 'smooth' });
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
              >
                Descobrir Roots 📖
              </button>
            </div>
          </div>
        </section>

        {/* ── SEÇÃO 2: ESCRITURA (100vh) ────────────────────────── */}
        <section id="secao-escritura" className="lp-section">
          <div className="lp-scroll-text-card" style={{ background: 'rgba(10, 10, 12, 0.55)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)' }}>
            <div className="lp-giant-bg-text" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.04 }}>ESCRITURA</div>
            <span className="lp-badge" style={{ background: 'rgba(255,255,255,0.04)', color: '#fafafa', borderColor: 'rgba(255,255,255,0.15)' }}>Passado 10%</span>
            <h2 className="lp-title" style={{ marginTop: '12px', fontSize: '2.5rem', textAlign: 'left' }}>
              A Biblioteca da <span>Palavra</span>
            </h2>
            <p className="lp-description" style={{ marginTop: '12px', textAlign: 'left', maxWidth: '640px', color: '#e4e4e7' }}>
              O conhecimento acumulado ao longo da história cristã. 10% da nossa mente é moldada pelas lições e escrituras antigas que pavimentam o nosso caminho com verdade.
            </p>
          </div>
        </section>

        {/* ── SEÇÃO 3: PRESENÇA (100vh) ────────────────────────── */}
        <section className="lp-section">
          <div className="lp-scroll-text-card" style={{ background: 'rgba(10, 10, 12, 0.55)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)' }}>
            <div className="lp-giant-bg-text" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.04 }}>PRESENÇA</div>
            <span className="lp-badge">Presente 70%</span>
            <h2 className="lp-title" style={{ marginTop: '12px', fontSize: '2.5rem', textAlign: 'left' }}>
              O Eterno <span>Agora</span>
            </h2>
            <p className="lp-description" style={{ marginTop: '12px', textAlign: 'left', maxWidth: '640px', color: '#e4e4e7' }}>
              70% de nossa vida espiritual ativa acontece no dia de hoje. A quietude silenciosa para orar, meditar e sentir a presença do Criador no único tempo que realmente existe: o Agora.
            </p>
          </div>
        </section>

        {/* ── SEÇÃO 4: RECURSOS & PREÇOS (100vh) ────────────────────────── */}
        <section className="lp-section">
          <div className="lp-scroll-text-card lp-card-wide" style={{ background: 'rgba(10, 10, 12, 0.55)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)' }}>
            <span className="lp-badge">O que oferecemos</span>
            <h2 className="lp-title" style={{ marginTop: '8px', fontSize: '2.1rem', textAlign: 'left' }}>Recursos do <span>1Convite</span></h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginTop: '20px' }} className="lp-grid-mobile-single">
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(0, 240, 143, 0.15)', transition: 'all 0.3s' }} onMouseOver={(e) => { e.currentTarget.style.borderColor = '#00f08f'; e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 240, 143, 0.15)'; }} onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(0, 240, 143, 0.15)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <span style={{ fontSize: '1.6rem' }}>🎧</span>
                <h4 style={{ margin: '8px 0 4px', fontSize: '0.95rem', color: '#00f08f' }}>Meditação Cristã</h4>
                <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: 0 }}>Áudios diários guiados focados em alinhar a mente com Jesus.</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(0, 240, 143, 0.15)', transition: 'all 0.3s' }} onMouseOver={(e) => { e.currentTarget.style.borderColor = '#00f08f'; e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 240, 143, 0.15)'; }} onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(0, 240, 143, 0.15)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <span style={{ fontSize: '1.6rem' }}>🌀</span>
                <h4 style={{ margin: '8px 0 4px', fontSize: '0.95rem', color: '#00f08f' }}>Respiração Ativa</h4>
                <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: 0 }}>Técnicas respiratórias guiadas para aliviar estresse e ansiedade.</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(0, 240, 143, 0.15)', transition: 'all 0.3s' }} onMouseOver={(e) => { e.currentTarget.style.borderColor = '#00f08f'; e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 240, 143, 0.15)'; }} onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(0, 240, 143, 0.15)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <span style={{ fontSize: '1.6rem' }}>📖</span>
                <h4 style={{ margin: '8px 0 4px', fontSize: '0.95rem', color: '#00f08f' }}>Bíblia ACF Narrada</h4>
                <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: 0 }}>Leitura bíblica em áudio e dicionário teológico integrado.</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(0, 240, 143, 0.15)', transition: 'all 0.3s' }} onMouseOver={(e) => { e.currentTarget.style.borderColor = '#00f08f'; e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 240, 143, 0.15)'; }} onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(0, 240, 143, 0.15)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <span style={{ fontSize: '1.6rem' }}>👥</span>
                <h4 style={{ margin: '8px 0 4px', fontSize: '0.95rem', color: '#00f08f' }}>Cultivar Contatos</h4>
                <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: 0 }}>Alertas a cada 48h para cultivar relacionamentos prioritários.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── SEÇÃO 5: ACESSO / LOGIN (100vh) ────────────────────────── */}
        <section id="secao-login" className="lp-section">
          <div className="lp-scroll-text-card" style={{ maxWidth: '480px', background: 'rgba(10, 10, 12, 0.7)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)' }}>
            <span className="lp-badge">Mateus 24:14</span>
            <h2 className="lp-title" style={{ marginTop: '8px', fontSize: '2rem', textAlign: 'center' }}>Acesse o <span>1Convite</span></h2>
            
            <div className="login-card" style={{ margin: '20px auto 0', background: 'rgba(10, 10, 12, 0.85)', border: '1.5px solid rgba(0, 240, 143, 0.25)', backdropFilter: 'none', padding: '24px', borderRadius: '18px', width: '100%', boxSizing: 'border-box' }}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00f08f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '8px' }}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0, fontWeight: '700' }}>Acesso ao Sistema</h3>
                <p style={{ fontSize: '0.85rem', color: '#9ca3af', margin: '4px 0 0 0' }}>Entre com seu e-mail para continuar</p>
              </div>

              <form onSubmit={handleEmailLogin} className="flex-column gap-xs" style={{ textAlign: 'left' }}>
                <div className="input-group">
                  <label style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: '500' }}>Nome Completo</label>
                  <input
                    type="text"
                    className="input-field"
                    value={loginNome}
                    onChange={(e) => setLoginNome(e.target.value)}
                    placeholder="Seu nome"
                    style={{ padding: '12px', fontSize: '0.9rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', width: '100%', boxSizing: 'border-box', marginTop: '4px', outline: 'none' }}
                    required
                  />
                </div>
                <div className="input-group" style={{ marginTop: '12px' }}>
                  <label style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: '500' }}>Endereço de E-mail</label>
                  <input
                    type="email"
                    className="input-field"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="seu@email.com"
                    style={{ padding: '12px', fontSize: '0.9rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', width: '100%', boxSizing: 'border-box', marginTop: '4px', outline: 'none' }}
                    required
                  />
                </div>

                {loginError && (
                  <div style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: '500', margin: '8px 0 0' }}>
                    {loginError}
                  </div>
                )}

                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '20px', padding: '14px', fontSize: '0.9rem', background: '#00f08f', color: '#030303', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                  Entrar na Conta
                </button>
              </form>

              <div className="login-separator" style={{ margin: '20px 0', fontSize: '0.75rem', color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', textTransform: 'uppercase', letterSpacing: '1px' }}>ou</div>

              <button className="btn-secondary" style={{ width: '100%', padding: '12px', fontSize: '0.85rem', background: 'transparent', color: '#fafafa', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={handleGuestLogin}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                Acessar como Visitante
              </button>
            </div>
          </div>
        </section>

        {/* ── FOOTER DA LP ────────────────────────── */}
        <footer style={{ textAlign: 'center', padding: '30px 24px', fontSize: '0.78rem', color: '#71717a', borderTop: '1px solid rgba(255, 255, 255, 0.05)', background: 'rgba(3, 3, 3, 0.45)', zIndex: 10, position: 'relative', marginTop: 'auto' }}>
          <p>© {new Date().getFullYear()} Movimento 1Convite. Todos os direitos reservados.</p>
          <p style={{ marginTop: '4px', opacity: 0.7 }}>Desenvolvido com foco no bem-estar espiritual cristão.</p>
        </footer>
      </div>
    );
}

  return (
    <div className="app-container">
      {showOnboarding && <Onboarding onComplete={() => setShowOnboarding(false)} />}
      <header className="app-header" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        height: '60px',
        boxSizing: 'border-box'
      }}>
        {activeTab === 'dashboard' ? (
          <>
            {/* Esquerda: Perfil/Avatar */}
            <div 
              onClick={() => setActiveTab('conta')}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                overflow: 'hidden',
                cursor: 'pointer',
                border: '2px solid var(--slate-border)',
                background: 'var(--slate-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {profileAvatar ? (
                <img src={profileAvatar} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '1.1rem' }}>👤</span>
              )}
            </div>

            {/* Centro: Título do App */}
            <h1 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
              1Convite
            </h1>

            {/* Direita: Diamante Premium */}
            <div 
              onClick={() => setActiveTab('conta')}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--orange-light)',
                border: '1px solid var(--orange)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '1.1rem'
              }}
              title="Assinatura Premium"
            >
              💎
            </div>
          </>
        ) : (
          <>
            {/* Esquerda: Botão Voltar */}
            <button 
              onClick={() => {
                if (window.speechSynthesis) window.speechSynthesis.cancel();
                setIsNarrating(false);
                setMeditationPlaying(false);
                if (meditationIntervalRef.current) clearInterval(meditationIntervalRef.current);
                if (activeTab === 'sabado' && activeSabadoBlock !== 'menu') {
                  setActiveSabadoBlock('menu');
                  // Parar meditação se estiver tocando
                  setAudioPlaying(false);
                  if (audioRef.current) audioRef.current.pause();
                } else {
                  setActiveTab('dashboard');
                  setBibleAudioPlaying(false);
                  if (bibleAudioRef.current) bibleAudioRef.current.pause();
                }
              }}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '1.4rem',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '50%'
              }}
              className="back-btn"
            >
              ←
            </button>

            {/* Centro: Título ou Dropdown da Bíblia */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              {activeTab === 'biblia' ? (
                <button
                  className="bible-select-btn"
                  onClick={() => setBibleViewMode(bibleViewMode === 'select-book' ? 'reading' : 'select-book')}
                  style={{ border: 'none', background: 'transparent', padding: 0, fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', cursor: 'pointer' }}
                >
                  <span>{bibleSelectedBook.livro_nome} {bibleSelectedChapter} ▼</span>
                </button>
              ) : (
                <h2 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0, color: 'var(--text-primary)', textAlign: 'center' }}>
                  {activeTab === 'sabado' && (
                    activeSabadoBlock === 'menu' ? 'Desafio do Dia' :
                    activeSabadoBlock === 'reflexao' ? 'Reflexão do Dia' :
                    activeSabadoBlock === 'meditacao' ? 'Oração Guiada' :
                    activeSabadoBlock === 'descanso' ? 'O Botão do Descanso' :
                    'Trilha de Conhecimento'
                  )}
                  {activeTab === 'chat' && 'Conselheiro IA'}
                  {activeTab === 'contatos' && 'Conexões & Contatos'}
                  {activeTab === 'conta' && 'Minha Conta'}
                </h2>
              )}
            </div>

            {/* Direita: Controles especiais da Bíblia */}
            {activeTab === 'biblia' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => setBibleShowAudioPlayer(!bibleShowAudioPlayer)}
                  style={{
                    background: bibleShowAudioPlayer ? 'var(--orange-light)' : 'transparent',
                    border: bibleShowAudioPlayer ? '1px solid var(--orange)' : 'none',
                    fontSize: '1.1rem',
                    color: bibleShowAudioPlayer ? 'var(--orange)' : 'var(--text-primary)',
                    cursor: 'pointer',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                  title="Ouvir Áudio do Capítulo"
                >
                  🎵
                </button>
                <button
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: '1.1rem',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="Opções"
                >
                  ⋮
                </button>
              </div>
            ) : (
              <div style={{ width: '36px' }}></div>
            )}
          </>
        )}
      </header>

      {/* ── MODAIS BÍBLIA ─────────────────────── */}
      {commentModalOpen && bibleSelectedVerse && (
        <div className="bible-modal-overlay" style={{ zIndex: 999 }}>
          <div className="bible-modal" style={{
            backgroundColor: darkMode ? '#1c1c1e' : '#ffffff',
            borderRadius: '24px',
            padding: '24px',
            width: '90%',
            maxWidth: '400px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxSizing: 'border-box'
          }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
              📝 {bibleSelectedBook.livro_nome} {bibleSelectedChapter}:{bibleSelectedVerse.versiculo}
            </h3>
            
            <textarea
              className="input-field"
              rows="4"
              placeholder="Digite seu comentário ou anotação pessoal..."
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: '1px solid var(--slate-border)',
                backgroundColor: darkMode ? '#2c2c2e' : '#ffffff',
                color: 'var(--text-primary)',
                resize: 'none',
                boxSizing: 'border-box'
              }}
            />
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                className="btn-secondary"
                style={{ padding: '10px 20px', borderRadius: '12px' }}
                onClick={() => setCommentModalOpen(false)}
              >
                FECHAR
              </button>
              <button
                className="btn-primary"
                style={{ padding: '10px 20px', borderRadius: '12px' }}
                onClick={() => {
                  const key = `${bibleSelectedBook.livro_abrev}-${bibleSelectedChapter}-${bibleSelectedVerse.versiculo}`;
                  const newComments = { ...bibleComments };
                  if (commentText.trim() === '') {
                    delete newComments[key];
                  } else {
                    newComments[key] = commentText;
                  }
                  setBibleComments(newComments);
                  localStorage.setItem('bible-comments', JSON.stringify(newComments));
                  setCommentModalOpen(false);
                }}
              >
                SALVAR
              </button>
            </div>
          </div>
        </div>
      )}

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

        {/* ════════════ TELA DASHBOARD PRINCIPAL ════════════ */}
        {activeTab === 'dashboard' && (
          <div className="page-enter animate-fade-in" style={{ padding: '16px', boxSizing: 'border-box' }}>
            
            {/* Carrossel no topo */}
            <div style={{ marginBottom: '20px' }}>
              <div className="carousel-container">
                <div className="carousel-wrapper" style={{ transform: `translateX(-${carouselIndex * 100}%)` }}>
                  {carouselImages.map((src, idx) => (
                    <img key={idx} src={src} alt={`Banner ${idx + 1}`} className="carousel-image" style={{ height: '140px' }} />
                  ))}
                </div>
                <div className="carousel-dots">
                  {carouselImages.map((_, idx) => (
                    <button key={idx} className={`carousel-dot${idx === carouselIndex ? ' active' : ''}`} onClick={() => setCarouselIndex(idx)} />
                  ))}
                </div>
              </div>
            </div>

            {/* Grid de 2 Colunas */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px',
              paddingBottom: '20px'
            }}>
              {[
                { 
                  id: 'biblia', 
                  label: 'Bíblia Sagrada', 
                  icon: (
                    <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  )
                },
                { 
                  id: 'sabado', 
                  label: 'Desafio do Dia', 
                  icon: (
                    <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                    </svg>
                  )
                },
                { 
                  id: 'chat', 
                  label: 'Conselheiro IA', 
                  icon: (
                    <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  )
                },
                { 
                  id: 'contatos', 
                  label: 'Conexões & Contatos', 
                  icon: (
                    <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )
                },
                { 
                  id: 'conta', 
                  label: 'Aparência & Configs', 
                  icon: (
                    <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )
                },
                { 
                  id: 'compartilhar', 
                  label: 'Compartilhar App', 
                  icon: (
                    <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742l5.013-2.507m0 7.53l-5.013-2.507m11.383-6.526a3.001 3.001 0 11-6 0 3 3 0 016 0zm-11.383 6.526a3.001 3.001 0 11-6 0 3 3 0 016 0zm11.383 6.526a3.001 3.001 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )
                }
              ].map(card => (
                <div
                  key={card.id}
                  onClick={() => {
                    if (card.id === 'compartilhar') {
                      if (navigator.share) {
                        navigator.share({ title: '1Convite', text: 'Venha se conectar intencionalmente!', url: window.location.origin });
                      } else {
                        alert('Link de compartilhamento copiado!');
                      }
                    } else {
                      setActiveTab(card.id);
                      if (card.id === 'biblia') {
                        setBibleViewMode('reading');
                        setBibleSelectedVerse(null);
                      }
                      if (card.id === 'sabado') {
                        setActiveSabadoBlock('menu');
                      }
                    }
                  }}
                  className="dashboard-card"
                >
                  <div className="dashboard-card-icon">
                    {card.icon}
                  </div>
                  <span className="dashboard-card-label">
                    {card.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════════ ABA DESAFIO DO DIA ════════════ */}
        {activeTab === 'sabado' && (
          <div className="page-enter" style={{ padding: '16px', boxSizing: 'border-box' }}>
            
            {/* MENU PRINCIPAL DO DESAFIO */}
            {activeSabadoBlock === 'menu' && (
              <div className="animate-fade-in" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
                paddingBottom: '20px'
              }}>
                {[
                  {
                    id: 'reflexao',
                    title: 'Reflexão do Dia',
                    desc: 'Código verbal e reflexão.',
                    icon: (
                      <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                      </svg>
                    )
                  },
                  {
                    id: 'meditacao',
                    title: 'Oração Guiada',
                    desc: 'Alinhamento e ação de graças.',
                    icon: (
                      <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                    )
                  },
                  {
                    id: 'descanso',
                    title: 'Botão do Descanso',
                    desc: 'Pausa de respiração.',
                    icon: (
                      <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5C7.8 10.5 10.5 7.8 10.5 4.5M19.5 10.5C16.2 10.5 13.5 7.8 13.5 4.5M4.5 13.5C7.8 13.5 10.5 16.2 10.5 19.5M19.5 13.5C16.2 13.5 13.5 16.2 13.5 19.5" />
                      </svg>
                    )
                  },
                  {
                    id: 'trilha',
                    title: 'Trilha Temática',
                    desc: 'Estudo ativo de 30 dias.',
                    icon: (
                      <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    )
                  }
                ].map(block => (
                  <div
                    key={block.id}
                    onClick={() => setActiveSabadoBlock(block.id)}
                    className="dashboard-card"
                    style={{
                      backgroundColor: 'var(--white)',
                      border: '1px solid var(--slate-border)',
                      borderRadius: '20px',
                      padding: '24px 16px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease-in-out',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <div className="dashboard-card-icon" style={{ color: 'var(--orange)' }}>
                      {block.icon}
                    </div>
                    <span className="dashboard-card-label" style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)', textAlign: 'center' }}>
                      {block.title}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textAlign: 'center', opacity: 0.8 }}>
                      {block.desc}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* 1. REFLEXÃO DO DIA */}
            {activeSabadoBlock === 'reflexao' && codigoDia && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {codigoDia.dia_id > 7 && !codigoDia.texto_reflexao.includes('📖 HISTÓRIA CRISTÃ REAL') ? (
                  <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🤖</div>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '1.15rem', color: 'var(--text-primary)', fontWeight: '700' }}>Personalização por Inteligência Artificial</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '20px' }}>
                      Você chegou ao Dia {codigoDia.dia_id}! Para este dia em diante, o aplicativo pode criar uma reflexão exclusiva contendo uma história cristã real histórica personalizada a custo zero de API.
                    </p>

                    {chatGptUser ? (
                      aiGenerating ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '12px' }}>
                          <div className="spinner" style={{ width: '32px', height: '32px', border: '3px solid var(--orange-light)', borderTopColor: 'var(--orange)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Escrevendo devocional com IA e buscando histórias cristãs reais na história...</span>
                        </div>
                      ) : (
                        <button className="btn-primary" style={{ width: '100%', padding: '14px' }} onClick={generateDailyReflectionWithAI}>
                          ✨ Enriquecer Devocional com IA
                        </button>
                      )
                    ) : (
                      <div style={{ background: 'var(--slate-bg)', padding: '16px', borderRadius: '16px', border: '1px dashed var(--slate-border)' }}>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 12px 0' }}>
                          Conecte sua própria conta do ChatGPT gratuita nas Configurações para liberar o gerador inteligente.
                        </p>
                        <button className="btn-secondary" style={{ width: '100%', padding: '10px 16px', fontSize: '0.85rem' }} onClick={() => setActiveTab('conta')}>
                          ⚙️ Conectar ChatGPT nas Configurações
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="page-hero hero-sabado" style={{ borderRadius: '24px' }}>
                      <div className="hero-orb" style={{ width: 160, height: 160, top: -40, right: -40 }} />
                      <div className="hero-content">
                        <div className={`pedagio-badge ${codigoDia.pilar_origem === 'PROPÓSITO_M2414' ? 'badge-proposito' : 'badge-recompensa'}`} style={{ background: 'rgba(255,255,255,0.20)', color: '#fff', border: '1px solid rgba(255,255,255,0.35)', marginBottom: '12px' }}>
                          {codigoDia.pilar_origem === 'PROPÓSITO_M2414' ? 'Mateus 24:14' : 'Apocalipse 3:21'} — Código de Hoje
                        </div>
                        <div className="hero-title" style={{ fontSize: '1.25rem', lineHeight: '1.4' }}>"{codigoDia.codigo_verbal}"</div>
                        <div className="hero-sub">{codigoDia.versiculo_chave}</div>
                      </div>
                    </div>

                    <div className="glass-panel orange-card" style={{ padding: '24px 20px', borderRadius: '20px', position: 'relative' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ margin: 0, color: '#C2550A', fontSize: '1rem' }}>💡 Reflexão & Inspiração</h3>
                        <button
                          onClick={speakReflection}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '12px',
                            border: '1.5px solid var(--orange)',
                            background: isNarrating ? 'var(--orange)' : 'var(--orange-light)',
                            color: isNarrating ? '#ffffff' : 'var(--orange-dark)',
                            fontSize: '0.82rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.2s',
                            boxShadow: 'var(--shadow-sm)'
                          }}
                        >
                          {isNarrating ? '⏹️ Parar' : '🔊 Ouvir'}
                        </button>
                      </div>
                      <p style={{ lineHeight: '1.8', fontSize: '1rem', color: 'var(--text-primary)', margin: 0, whiteSpace: 'pre-wrap', textAlign: 'left' }}>
                        {codigoDia.texto_reflexao}
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* 2. MEDITAÇÃO GUIADA */}
            {activeSabadoBlock === 'meditacao' && codigoDia && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <audio ref={ambientAudioRef} />
                
                <div style={{
                  background: 'linear-gradient(135deg, #0f0a1c 0%, #05030a 100%)',
                  padding: '24px',
                  borderRadius: '24px',
                  border: '1px solid rgba(139, 92, 246, 0.15)',
                  boxShadow: 'var(--shadow-lg)',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Fundo decorativo animado em Gradiente Líquido */}
                  <div style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 60%)',
                    animation: meditationPlaying ? 'pulse 8s infinite ease-in-out' : 'none',
                    pointerEvents: 'none',
                    zIndex: 0
                  }} />

                  {/* Ilustração Personalizada Premium do Calm/Headspace */}
                  <div style={{
                    width: '100%',
                    maxWidth: '220px',
                    aspectRatio: '1',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    marginBottom: '20px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    position: 'relative',
                    zIndex: 1
                  }}>
                    <video 
                      ref={meditationVideoRef}
                      src="/Imagens/oraçãoguiada.mp4" 
                      loop 
                      muted 
                      playsInline
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: meditationPlaying ? 'none' : 'grayscale(30%) contrast(90%)',
                        transition: 'filter 0.5s ease'
                      }}
                    />
                  </div>

                  <h3 style={{ margin: '0 0 4px 0', fontSize: '1.25rem', fontWeight: '800', color: '#f8fafc', zIndex: 1 }}>
                    Oração do Dia {codigoDia.dia_id}
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: '#a78bfa', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px', zIndex: 1 }}>
                    {codigoDia.pilar_origem === 'PROPÓSITO_M2414' ? 'Pilar Mateus 24:14' : 'Pilar Apocalipse 3:21'}
                  </span>

                  {/* Controle de Progresso */}
                  <div style={{ width: '100%', marginBottom: '20px', zIndex: 1 }}>
                    <div 
                      style={{ 
                        height: '6px', 
                        width: '100%', 
                        background: 'rgba(255, 255, 255, 0.1)', 
                        borderRadius: '3px',
                        position: 'relative'
                      }}
                    >
                      <div 
                        style={{ 
                          height: '100%', 
                          width: `${(meditationCurrentTime / (meditationDuration || 1)) * 100}%`, 
                          background: 'linear-gradient(90deg, #c084fc 0%, #8b5cf6 100%)', 
                          borderRadius: '3px',
                          transition: 'width 0.25s linear'
                        }} 
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#9ca3af', marginTop: '6px' }}>
                      <span>{formatTime(meditationCurrentTime)}</span>
                      <span>{formatTime(meditationDuration)}</span>
                    </div>
                  </div>

                  {/* Painel de Controles Flexíveis */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px', zIndex: 1 }}>
                    {/* Botão de Transcrição */}
                    <button 
                      onClick={() => setShowMeditationLyrics(!showMeditationLyrics)}
                      style={{
                        background: showMeditationLyrics ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        padding: '8px 14px',
                        borderRadius: '20px',
                        color: showMeditationLyrics ? '#c084fc' : '#e2e8f0',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      📖 Roteiro
                    </button>

                    {/* Botão Play/Pause Principal */}
                    <button 
                      onClick={toggleMeditationTTS} 
                      style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: '50%',
                        background: '#8b5cf6',
                        border: 'none',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
                        transition: 'transform 0.2s',
                        transform: 'scale(1)',
                      }}
                      onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                      onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      {meditationPlaying ? (
                        <svg width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z" />
                        </svg>
                      ) : (
                        <svg width="22" height="22" fill="currentColor" viewBox="0 0 16 16" style={{ marginLeft: '3px' }}>
                          <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
                        </svg>
                      )}
                    </button>

                    {/* Velocidade da Narração */}
                    <button 
                      onClick={() => {
                        const rates = [0.75, 0.82, 0.95, 1.05];
                        const nextIndex = (rates.indexOf(narrationRate) + 1) % rates.length;
                        setNarrationRate(rates[nextIndex]);
                        if (meditationPlaying) {
                          // Reinicia com a nova velocidade
                          window.speechSynthesis.cancel();
                          setMeditationPlaying(false);
                          setTimeout(() => toggleMeditationTTS(), 100);
                        }
                      }}
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        padding: '8px 12px',
                        borderRadius: '20px',
                        color: '#cbd5e1',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      ⏱️ {narrationRate === 0.75 ? 'Lento' : narrationRate === 0.82 ? 'Relax' : narrationRate === 0.95 ? 'Médio' : 'Rápido'}
                    </button>
                  </div>

                  {/* Som Ambiente de Fundo (Padrão Calm) */}
                  <div style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    padding: '16px',
                    borderRadius: '16px',
                    boxSizing: 'border-box',
                    textAlign: 'left',
                    zIndex: 1,
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '0.82rem', color: '#9ca3af', fontWeight: 'bold' }}>🍃 Paisagem Sonora</span>
                      <span style={{ fontSize: '0.78rem', color: '#8b5cf6', fontWeight: 'bold' }}>
                        {activeAmbient === 'none' ? 'Silêncio' : activeAmbient === 'chuva' ? 'Chuva' : activeAmbient === 'mar' ? 'Ondas' : 'Piano'}
                      </span>
                    </div>

                    {/* Chips do Seletor */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                      {ambientTracks.map(track => (
                        <button
                          key={track.id}
                          onClick={() => setActiveAmbient(track.id)}
                          style={{
                            background: activeAmbient === track.id ? '#8b5cf6' : 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            padding: '6px 12px',
                            color: activeAmbient === track.id ? '#ffffff' : '#9ca3af',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          {track.label}
                        </button>
                      ))}
                    </div>

                    {/* Volume de Fundo */}
                    {activeAmbient !== 'none' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>🔊 Vol. Fundo:</span>
                        <input 
                          type="range" 
                          min="0.05" 
                          max="0.4" 
                          step="0.05"
                          value={ambientVolume}
                          onChange={(e) => setAmbientVolume(parseFloat(e.target.value))}
                          style={{ flex: 1, accentColor: '#8b5cf6', cursor: 'pointer' }}
                        />
                      </div>
                    )}

                    {/* Seletor de Voz do Narrador (pt-BR) */}
                    {availableVoices.length > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
                        <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>🗣️ Voz Narrador:</span>
                        <select
                          value={selectedVoiceName}
                          onChange={(e) => {
                            setSelectedVoiceName(e.target.value);
                            localStorage.setItem('preferred_voice', e.target.value);
                          }}
                          style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '10px',
                            padding: '4px 8px',
                            color: '#ffffff',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            flex: 1,
                            outline: 'none'
                          }}
                        >
                          {availableVoices.map(v => (
                            <option key={v.name} value={v.name} style={{ background: '#0f0a1c', color: '#fff' }}>
                              {v.name.replace('Microsoft', '').replace('Google', '').replace('Desktop', '').trim()}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Mensagem de Conclusão da Oração de Ação de Graças */}
                  {meditationCompleted && (
                    <div 
                      className="animate-fade-in" 
                      style={{
                        marginTop: '4px',
                        marginBottom: '16px',
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(0, 240, 143, 0.15))',
                        border: '1px solid rgba(0, 240, 143, 0.3)',
                        padding: '18px',
                        borderRadius: '16px',
                        color: '#f8fafc',
                        zIndex: 1,
                        boxShadow: '0 4px 15px rgba(0, 240, 143, 0.1)',
                        textAlign: 'center',
                        width: '100%',
                        boxSizing: 'border-box'
                      }}
                    >
                      <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🍞🕊️</div>
                      <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '700', lineHeight: '1.5', color: '#00f08f' }}>
                        Sua oração de ação de graças foi feita.
                      </p>
                      <p style={{ margin: '6px 0 0 0', fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                        Agora, qual é o seu pão a ser compartilhado hoje? Quem você vai abençoar com o seu "1Convite" agora?
                      </p>
                    </div>
                  )}

                  {/* Transcrição da Meditação */}
                  {showMeditationLyrics && (
                    <div className="animate-fade-in" style={{
                      padding: '16px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '16px',
                      width: '100%',
                      textAlign: 'left',
                      boxSizing: 'border-box',
                      zIndex: 1
                    }}>
                      <p style={{
                        fontSize: '0.9rem',
                        color: '#cbd5e1',
                        lineHeight: '1.75',
                        margin: 0,
                        whiteSpace: 'pre-wrap',
                        maxHeight: '150px',
                        overflowY: 'auto'
                      }}>
                        {codigoDia.texto_meditacao}
                      </p>
                    </div>
                  )}

                  {/* Fallback de IA no dia > 7 */}
                  {codigoDia.dia_id > 7 && !codigoDia.texto_reflexao.includes('📖 HISTÓRIA CRISTÃ REAL') && (
                    <div style={{
                      marginTop: '16px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px dashed rgba(239, 68, 68, 0.25)',
                      padding: '12px',
                      borderRadius: '14px',
                      fontSize: '0.8rem',
                      color: '#fca5a5',
                      lineHeight: '1.4',
                      zIndex: 1
                    }}>
                      ⚠️ Esta oração está usando um roteiro genérico. Vá na aba "Reflexão do Dia" e clique em "Enriquecer com IA" para gerar um roteiro de oração completo e personalizado com história real.
                    </div>
                  )}

                </div>
              </div>
            )}
            {/* 3. O BOTÃO DO DESCANSO */}
            {activeSabadoBlock === 'descanso' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="glass-panel" style={{ padding: '28px 24px', borderRadius: '24px', textAlign: 'center', background: 'linear-gradient(135deg, var(--white) 0%, var(--slate-bg) 100%)' }}>
                  
                  {!isBreathing ? (
                    <div className="animate-fade-in" style={{ marginBottom: '24px' }}>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: '0 0 20px 0' }}>
                        Desacelere os batimentos cardíacos, relaxe a mente e traga seu foco de volta para o Aqui e Agora.
                      </p>
                      
                      {/* Seleção de Técnica */}
                      <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                        <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>
                          🧘 Técnica de Respiração
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                          {[
                            { id: 'simple', label: 'Micro-Pausa', desc: '4-4-4' },
                            { id: 'box', label: 'Box Breath', desc: '4-4-4-4' },
                            { id: 'relax', label: 'Relaxar', desc: '4-7-8' }
                          ].map(t => (
                            <button
                              key={t.id}
                              onClick={() => setBreathTechnique(t.id)}
                              style={{
                                padding: '10px 6px',
                                borderRadius: '12px',
                                border: '1.5px solid',
                                borderColor: breathTechnique === t.id ? 'var(--orange)' : 'var(--slate-border)',
                                background: breathTechnique === t.id ? 'var(--orange-light)' : 'var(--white)',
                                color: breathTechnique === t.id ? 'var(--orange-dark)' : 'var(--text-primary)',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                fontWeight: '700',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                transition: 'all 0.2s'
                              }}
                            >
                              <span>{t.label}</span>
                              <span style={{ fontSize: '0.65rem', fontWeight: '600', opacity: 0.7, marginTop: '2px' }}>{t.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Seleção de Ciclos */}
                      <div style={{ textAlign: 'left', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            🔄 Duração do Exercício
                          </label>
                          <span style={{ fontSize: '0.82rem', color: 'var(--orange-dark)', fontWeight: '700' }}>
                            {breathRounds} Ciclos
                          </span>
                        </div>
                        <input
                          type="range"
                          min="3"
                          max="15"
                          step="1"
                          value={breathRounds}
                          onChange={(e) => setBreathRounds(parseInt(e.target.value, 10))}
                          style={{ width: '100%', accentColor: 'var(--orange)', cursor: 'pointer' }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="animate-fade-in" style={{ marginBottom: '20px' }}>
                      <span className="section-chip" style={{ background: 'var(--orange-light)', color: 'var(--orange-dark)', fontWeight: 'bold', padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem' }}>
                        Ciclo {currentRound} de {breathRounds}
                      </span>
                    </div>
                  )}

                  {/* Círculo Interativo com Animação */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '30px 0' }}>
                    <div
                      className={`breath-circle ${breathClass}`}
                      onClick={!isBreathing ? iniciarRespiracao : undefined}
                      style={{
                        border: '2px solid',
                        borderColor: isBreathing ? (breathClass === 'inhaling' ? '#2563EB' : breathClass === 'holding' ? 'var(--orange)' : breathClass === 'holding-empty' ? '#8b5cf6' : 'rgba(0, 240, 143, 0.4)') : 'var(--orange-light)',
                        boxShadow: isBreathing ? '0 10px 30px rgba(0,0,0,0.08)' : 'var(--shadow-md)',
                        background: !isBreathing ? 'var(--white)' : undefined,
                        cursor: isBreathing ? 'default' : 'pointer',
                        width: '160px',
                        height: '160px',
                        borderRadius: '50%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        transition: 'all 3s ease-in-out',
                        position: 'relative'
                      }}
                    >
                      {/* Pulse Ring Decorativo */}
                      {isBreathing && (
                        <div style={{
                          position: 'absolute',
                          top: 0, left: 0, right: 0, bottom: 0,
                          borderRadius: '50%',
                          border: '2px solid',
                          borderColor: breathClass === 'inhaling' ? 'rgba(37, 99, 235, 0.4)' : 'rgba(249, 115, 22, 0.4)',
                          animation: 'pulse 2s infinite ease-in-out',
                          pointerEvents: 'none'
                        }} />
                      )}

                      <span style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {breathState}
                      </span>
                      {isBreathing && (
                        <span style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--orange-dark)', marginTop: '4px' }}>
                          {breathTimer}s
                        </span>
                      )}
                    </div>

                    {isBreathing && (
                      <button
                        onClick={pararRespiracao}
                        className="btn-secondary"
                        style={{
                          marginTop: '24px',
                          padding: '10px 24px',
                          borderRadius: '20px',
                          fontSize: '0.85rem',
                          fontWeight: '700',
                          border: '1.5px solid var(--slate-border)',
                          cursor: 'pointer',
                          background: 'var(--white)',
                          color: 'var(--text-secondary)',
                          boxShadow: 'var(--shadow-sm)'
                        }}
                      >
                        ⏹️ Parar Exercício
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 4. TRILHA DE CONHECIMENTO */}
            {activeSabadoBlock === 'trilha' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Trilha Ativa */}
                {trilhaAtiva ? (
                  <div className="trilha-active-panel" style={{ margin: 0, padding: 0, borderRadius: '20px', overflow: 'hidden' }}>
                    {/* Imagem de Topo Temática da Trilha */}
                    <div style={{
                      width: '100%',
                      height: '140px',
                      position: 'relative'
                    }}>
                      <img 
                        src={
                          trilhaAtiva.tema === 'Ansiedade' ? 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80' :
                          trilhaAtiva.tema === 'Família' ? 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=600&q=80' :
                          trilhaAtiva.tema === 'Finanças' ? 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80' :
                          'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80'
                        } 
                        alt={trilhaAtiva.tema}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{
                        position: 'absolute',
                        bottom: 0, left: 0, right: 0,
                        background: 'linear-gradient(to top, rgba(15, 10, 28, 0.9), transparent)',
                        padding: '16px 20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end'
                      }}>
                        <div>
                          <span style={{ fontSize: '0.7rem', color: '#a78bfa', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Jornada Ativa</span>
                          <h4 style={{ margin: '2px 0 0 0', fontSize: '1.2rem', fontWeight: '800', color: '#ffffff' }}>Trilha de {trilhaAtiva.tema}</h4>
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: '800', background: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: '12px', color: '#fff', backdropFilter: 'blur(4px)' }}>
                          Dia {trilhaAtiva.dia_progresso}/30
                        </span>
                      </div>
                    </div>

                    <div style={{ padding: '20px' }}>
                      {trilhaAtiva.conteudo && (
                        <>
                          <h3 style={{ fontSize: '1.15rem', marginBottom: '8px', fontWeight: 'bold' }}>{trilhaAtiva.conteudo.titulo}</h3>
                          <p style={{ fontStyle: 'italic', marginBottom: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                            "{trilhaAtiva.conteudo.versiculo}"
                          </p>
                          <p style={{ marginBottom: '16px', fontSize: '0.95rem', lineHeight: '1.6' }}>
                            {trilhaAtiva.conteudo.reflexao}
                          </p>
                          <div className="glass-panel orange-card" style={{ padding: '14px', marginBottom: '18px', borderRadius: '14px' }}>
                            <strong style={{ fontSize: '0.85rem', color: 'var(--orange-dark)', display: 'block', marginBottom: '4px' }}>🎯 AÇÃO PRÁTICA DO DIA:</strong>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', margin: 0 }}>{trilhaAtiva.conteudo.acao_pratica}</p>
                          </div>
                        </>
                      )}
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="btn-primary" style={{ padding: '12px', borderRadius: '12px', flex: 2 }} onClick={completarDiaTrilha}>
                          ✓ Concluir Ação de Hoje
                        </button>
                        <button className="btn-secondary" style={{ padding: '12px', borderRadius: '12px', flex: 1, background: '#FEE2E2', color: '#EF4444', border: '1px solid #FCA5A5' }} onClick={cancelarTrilha}>
                          Abandonar
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  listaTrilhas.length > 0 && (
                    <div className="glass-panel" style={{ padding: '20px', borderRadius: '20px' }}>
                      <h3 style={{ marginBottom: '6px', fontSize: '1.15rem', fontWeight: '800' }}>🌱 Trilhas de Crescimento (30 Dias)</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.4' }}>
                        Escolha uma trilha e receba uma porção diária de sabedoria teológica com ações práticas por 30 dias.
                      </p>
                      
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(2, 1fr)', 
                        gap: '16px' 
                      }} className="lp-grid-mobile-single">
                        {listaTrilhas.map(tema => {
                          let detail = { desc: '', icon: null, color: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)' };
                          
                          if (tema === 'Ansiedade') {
                            detail = { 
                              desc: 'Controle o estresse em uma jornada de paz.', 
                              icon: (
                                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                              ), 
                              color: 'rgba(14, 165, 233, 0.1)', 
                              border: 'rgba(14, 165, 233, 0.2)' 
                            };
                          } else if (tema === 'Família') {
                            detail = { 
                              desc: 'Harmonia, perdão e laços fortes no seu lar.', 
                              icon: (
                                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                              ), 
                              color: 'rgba(244, 63, 94, 0.1)', 
                              border: 'rgba(244, 63, 94, 0.2)' 
                            };
                          } else if (tema === 'Finanças') {
                            detail = { 
                              desc: 'Princípios bíblicos de mordomia.', 
                              icon: (
                                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              ), 
                              color: 'rgba(16, 185, 129, 0.1)', 
                              border: 'rgba(16, 185, 129, 0.2)' 
                            };
                          } else if (tema === 'Propósito') {
                            detail = { 
                              desc: 'Descubra e ative seus dons para governar.', 
                              icon: (
                                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                              ), 
                              color: 'rgba(139, 92, 246, 0.1)', 
                              border: 'rgba(139, 92, 246, 0.2)' 
                            };
                          }
                          
                          return (
                            <div 
                              key={tema} 
                              className="dashboard-card animate-fade-in" 
                              onClick={() => iniciarTrilha(tema)} 
                              style={{ 
                                padding: '20px 16px', 
                                borderRadius: '18px', 
                                display: 'flex', 
                                flexDirection: 'column',
                                gap: '12px',
                                alignItems: 'flex-start', 
                                cursor: 'pointer', 
                                border: `1.5px solid ${detail.border}`,
                                backgroundColor: 'var(--white)',
                                transition: 'all 0.2s ease',
                                textAlign: 'left',
                                boxSizing: 'border-box'
                              }}
                            >
                              <div style={{ 
                                color: tema === 'Ansiedade' ? '#0ea5e9' : tema === 'Família' ? '#f43f5e' : tema === 'Finanças' ? '#10b981' : '#8b5cf6',
                                background: detail.color,
                                padding: '10px',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                {detail.icon}
                              </div>
                              <div style={{ flex: 1 }}>
                                <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)', display: 'block' }}>
                                  Trilha de {tema}
                                </strong>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.4' }}>
                                  {detail.desc}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )
                )}

              </div>
            )}

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
            {bibleShowAudioPlayer && bibleAudioUrl && (
              <div style={{ padding: '0 20px 10px 20px', marginTop: '-18px', position: 'relative', zIndex: 5 }}>
                <div className="player-container" style={{ padding: '12px 16px', flexDirection: 'row', gap: '12px', background: darkMode ? 'rgba(24, 24, 27, 0.85)' : 'rgba(255, 255, 255, 0.7)', border: darkMode ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: darkMode ? '#a1a1aa' : '#78716C' }}>
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
                    {bibleVerses.map(v => {
                      const key = `${bibleSelectedBook.livro_abrev}-${bibleSelectedChapter}-${v.versiculo}`;
                      const highlightColor = bibleHighlights[key];
                      const comment = bibleComments[key];
                      return (
                        <div
                          key={v.id}
                          className={`bible-verse-row${bibleSelectedVerse?.id === v.id ? ' selected' : ''}`}
                          onClick={() => setBibleSelectedVerse(bibleSelectedVerse?.id === v.id ? null : v)}
                          style={{
                            backgroundColor: highlightColor || undefined,
                            borderRadius: highlightColor ? '8px' : '0',
                            padding: highlightColor ? '8px 10px' : '6px 0',
                            margin: highlightColor ? '4px 0' : '0',
                            transition: 'all 0.2s',
                            display: 'flex',
                            gap: '10px',
                            alignItems: 'flex-start'
                          }}
                        >
                          <span className="bible-verse-num" style={{ flexShrink: 0, fontWeight: '700', fontSize: '0.85rem', color: 'var(--orange)' }}>
                            {v.versiculo}
                          </span>
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ lineHeight: '1.75', fontSize: '1.02rem', color: 'var(--text-primary)' }}>
                              {formatVerseText(v.texto)}
                            </span>
                            {comment && (
                              <div style={{
                                padding: '6px 10px',
                                background: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                                borderRadius: '8px',
                                borderLeft: '3px solid var(--orange)',
                                fontSize: '0.82rem',
                                color: 'var(--text-secondary)',
                                marginTop: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}>
                                <span>💬</span>
                                <span>{comment}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
 
                {!bibleSelectedVerse && (
                  <div style={{ padding: '28px 20px', marginTop: '20px', borderTop: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)' }}>
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
              <div 
                className="bible-action-menu-panel animate-slide-up"
                style={{
                  position: 'fixed',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: darkMode ? '#1c1c1e' : '#ffffff',
                  borderTop: '1px solid var(--slate-border)',
                  boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
                  padding: '16px 20px',
                  zIndex: 100,
                  borderTopLeftRadius: '24px',
                  borderTopRightRadius: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  boxSizing: 'border-box'
                }}
              >
                {/* Fileira 1: Botões de Ação */}
                <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                  <button 
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: 'Versículo Bíblico',
                          text: `"${bibleSelectedVerse.texto}" - ${bibleSelectedBook.livro_nome} ${bibleSelectedChapter}:${bibleSelectedVerse.versiculo}`
                        });
                      } else {
                        copyToClipboard(`"${bibleSelectedVerse.texto}" - ${bibleSelectedBook.livro_nome} ${bibleSelectedChapter}:${bibleSelectedVerse.versiculo}`);
                      }
                    }}
                    style={{ flex: 1, padding: '10px 4px', fontSize: '0.82rem', fontWeight: 'bold', borderRadius: '12px', border: '1px solid var(--slate-border)', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer' }}
                  >
                    Compartilhar
                  </button>
                  <button 
                    onClick={() => {
                      alert('Link de compartilhamento copiado!');
                      copyToClipboard(`"${bibleSelectedVerse.texto}" - ${bibleSelectedBook.livro_nome} ${bibleSelectedChapter}:${bibleSelectedVerse.versiculo}`);
                    }}
                    style={{ flex: 1, padding: '10px 4px', fontSize: '0.82rem', fontWeight: 'bold', borderRadius: '12px', border: '1px solid var(--slate-border)', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer' }}
                  >
                    Imagem
                  </button>
                  <button 
                    onClick={() => {
                      setCommentText(bibleComments[`${bibleSelectedBook.livro_abrev}-${bibleSelectedChapter}-${bibleSelectedVerse.versiculo}`] || '');
                      setCommentModalOpen(true);
                    }}
                    style={{ flex: 1, padding: '10px 4px', fontSize: '0.82rem', fontWeight: 'bold', borderRadius: '12px', border: '1px solid var(--slate-border)', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer' }}
                  >
                    Comentário
                  </button>
                  <button 
                    onClick={() => {
                      copyToClipboard(`"${bibleSelectedVerse.texto}" - ${bibleSelectedBook.livro_nome} ${bibleSelectedChapter}:${bibleSelectedVerse.versiculo}`);
                    }}
                    style={{ flex: 1, padding: '10px 4px', fontSize: '0.82rem', fontWeight: 'bold', borderRadius: '12px', border: '1px solid var(--slate-border)', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer' }}
                  >
                    Copiar
                  </button>
                </div>

                {/* Fileira 2: Círculos Coloridos de Destaque */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', padding: '0 8px' }}>
                  {[
                    { id: 'clear', color: 'transparent', dotColor: '#2c2c2e', label: '✕', isClear: true },
                    { id: 'blue', color: 'rgba(59, 130, 246, 0.22)', dotColor: '#3b82f6' },
                    { id: 'purple', color: 'rgba(139, 92, 246, 0.22)', dotColor: '#8b5cf6' },
                    { id: 'gray', color: 'rgba(107, 114, 128, 0.22)', dotColor: '#6b7280' },
                    { id: 'teal', color: 'rgba(20, 184, 166, 0.22)', dotColor: '#14b8a6' },
                    { id: 'green', color: 'rgba(34, 197, 94, 0.22)', dotColor: '#22c55e' },
                    { id: 'orange', color: 'rgba(249, 115, 22, 0.22)', dotColor: '#f97316' }
                  ].map(colorOpt => {
                    const key = `${bibleSelectedBook.livro_abrev}-${bibleSelectedChapter}-${bibleSelectedVerse.versiculo}`;
                    const currentHighlight = bibleHighlights[key];
                    const isSelected = colorOpt.isClear ? !currentHighlight : currentHighlight === colorOpt.color;

                    return (
                      <button
                        key={colorOpt.id}
                        onClick={() => {
                          const newHighlights = { ...bibleHighlights };
                          if (colorOpt.isClear) {
                            delete newHighlights[key];
                          } else {
                            newHighlights[key] = colorOpt.color;
                          }
                          setBibleHighlights(newHighlights);
                          localStorage.setItem('bible-highlights', JSON.stringify(newHighlights));
                        }}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          backgroundColor: colorOpt.isClear ? (darkMode ? '#2c2c2e' : '#f4f4f5') : colorOpt.dotColor,
                          border: isSelected ? '3px solid var(--orange)' : '2px solid transparent',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: colorOpt.isClear ? '#ef4444' : '#ffffff',
                          fontWeight: 'bold',
                          fontSize: '1rem',
                          padding: 0,
                          boxSizing: 'border-box'
                        }}
                      >
                        {colorOpt.isClear && '✕'}
                      </button>
                    );
                  })}
                </div>

                {/* Salvar */}
                <button
                  className="btn-primary"
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', fontSize: '0.95rem' }}
                  onClick={() => setBibleSelectedVerse(null)}
                >
                  Salvar
                </button>
              </div>
            )}

            {/* Botão Flutuante Seletor de Livros (≡) */}
            <button
              onClick={() => setBibleViewMode(bibleViewMode === 'select-book' ? 'reading' : 'select-book')}
              style={{
                position: 'fixed',
                bottom: bibleSelectedVerse ? '180px' : '24px',
                right: '24px',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                border: 'none',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                zIndex: 90,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              title="Lista de Livros/Capítulos"
            >
              ☰
            </button>
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

        {/* ════════════ ABA CHAT IA ════════════ */}
        {activeTab === 'chat' && (
          <div className="page-enter flex-column" style={{ height: 'calc(100vh - 76px)', justifyContent: 'space-between' }}>
            {lwcState !== 'authenticated' ? (
              <div className="flex-column gap-md align-center justify-center text-center" style={{ flex: 1, padding: '2rem' }}>
                <div style={{ fontSize: '4.5rem', filter: 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.2))' }}>🤖</div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>Conselheiro Inteligente</h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', maxWidth: '300px' }}>
                  Conecte sua própria conta do ChatGPT nas configurações para ativar o conselheiro personalizado do app a custo zero de processamento!
                </p>
                <button className="btn-primary" style={{ padding: '12px 24px' }} onClick={() => setActiveTab('conta')}>
                  ⚙️ Conectar ChatGPT Agora
                </button>
              </div>
            ) : (
              <div className="chat-container" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <div className="chat-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div>
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.95rem' }}>Conselheiro IA</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ChatGPT ({chatGptUser?.plan?.toUpperCase() || 'SESSÃO'})</span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {/* Controle de Fonte */}
                    <div style={{ display: 'flex', border: '1px solid var(--slate-border)', borderRadius: '100px', overflow: 'hidden', background: 'var(--bg-app)' }}>
                      {[
                        { id: 'sm', label: 'A-' },
                        { id: 'md', label: 'A' },
                        { id: 'lg', label: 'A+' }
                      ].map(sz => (
                        <button
                          key={sz.id}
                          onClick={() => setChatFontSize(sz.id)}
                          style={{
                            padding: '2px 8px',
                            fontSize: '0.72rem',
                            fontWeight: 'bold',
                            border: 'none',
                            cursor: 'pointer',
                            background: chatFontSize === sz.id ? 'var(--orange)' : 'transparent',
                            color: chatFontSize === sz.id ? '#fff' : 'var(--text-secondary)',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {sz.label}
                        </button>
                      ))}
                    </div>

                    <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => {
                      if (confirm('Deseja limpar o histórico do chat?')) {
                        setChatMessages([{ role: 'assistant', content: 'Olá! Sou o Conselheiro Inteligente do 1Convite. Como posso te apoiar hoje em suas reflexões, relacionamentos ou espiritualidade?' }]);
                      }
                    }}>
                      🧹 Limpar
                    </button>
                  </div>
                </div>

                {/* Mensagens */}
                <div className="chat-messages">
                  {chatMessages.map((msg, index) => (
                    <div 
                      key={index} 
                      className={`chat-bubble ${msg.role}`}
                      style={{
                        fontSize: chatFontSize === 'sm' ? '0.825rem' : chatFontSize === 'lg' ? '1.05rem' : '0.925rem'
                      }}
                    >
                      {msg.content}
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="chat-bubble assistant">
                      <div className="typing-indicator">
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Área de Entrada */}
                <div className="chat-input-area">
                  <div className="chat-suggestions">
                    {[
                      'Como cultivar paz hoje?',
                      'Ideia de convite para cônjuge',
                      'Reflexão para ansiedade',
                      'Resolução de conflito'
                    ].map(sug => (
                      <button key={sug} className="chat-suggest-chip" onClick={(e) => handleSendChatMessage(e, sug)}>
                        {sug}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleSendChatMessage} className="chat-input-row">
                    <input
                      type="text"
                      className="chat-input-field"
                      placeholder="Fale com o Conselheiro..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      disabled={chatLoading}
                    />
                    <button type="submit" className="chat-send-btn" disabled={chatLoading || !chatInput.trim()}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg>
                    </button>
                  </form>
                </div>
              </div>
            )}
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
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
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
              {/* Tema & Aparência */}
              <div className="glass-panel" style={{ marginBottom: '16px', textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
                  <h3 style={{ fontSize: '1.05rem', margin: 0, textAlign: 'left' }}>Tema & Aparência</h3>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '14px', textAlign: 'left', lineHeight: '1.4' }}>
                  Escolha a cor de destaque do seu aplicativo para personalizar a sua experiência:
                </p>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', alignItems: 'center', margin: '10px 0' }}>
                  {[
                    { id: 'theme-orange', color: '#f97316', name: 'Laranja' },
                    { id: 'theme-blue', color: '#3b82f6', name: 'Azul' },
                    { id: 'theme-green', color: '#10B981', name: 'Verde' },
                    { id: 'theme-purple', color: '#8b5cf6', name: 'Roxo' },
                    { id: 'theme-sepia', color: '#b58900', name: 'Sépia' }
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      title={t.name}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: t.color,
                        border: theme === t.id ? '3px solid var(--text-primary)' : '2px solid rgba(0,0,0,0.1)',
                        cursor: 'pointer',
                        transform: theme === t.id ? 'scale(1.15)' : 'scale(1)',
                        transition: 'all 0.2s ease',
                        boxShadow: theme === t.id ? '0 4px 10px rgba(0,0,0,0.15)' : 'none'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Logout da Conta */}
              <div className="glass-panel" style={{ marginBottom: '16px', textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                  <h3 style={{ fontSize: '1.05rem', margin: 0, textAlign: 'left' }}>Sessão Ativa</h3>
                </div>
                <div className="flex-column gap-sm">
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '8px', textAlign: 'left' }}>
                    Conectado como <strong>{profileEmail || 'Visitante'}</strong>
                  </p>
                  <button className="btn-secondary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={handleLogout}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    Sair da Conta (Logout)
                  </button>
                </div>
              </div>

              {/* Integração com IA */}
              <div className="glass-panel" style={{ marginBottom: '16px', textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                  <h3 style={{ fontSize: '1.05rem', margin: 0, textAlign: 'left' }}>Conexão com Conselheiro IA</h3>
                </div>
                
                {lwcState === 'authenticated' ? (
                  <div className="flex-column gap-sm">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--orange)', fontWeight: '600', fontSize: '0.95rem', margin: '4px 0' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"></circle></svg>
                      IA Ativa ({chatGptUser?.plan ? chatGptUser.plan.toUpperCase() : 'FREE/PLUS'})
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '8px', textAlign: 'left' }}>
                      Conta conectada: <strong>{chatGptUser?.email || 'Usuário ChatGPT'}</strong>. Você já pode conversar com o Conselheiro.
                    </p>
                    <button className="btn-secondary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={handleDisconnectChatGPT}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                      Desconectar Conta
                    </button>
                  </div>
                ) : lwcState === 'pending' && lwcDeviceCode ? (
                  <div className="flex-column gap-sm">
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', textAlign: 'left' }}>
                      Abra o link abaixo e insira o seguinte código para autorizar o acesso:
                    </p>
                    <div className="lwc-code-box">{lwcDeviceCode.userCode}</div>
                    <a 
                      href={lwcDeviceCode.verificationUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-primary" 
                      style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '10px' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                      Página de Verificação
                    </a>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', textAlign: 'center' }}>
                      Aguardando autorização... (Expira em 5 minutos)
                    </p>
                  </div>
                ) : (
                  <div className="flex-column gap-sm">
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '10px', lineHeight: '1.5', textAlign: 'left' }}>
                      Conecte sua conta do ChatGPT para liberar o <strong>Conselheiro IA</strong> e <strong>Desafios Inteligentes</strong> customizados, sem custo extra para você ou para a plataforma.
                    </p>
                    <button className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={handleConnectChatGPT}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                      Conectar Conta IA
                    </button>
                  </div>
                )}
              </div>

              {/* Alternância de Tema */}
              <div className="glass-panel" style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="M4.93 4.93l1.41 1.41"></path><path d="M17.66 17.66l1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="M6.34 17.66l-1.41 1.41"></path><path d="M19.07 4.93l-1.41 1.41"></path></svg>
                  <h3 style={{ fontSize: '1.05rem', margin: 0, textAlign: 'left' }}>Aparência & Tema</h3>
                </div>
                <div className="toggle-switch-container">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px' }}>
                      {darkMode ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                      )}
                    </div>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  <h3 style={{ fontSize: '1.05rem', margin: 0, textAlign: 'left' }}>Informações Pessoais</h3>
                </div>
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

                  <button type="submit" className="btn-primary" style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                    Salvar Alterações
                  </button>
                </form>
              </div>

              {/* Plano & Assinatura */}
              <div className="glass-panel">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                  <h3 style={{ fontSize: '1.05rem', margin: 0, textAlign: 'left' }}>Plano & Assinatura</h3>
                </div>
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
    </div>
  );
}

export default App;
