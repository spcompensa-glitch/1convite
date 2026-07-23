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
  - **Quiz:** Perguntas e respostas sobre conhecimentos gerais e bíblicos com níveis de dificuldade (Fácil, Médio, Difícil).
  - **Quem Sou Eu? (Charadas):** Adivinhe o personagem com dicas limitadas.
  - **Caça-Palavras:** Ache as palavras escondidas em um grid interativo, desenhando linhas para marcar!
  - **Forca:** Descubra a palavra oculta, mas cuidado com os erros.
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

## 🛠️ Tecnologias
- **React.js + Vite:** Interface rápida e modular.
- **Vanilla CSS:** Estilização responsiva, bonita e sem bibliotecas pesadas (UI Premium em `index.css`).
- **SQLite (Servidor Node):** Armazenamento das orações e outros dados, caso habilitado no backend local.
- **html2canvas:** Para gerar e salvar os convites construídos pelos usuários.

## 💾 Instalação e Execução

```bash
# Instalar dependências
npm install

# Rodar em modo de desenvolvimento
npm run dev

# Fazer build para produção
npm run build
```

## 📚 Como contribuir
1. Realize suas modificações no código local.
2. Certifique-se de não duplicar componentes globais na UI.
3. Atualize sempre a documentação.
4. Faça o push para `https://github.com/spcompensa-glitch/1convite`.

*Deus abençoe seu uso e desenvolvimento do 1Convite!*
