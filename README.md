# 1Convite - Ecossistema Completo

Bem-vindo ao **1Convite**, um super app cristão que integra a Palavra de Deus, interatividade, ferramentas de IA e criatividade em um só lugar.

## 🚀 Funcionalidades Atuais

- **Bíblia Sagrada:** Leitura completa com sistema de progresso, acompanhamento por marcação, narração em áudio (Web Speech API) e recompensas (moedas ganhas por leitura).
- **Desafio do Dia:** Tarefas diárias de reflexão e fé. Ao concluir, o usuário ganha moedas.
- **Conselheiros IA (Novo!):** Um hub interativo onde o usuário pode conversar com grandes nomes bíblicos guiados por Inteligência Artificial (ChatGPT).
  - Requer conexão de conta simulada via LWC State.
  - *Jesus Cristo* está desbloqueado por padrão.
  - Conselheiros Premium (Apóstolo Paulo, Apóstolo Pedro, Rei Davi, Rei Salomão, Rainha Ester) exigem desbloqueio via Moedas do Sistema.
  - Os conselheiros são apresentados em um grid de blocos 2x2 com badges modernas.
- **Jogos (Arcade Bíblico):**
  - **Quiz:** Perguntas e respostas bíblicas com 30 questões (10 por nível), temporizador (30s fácil / 15s médio / 7s avançado) e pontuação dinâmica.
  - **Quem Sou Eu? (Charadas):** 15 perguntas com dicas progressivas (sem timer no fácil, 15s médio, 7s avançado).
  - **Caça-Palavras:** Grid interativo com palavras em 8 direções (horizontal, vertical e diagonal), seleção por clique na primeira e última letra, normalização de acentos. Grades: 10×10 fácil, 12×12 médio, 14×14 avançado.
  - **Forca:** Palavras com dicas, teclado virtual, sistema de erros progressivo (8 vidas fácil, 6 médio, 4 avançado).
- **Lojinha & Economia Global:** O centro da nossa economia (`userCoins`). Todo esforço no app (como ler a Bíblia e jogar) rende moedas ("⭐"). Estas moedas podem ser gastas para:
  - Comprar *Stickers*, *Fontes Premium* e *Fundos Exclusivos* para o Studio.
  - Desbloquear Conselheiros IA Premium.
- **Studio de Cards (Premium):** Uma ferramenta estilo Canva onde você cria convites ou cartões de bom dia, adicionando fontes lindas e fundos exclusivos (que você comprou na Lojinha!). 

## 🧠 Arquitetura de Estado (Local Storage)
O App é um monolito React (em `App.jsx`) que persiste seu ecossistema no cache do navegador:
- `app-coins`: Moedas globais do usuário.
- `unlocked-counselors`: Array JSON dos conselheiros comprados.
- `unlocked-items`: Itens da lojinha comprados.
- `bible-progress`: Progresso de leitura.
- `1convite_dark_mode`: Preferência de tema (dark/light mode).
- `app-theme`: Tema de cores selecionado (theme-green, theme-orange, etc.).

## 🛠️ Tecnologias
- **React.js + Vite:** Interface rápida e modular.
- **Vanilla CSS:** Estilização responsiva, bonita e sem bibliotecas pesadas (UI Premium em `index.css`).
- **SQLite (Servidor Node):** Armazenamento das orações e outros dados, caso habilitado no backend local.
- **html2canvas:** Para gerar e salvar os convites construídos pelos usuários.
- **Capacitor:** Empacotamento para iOS/Android.

### Estrutura Principal
```
src/
├── App.jsx              # Componente principal (monolito)
├── index.css            # Tokens de design, temas, dark mode
├── App.css              # Estilos adicionais (vazio)
├── main.jsx             # Entry point do React
├── data/
│   └── arcadeData.js    # Dados dos jogos (Quiz, Charadas, Forca, Caça-Palavras)
└── components/
    └── LandingPage/     # Landing page Techla (desabilitada)
```

## 💾 Instalação e Execução

```bash
# Instalar dependências
npm install

# Rodar em modo de desenvolvimento (Frontend - porta 5173)
npm run dev

# Rodar o backend (porta 3001) - em outro terminal
node server/index.js

# Fazer build para produção
npm run build
```

> **Nota:** O frontend (Vite) roda na porta 5173 e o backend (Node/SQLite) na porta 3001. Ambos devem estar rodando simultaneamente para o app funcionar corretamente.

## 📚 Como contribuir
1. Realize suas modificações no código local.
2. Certifique-se de não duplicar componentes globais na UI.
3. Atualize sempre a documentação.
4. Faça o push para `https://github.com/spcompensa-glitch/1convite`.

*Deus abençoe seu uso e desenvolvimento do 1Convite!*

---

## 📋 Changelog

### 2026-07-27

**Tema & UI**
- Tema padrão alterado para **dark mode**. Usuário pode alternar para claro nas configurações.
- Corrigido bug onde `LandingPage.css` sobrescrevia variáveis globais (`:root`, `body`) com cores escuras, causando fundo branco + fonte branca no modo claro.
- Corrigido `useEffect` da LandingPage que forçava `backgroundColor: '#030303'` via inline style no body.
- Adicionadas propriedades CSS `color: var(--text-primary)` em `body` e `#root` para garantir contraste correto.
- Desabilitado redirect automático para LandingPage da Techla (`profileEmail === 'membro@1convite.com'`).

**Arcade Bíblico — Caça-Palavras**
- Criado arquivo `src/data/arcadeData.js` com dados centralizados dos 4 jogos.
- Corrigido bug de seleção: agora aceita cliques em **8 direções** (horizontal, vertical e diagonal), não apenas 2.
- Adicionada normalização de acentos (`GRAÇA` → `GRACA`) para comparação correta com o grid.
- Aumentado número de tentativas de posicionamento de palavras no grid (100 → 500).
- Grades expandidas: fácil 10×10 (5 palavras), médio 12×12 (6), avançado 14×14 (8).
- Grid size dinâmico no CSS (`gridTemplateColumns` baseado no tamanho real do grid).

**Arcade Bíblico — Forca**
- Corrigido bug crítico: jogo usava `ARCADE_FORCA_WORDS[...]` (array global de 30 palavras) em vez de `arcadeForcaList[...]` (lista filtrada por dificuldade). Palavras de níveis errados apareciam.

**Arcade Bíblico — Quiz & Charadas**
- Adicionados timers `useEffect` para countdown correto do Quiz e Charadas.
- Timer do Quiz reseta corretamente ao voltar para o lobby.
- Quiz e Charadas já usavam listas filtradas — confirmado correto.

**Infraestrutura**
- `package.json`: `engines.node` alterado de `"20.x"` para `">=20"` para compatibilidade.
- Vite 5.4.21 instalado via `npm install --include=dev`.
- Backend (porta 3001) e frontend (porta 5173) documentados para execução simultânea.
