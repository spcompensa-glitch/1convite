import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import { createChatGPTHandler } from '@opencoredev/loginwithchatgpt-server';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());

// Configuração do Login with ChatGPT
const chatGptHandler = createChatGPTHandler({
  secret: process.env.LWC_SECRET || 'a-very-stable-secret-for-development-1convite-32-chars-long!',
  basePath: '/api/v1/chatgpt',
  // Permitimos exportar tokens caso o frontend precise diretamente (opcional, para flexibilidade)
  dangerouslyAllowTokenExport: true,
  allowedOrigins: ['http://localhost:5173', 'http://127.0.0.1:5173'],
});

// Adaptadores para converter Express <-> Web Request/Response
async function toWebRequest(req) {
  const protocol = req.protocol;
  const host = req.get('host');
  const originalUrl = req.originalUrl;
  const url = `${protocol}://${host}${originalUrl}`;
  
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value) {
      if (Array.isArray(value)) {
        value.forEach(v => headers.append(key, v));
      } else {
        headers.set(key, value);
      }
    }
  }

  let body = null;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    body = typeof req.body === 'object' ? JSON.stringify(req.body) : req.body;
  }

  return new Request(url, {
    method: req.method,
    headers,
    body,
  });
}

async function fromWebResponse(webRes, res) {
  res.status(webRes.status);
  webRes.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  if (webRes.body) {
    const reader = webRes.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }
    res.end();
  } else {
    res.end();
  }
}

// Roteamento do Login with ChatGPT no Express
app.all('/api/v1/chatgpt/*splat', async (req, res) => {
  console.log(`[ChatGPT Request] ${req.method} ${req.originalUrl}`);
  try {
    const webReq = await toWebRequest(req);
    const webRes = await chatGptHandler.handler(webReq);
    console.log(`[ChatGPT Request] Response: ${webRes.status}`);
    
    // Se a resposta não for bem-sucedida, vamos ler e logar o corpo para ajudar no diagnóstico
    if (!webRes.ok) {
      const clone = webRes.clone();
      const text = await clone.text();
      console.warn(`[ChatGPT Request] Error response payload: ${text}`);
    }

    await fromWebResponse(webRes, res);
  } catch (err) {
    console.error('Erro no ChatGPT handler:', err);
    res.status(500).json({ error: err.message });
  }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
  }
});

// Helper para queries em Promise
const dbRun = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const dbGet = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const dbAll = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Inicialização do Banco de Dados
async function initDb() {
  await dbRun(`
    CREATE TABLE IF NOT EXISTS tb_matriz_diaria (
      dia_id INTEGER PRIMARY KEY,
      pilar_origem TEXT CHECK(pilar_origem IN ('PROPÓSITO_M2414', 'RECOMPENSA_AP321')) NOT NULL,
      codigo_verbal TEXT NOT NULL,
      versiculo_chave TEXT NOT NULL,
      texto_reflexao TEXT NOT NULL,
      texto_meditacao TEXT,
      url_audio_meditacao TEXT NOT NULL
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS tb_usuario_progresso (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      dia_atual INTEGER DEFAULT 1,
      checkpoint_completado INTEGER DEFAULT 0,
      checkpoint_started_at INTEGER DEFAULT 0,
      status_plano TEXT DEFAULT 'FREE',
      nome TEXT,
      email TEXT,
      avatar TEXT
    )
  `);

  // Migrações dinâmicas para adicionar colunas se o banco já existia
  try { await dbRun('ALTER TABLE tb_usuario_progresso ADD COLUMN nome TEXT'); } catch (_) {}
  try { await dbRun('ALTER TABLE tb_usuario_progresso ADD COLUMN email TEXT'); } catch (_) {}
  try { await dbRun('ALTER TABLE tb_usuario_progresso ADD COLUMN avatar TEXT'); } catch (_) {}

  await dbRun(`
    CREATE TABLE IF NOT EXISTS tb_contatos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      relacao TEXT NOT NULL,
      prioritario INTEGER DEFAULT 0,
      ultimo_convite_timestamp INTEGER DEFAULT 0,
      historico_acoes TEXT DEFAULT '[]'
    )
  `);

  // Insere o progresso inicial se não existir
  const user = await dbGet('SELECT * FROM tb_usuario_progresso LIMIT 1');
  if (!user) {
    await dbRun('INSERT INTO tb_usuario_progresso (dia_atual, checkpoint_completado, status_plano, nome, email, avatar) VALUES (1, 0, "FREE", "Membro Convidado", "membro@1convite.com", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80")');
  }

  // Preenche a tabela tb_matriz_diaria (sempre limpamos no início do desenvolvimento para aplicar atualizações das sementes)
  await dbRun('DELETE FROM tb_matriz_diaria');
  const countRow = await dbGet('SELECT COUNT(*) as count FROM tb_matriz_diaria');
  if (countRow.count === 0) {
    console.log('Populando tabela de 365 dias...');
    const reais = [
      {
        dia_id: 1,
        pilar_origem: 'PROPÓSITO_M2414',
        codigo_verbal: 'Código 01: O Reino começa no quintal da sua casa.',
        versiculo_chave: 'E este evangelho do reino será pregado em todo o mundo como testemunho a todas as nações, então, virá o fim. - Mateus 24:14',
        texto_reflexao: 'O evangelismo eficaz não começa em outra nação, mas no próximo contato que você fizer hoje. Note quem está ao seu redor no agora de Deus e faça uma conexão real. \n\n📖 HISTÓRIA CRISTÃ REAL:\nEdward Kimball era um simples professor voluntário de escola dominical. Em 1855, ele decidiu fazer uma conexão simples no quintal de sua casa: entrou na sapataria onde um jovem de 17 anos trabalhava para falar sobre Cristo. Esse jovem era Dwight L. Moody, que veio a pregar para milhões e fundou grandes instituições cristãs. O impacto mundial de Moody começou com a conexão intencional de Kimball em uma sapataria comum.',
        texto_meditacao: `🎙️ Roteiro de Oração Guiada: "A Oração de Ação de Graças e Propósito"
Duração aproximada: 3 a 4 minutos

Trilha de fundo sugerida: Tom suave, seguro e focado. Sem desespero, com tom de certeza e autoridade espiritual.

🟢 1. O Ponto de Partida: Ação de Graças pelo Hoje
(Tom de voz: Calmo, grato, pausado)

Repita comigo em seu coração ou em alta voz:

"Pai, a Ti rendo graças.

Obrigado porque o Senhor é bom e sempre me ouve.

(Pausa de 3 segundos)

Agradeço pela oportunidade de despertar para mais este dia incrível.

Obrigado pelo ar nos meus pulmões, pelo pão na minha mesa e por esta nova chance de viver."

🟡 2. O Alinhamento: Tudo o que Tenho é Suficiente
(Inspirado na Multiplicação dos Pães - Marcos 6:41)

"Senhor, assim como Jesus não olhou para a escassez dos cinco pães e dois peixes, mas ergueu os olhos para o céu e deu graças... eu entrego nas Tuas mãos o que eu tenho hoje.

(Pausa de 4 segundos)

Não vou reclamar do que me falta. Eu abençoo o pouco ou o muito que está nas minhas mãos agora, sabendo que a Tua graça multiplica o meu esforço."

🟠 3. O Propósito e o Mover no Agora
(Tom de voz: Firme, consciente, de governo)

"Pai, o meu dia não será em vão.

Eu desperto hoje para trabalhar alinhado ao meu propósito e à visão do Teu Reino.

(Pausa de 3 segundos)

Dá-me olhos para notar as pessoas ao meu redor.

Usa a minha vida como um testemunho vivo. Que onde eu colocar as minhas mãos, haja bênção, sabedoria e multiplicação."

🔴 4. A Selagem do Convite
(Tom de voz: Decidido, pronto para a ação)

"Eu não andarei ansioso pelo amanhã.

Eu tomo posse da vitória e da paz que já foram conquistadas na cruz.

Em nome de Jesus, o meu dia está abençoado.

Amém!"`,
        url_audio_meditacao: '/piano.mp3'
      },
      {
        dia_id: 2,
        pilar_origem: 'RECOMPENSA_AP321',
        codigo_verbal: 'Código 02: Desfrute da vitória que você não teve que conquistar.',
        versiculo_chave: 'Ao vencedor darei o direito de sentar-se comigo em meu trono, assim como eu também venci e sentei-me com meu Pai em seu trono. - Apocalipse 3:21',
        texto_reflexao: 'A ansiedade morre quando você entende que a batalha principal já foi ganha. Você não trabalha para ser aceito, mas opera a partir da vitória consumada. Descanse nesse sábado eterno. \n\n📖 HISTÓRIA CRISTÃ REAL:\nMartinho Lutero viveu anos sob severa angústia e culpa em um mosteiro agostiniano, tentando alcançar a aceitação de Deus através de jejuns, vigílias e autoflagelação sem sucesso. Ao estudar a epístola aos Romanos na torre do mosteiro, ele teve a revelação de que a salvação é um presente gratuito de Deus aceito pela fé. Lutero parou de lutar para conquistar o céu e pôde finalmente descansar na vitória consumada por Jesus Cristo.',
        texto_meditacao: `🎙️ Roteiro de Oração Guiada: "A Oração do Descanse na Vitória"
Duração aproximada: 3 minutos

Trilha de fundo sugerida: Tom suave, seguro e focado. Sem desespero, com tom de certeza e autoridade espiritual.

🟢 1. O Ponto de Partida: Ação de Graças pela Vitória
(Tom de voz: Calmo, grato, pausado)

Repita comigo em seu coração ou em alta voz:

"Pai, eu Te dou graças.

Obrigado porque a batalha principal já foi ganha por Jesus na cruz.

(Pausa de 3 segundos)

Agradeço porque meu valor não vem do meu esforço humano, mas do Teu amor gratuito.

Eu recebo hoje a Tua paz que excede todo o entendimento."

🟡 2. O Alinhamento: Assentado no Trono (Inspirado em Apocalipse 3:21)

"Senhor, assim como Martinho Lutero compreendeu que a aceitação vem pela fé e não por autoflagelação ou ativismo... eu paro de lutar para ser aceito.

(Pausa de 4 segundos)

Eu me assento na Tua vitória hoje. Eu sou Teu filho, e o Teu favor me basta agora."

🟠 3. O Propósito e o Mover no Agora
(Tom de voz: Firme, consciente, de governo)

"Pai, eu não andarei aflito para provar meu valor para os outros hoje.

Tudo o que eu fizer fluirá a partir do descanso e da certeza da minha herança.

(Pausa de 3 segundos)

Que as minhas atitudes reflitam a segurança de quem já venceu com Cristo.

Que eu traga paz e justiça aos ambientes onde eu pisar."

🔴 4. A Selagem do Convite
(Tom de voz: Decidido, pronto para a ação)

"Eu declaro cancelada toda ansiedade de desempenho na minha vida.

Estou livre para amar, servir e compartilhar sem medo.

Em nome de Jesus, o meu dia está guardado.

Amém!"`,
        url_audio_meditacao: '/piano.mp3'
      },
      {
        dia_id: 3,
        pilar_origem: 'PROPÓSITO_M2414',
        codigo_verbal: 'Código 03: Pague um café para comprar um tempo de atenção.',
        versiculo_chave: 'Ninguém tem maior amor do que este: de dar alguém a própria vida pelos seus amigos. - João 15:13',
        texto_reflexao: 'Um convite intencional demonstra valor. Pagar um café ou dedicar 15 minutos para ouvir alguém genuinamente é doar um fragmento da sua vida pelo outro. \n\n📖 HISTÓRIA CRISTÃ REAL:\nC. S. Lewis, autor das Crônicas de Nárnia e um dos intelectuais mais famosos do século XX, recebia milhares de cartas de leitores do mundo inteiro. Ele estabeleceu como prioridade pessoal responder a cada uma delas à mão, dedicando horas de suas manhãs para acolher dúvidas de crianças e desconhecidos. Lewis preferia sacrificar seu tempo acadêmico para doar atenção focada e individual, sabendo que ouvir e responder a um irmão era servir a Cristo.',
        texto_meditacao: `🎙️ Roteiro de Oração Guiada: "A Oração do Tempo como Oferta"
Duração aproximada: 3 minutos

Trilha de fundo sugerida: Tom suave, seguro e focado. Sem desespero, com tom de certeza e autoridade espiritual.

🟢 1. O Ponto de Partida: Ação de Graças pela Atenção
(Tom de voz: Calmo, grato, pausado)

Repita comigo em seu coração ou em alta voz:

"Pai, a Ti rendo graças.

Obrigado por este momento de silêncio e por me ouvir com total atenção.

(Pausa de 3 segundos)

Agradeço porque diante de Ti eu posso desacelerar sem culpa.

Obrigado porque o Senhor nunca tem pressa para comigo."

🟡 2. O Alinhamento: Consagração do Tempo (Inspirado em João 15:13)

"Senhor, assim como C.S. Lewis sacrificou seu tempo acadêmico para responder com atenção e amor a cada carta de crianças desconhecidas... eu coloco o meu tempo em Tuas mãos.

(Pausa de 4 segundos)

A minha vida não é medida pelo meu relógio, mas pelo amor que dedico.

Entrego o meu dia para ser uma oferta de amor ao meu próximo."

🟠 3. O Propósito e o Mover no Agora
(Tom de voz: Firme, consciente, de governo)

"Pai, ajuda-me a não olhar apenas para as minhas telas hoje.

Dá-me sensibilidade para notar quem precisa de atenção.

(Pausa de 3 segundos)

Eu escolho parar e ouvir com o coração a pessoa que o Senhor colocar no meu caminho.

Serei a presença de Cristo para o meu próximo no agora."

🔴 4. A Selagem do Convite
(Tom de voz: Decidido, pronto para a ação)

"Eu não serei escravo da pressa hoje.

Eu tomo posse da paz e da presença do Senhor em cada conversa.

Em nome de Jesus, o meu dia está consagrado.

Amém!"`,
        url_audio_meditacao: '/piano.mp3'
      },
      {
        dia_id: 4,
        pilar_origem: 'RECOMPENSA_AP321',
        codigo_verbal: 'Código 04: A pressa é uma mentira que tenta roubar a sua eternidade.',
        versiculo_chave: 'Portanto, resta ainda um descanso sabático para o povo de Deus. - Hebreus 4:9',
        texto_reflexao: 'A pressa e o ativismo tentam nos convencer de que nosso valor vem da nossa produtividade. Acalme o seu coração no Agora. Respire fundo, e sinta o repouso divino de Apocalipse 3:21. \n\n📖 HISTÓRIA CRISTÃ REAL:\nEric Liddell, velocista escocês e cristão fervoroso, descobriu que as eliminatórias dos 100 metros nas Olimpíadas de Paris em 1924 seriam realizadas em um domingo. Ele se recusou a correr, afirmando que o Dia do Senhor era sagrado para o descanso e adoração. Liddell sofreu imensa rejeição pública, mas manteve sua decisão. Dias depois, correu a prova de 400 metros (distância para a qual não havia treinado tanto) e conquistou a medalha de ouro olímpica estabelecendo um novo recorde mundial.',
        texto_meditacao: `🎙️ Roteiro de Oração Guiada: "A Oração do Descanso da Alma"
Duração aproximada: 3 minutos

Trilha de fundo sugerida: Tom suave, seguro e focado. Sem desespero, com tom de certeza e autoridade espiritual.

🟢 1. O Ponto de Partida: Ação de Graças pelo Sábado
(Tom de voz: Calmo, grato, pausado)

Repita comigo em seu coração ou em alta voz:

"Pai, a Ti rendo graças.

Obrigado por providenciar um descanso sabático para o Teu povo.

(Pausa de 3 segundos)

Agradeço porque o Senhor renova as minhas forças no silêncio.

Obrigado por me lembrar de que a minha produtividade não determina o meu valor."

🟡 2. O Alinhamento: O Sábado do Coração (Inspirado em Hebreus 4:9)

"Senhor, assim como Eric Liddell abriu mão da glória olímpica no domingo para honrar o Teu descanso... eu decido parar agora.

(Pausa de 4 segundos)

Eu calo o barulho das minhas preocupações.

O Senhor sustenta o meu amanhã enquanto eu descanso na Tua presença hoje."

🟠 3. O Propósito e o Mover no Agora
(Tom de voz: Firme, consciente, de governo)

"Pai, eu rejeito todo o cansaço e esgotamento mental.

Eu escolho focar na Tua graça e no Teu refrigério.

(Pausa de 3 segundos)

Que este tempo de descanso recarregue as minhas energias para servir melhor.

Que eu leve leveza e paz a todos ao meu redor."

🔴 4. A Selagem do Convite
(Tom de voz: Decidido, pronto para a ação)

"Eu tomo posse da promessa do descanso eterno em Cristo.

O meu amanhã está seguro em Tuas mãos.

Em nome de Jesus, eu declaro meu coração em paz.

Amém!"`,
        url_audio_meditacao: '/piano.mp3'
      },
      {
        dia_id: 5,
        pilar_origem: 'PROPÓSITO_M2414',
        codigo_verbal: 'Código 05: A conexão real vence o algoritmo digital.',
        versiculo_chave: 'E não nos cansemos de fazer o bem, pois no tempo próprio colheremos, se não desanimarmos. - Gálatas 6:9',
        texto_reflexao: 'Substitua 10 minutos de feed infinito por uma mensagem direcionada a um amigo ou familiar que você não vê há tempos. Um convite sincero é uma semente do Reino. \n\n📖 HISTÓRIA CRISTÃ REAL:\nDietrich Bonhoeffer, pastor luterano que se opôs ativamente ao regime de Hitler, organizou um seminário clandestino em Finkenwalde. Longe da propaganda em massa do Estado nazista, ele reuniu pastores em uma comunidade real e física descrita em seu livro "Vida em Comunhão". Ele defendia que a comunhão real, física e o partir do pão face a face tinham o poder de sustentar a fé viva contra qualquer barulho artificial do mundo moderno.',
        texto_meditacao: `🎙️ Roteiro de Oração Guiada: "A Oração da Conexão Real"
Duração aproximada: 3 minutos

Trilha de fundo sugerida: Tom suave, seguro e focado. Sem desespero, com tom de certeza e autoridade espiritual.

🟢 1. O Ponto de Partida: Ação de Graças pela Comunhão
(Tom de voz: Calmo, grato, pausado)

Repita comigo em seu coração ou em alta voz:

"Pai, a Ti rendo graças.

Obrigado pelos amigos, pela família e pelas conexões reais.

(Pausa de 3 segundos)

Agradeço pela bênção de partilhar a vida face a face com outras pessoas.

Obrigado por me resgatar do isolamento e da distração digital."

🟡 2. O Alinhamento: Comunhão Verdadeira (Inspirado em Gálatas 6:9)

"Senhor, assim como Dietrich Bonhoeffer liderou uma comunidade física e real em Finkenwalde para resistir à propaganda e ao caos... eu escolho a realidade hoje.

(Pausa de 4 segundos)

Prefiro a presença ao feed infinito.

Abençoo cada pessoa com quem falarei hoje com palavras de vida."

🟠 3. O Propósito e o Mover no Agora
(Tom de voz: Firme, consciente, de governo)

"Pai, eu não me cansarei de fazer o bem.

Substituirei a pressa das telas pelo abraço e pelo tempo dedicado.

(Pausa de 3 segundos)

Usa a minha presença física para trazer conforto e encorajamento a quem precisa.

Serei um canal do Teu amor em conexões genuínas."

🔴 4. A Selagem do Convite
(Tom de voz: Decidido, pronto para a ação)

"Eu quebro toda barreira digital que me afasta do meu próximo.

A minha vida frutificará em relacionamentos intencionais.

Em nome de Jesus, o meu dia está sob a bênção da comunhão.

Amém!"`,
        url_audio_meditacao: '/piano.mp3'
      },
      {
        dia_id: 6,
        pilar_origem: 'RECOMPENSA_AP321',
        codigo_verbal: 'Código 06: Sentar no trono exige aprender a descansar.',
        versiculo_chave: 'Na tranquilidade e na confiança está a vossa força. - Isaías 30:15',
        texto_reflexao: 'Os governantes do Reino não andam ansiosos ou apressados. Eles confiam na soberania e descansam em Deus. Encontre a força do governo próprio no desfrute espiritual. \n\n📖 HISTÓRIA CRISTÃ REAL:\nGeorge Müller, que cuidou de mais de 10 mil órfãos na Bristol do século XIX, comprometeu-se a nunca pedir recursos a homens, mas sim orar e descansar em Deus. Diversas vezes o orfanato amanheceu sem um único pedaço de pão. Müller pedia às crianças que se assentassem à mesa e orava dando graças. Invariavelmente, minutos depois, padeiros ou leiteiros locais batiam à porta doando alimentos devido a imprevistos na entrega ou a toques de Deus em seus corações.',
        texto_meditacao: `🎙️ Roteiro de Oração Guiada: "A Oração do Descanso da Confiança"
Duração aproximada: 3 minutos

Trilha de fundo sugerida: Tom suave, seguro e focado. Sem desespero, com tom de certeza e autoridade espiritual.

🟢 1. O Ponto de Partida: Ação de Graças pela Provisão
(Tom de voz: Calmo, grato, pausado)

Repita comigo em seu coração ou em alta voz:

"Pai, a Ti rendo graças.

Obrigado porque o Senhor é o meu provedor e nada me faltará.

(Pausa de 3 segundos)

Agradeço porque as Tuas promessas são fiéis e o Senhor cuida de cada detalhe.

Obrigado pela paz de saber que minhas necessidades estão supridas."

🟡 2. O Alinhamento: A Provisão na Mesa (Inspirado em Isaías 30:15)

"Senhor, assim como George Müller deu graças diante de pratos vazios na mesa dos órfãos confiando na Tua fidelidade... eu dou graças agora pela provisão que virá.

(Pausa de 4 segundos)

Não andarei ansioso por recursos.

Na tranquilidade e na confiança está a minha força."

🟠 3. O Propósito e o Mover no Agora
(Tom de voz: Firme, consciente, de governo)

"Pai, eu rejeito todo o medo de escassez hoje.

Eu governo sobre minhas finanças e meu futuro com sabedoria do Reino.

(Pausa de 3 segundos)

Usa a minha vida para abençoar e suprir outros em generosidade.

Que eu colha sabedoria e multiplicação onde eu investir o meu esforço."

🔴 4. A Selagem do Convite
(Tom de voz: Decidido, pronto para a ação)

"Eu declaro cancelada toda ansiedade de futuro em nome de Jesus.

O meu suprimento diário está garantido pela cruz.

Em nome de Jesus, a minha casa está abençoada.

Amém!"`,
        url_audio_meditacao: '/piano.mp3'
      },
      {
        dia_id: 7,
        pilar_origem: 'PROPÓSITO_M2414',
        codigo_verbal: 'Código 07: O Reino é construído sobre mesas e refeições.',
        versiculo_chave: 'E eles, perseverando unânimes todos os dias no templo, e partindo o pão em casa, comiam juntos com alegria e singeleza de coração. - Atos 2:46',
        texto_reflexao: 'Abra a porta da sua casa ou convide alguém para uma refeição. A comunhão de mesa é o método mais poderoso de pregar o evangelho de Mateus 24:14 no dia a dia. \n\n📖 HISTÓRIA CRISTÃ REAL:\nJohn Wesley, líder do avivamento do século XVIII que transformou a Inglaterra, organizou a igreja primitiva em pequenas células de comunhão em casas chamadas de "Classes". Nelas, os primeiros metodistas comiam juntos nas chamadas "Festas de Amor" (Ágapes), confessavam suas lutas e oravam uns pelos outros ao redor de mesas simples. O poder transformador que espalhou o evangelho não residia nos grandes templos, mas nas mesas compartilhadas.',
        texto_meditacao: `🎙️ Roteiro de Oração Guiada: "A Oração do Banquete da Mesa"
Duração aproximada: 3 minutos

Trilha de fundo sugerida: Tom suave, seguro e focado. Sem desespero, com tom de certeza e autoridade espiritual.

🟢 1. O Ponto de Partida: Ação de Graças pela Mesa
(Tom de voz: Calmo, grato, pausado)

Repita comigo em seu coração ou em alta voz:

"Pai, a Ti rendo graças.

Obrigado pela alegria do pão partilhado e pela comunhão de mesa.

(Pausa de 3 segundos)

Agradeço pela simplicidade de coração e pela união com meus irmãos.

Obrigado pela oportunidade de acolher pessoas em minha vida."

🟡 2. O Alinhamento: A Festa do Amor (Inspirado em Atos 2:46)

"Senhor, assim como a igreja primitiva e as Classes de John Wesley se reuniam nas casas para partilhar o pão com alegria... eu consagro a minha mesa hoje.

(Pausa de 4 segundos)

Que a minha casa seja um altar do Teu amor.

Eu abro espaço para a reconciliação, a cura e a hospitalidade sincera."

🟠 3. O Propósito e o Mover no Agora
(Tom de voz: Firme, consciente, de governo)

"Pai, ajuda-me a ir além do ativismo religioso hoje.

Usa a comunhão de mesa para curar feridas e resgatar vidas.

(Pausa de 3 segundos)

Dá-me um coração generoso para acolher e compartilhar o meu pão.

Que o meu lar seja o ponto de partida do Teu Reino."

🔴 4. A Selagem do Convite
(Tom de voz: Decidido, pronto para a ação)

"Eu declaro a minha mesa santificada e cheia de alegria espiritual.

O evangelho do Reino se espalhará através do meu convite.

Em nome de Jesus, a minha mesa está abençoada.

Amém!"`,
        url_audio_meditacao: '/piano.mp3'
      }
    ];

    // Gerador programático dos outros 358 dias
    for (let i = 1; i <= 365; i++) {
      const realDay = reais.find(r => r.dia_id === i);
      if (realDay) {
        await dbRun(
          'INSERT INTO tb_matriz_diaria (dia_id, pilar_origem, codigo_verbal, versiculo_chave, texto_reflexao, texto_meditacao, url_audio_meditacao) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [realDay.dia_id, realDay.pilar_origem, realDay.codigo_verbal, realDay.versiculo_chave, realDay.texto_reflexao, realDay.texto_meditacao, realDay.url_audio_meditacao]
        );
      } else {
        const isProposito = i % 2 !== 0;
        const pilar = isProposito ? 'PROPÓSITO_M2414' : 'RECOMPENSA_AP321';
        const codigo = isProposito
          ? `Código ${String(i).padStart(2, '0')}: Conexão intencional gera o fruto da eternidade.`
          : `Código ${String(i).padStart(2, '0')}: Seu valor não está na sua pressa, mas na sua herança.`;
        const versiculo = isProposito
          ? `E disse-lhes: Ide por todo o mundo, pregai o evangelho a toda criatura. - Marcos 16:15`
          : `Aquele que vencer herdará todas as coisas; e eu serei seu Deus, e ele será meu filho. - Apocalipse 21:7`;
        const reflexao = isProposito
          ? `O dia ${i} convida você a ir além do seu círculo de conforto. Notar as pessoas e fazer convites de coração aberto é trazer o Reino de Deus à terra em gestos simples.`
          : `Hoje, no dia ${i}, lembre-se de que sentar no trono significa reinar em paz. Pare, respire no silêncio e desfrute da abundância do amor que já preenche a sua identidade.`;
        const meditacao_gen = `Respire fundo... e concentre-se na presença divina do Dia ${i}. Deixe de lado os ruídos e conecte-se com o pilar de hoje. Faça uma pausa de respiração guiada, sintonize seu coração com as promessas eternas e peça a Deus força para colocar essa palavra em prática no seu caminhar diário.`;
        const audio = `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${(i % 15) + 1}.mp3`;

        await dbRun(
          'INSERT INTO tb_matriz_diaria (dia_id, pilar_origem, codigo_verbal, versiculo_chave, texto_reflexao, texto_meditacao, url_audio_meditacao) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [i, pilar, codigo, versiculo, reflexao, meditacao_gen, audio]
        );
      }
    }
    console.log('Matriz diária populada com sucesso!');
  }

  // Criar tabela de dicionário
  await dbRun(`
    CREATE TABLE IF NOT EXISTS tb_dicionario (
      termo TEXT PRIMARY KEY,
      significado TEXT NOT NULL
    )
  `);

  // Popular dicionário se vazio
  const dicCount = await dbGet('SELECT COUNT(*) as count FROM tb_dicionario');
  if (dicCount.count === 0) {
    console.log('Populando dicionário teológico...');
    const termos = [
      { termo: 'graça', significado: 'Favor imerecido concedido por Deus ao homem. O amor ativo que resgata sem exigir méritos.' },
      { termo: 'fé', significado: 'Firme fundamento das coisas que se esperam, e a prova das coisas que se não veem (Hebreus 11:1).' },
      { termo: 'reino', significado: 'O governo e a soberania de Deus estabelecidos no coração do homem e manifestados na sociedade.' },
      { termo: 'propósito', significado: 'A intenção divina para a qual cada ser foi criado; o alinhamento com a vontade do Criador.' },
      { termo: 'amor', significado: 'Do grego "Agape", o amor incondicional, sacrificial e baseado em decisão, não em sentimentos.' },
      { termo: 'sabático', significado: 'Repouso ordenado por Deus, não apenas físico, mas espiritual, descansando na suficiência divina.' },
      { termo: 'evangelho', significado: 'As "Boas Novas" da salvação, restauração e reconciliação da criação com Deus através de Cristo.' },
      { termo: 'justiça', significado: 'Retidão moral e conformidade com a vontade de Deus. Estar em posição correta perante o Criador.' }
    ];
    for (const t of termos) {
      await dbRun('INSERT INTO tb_dicionario (termo, significado) VALUES (?, ?)', [t.termo, t.significado]);
    }
  }

  // Criar tabela de trilhas de crescimento
  await dbRun(`
    CREATE TABLE IF NOT EXISTS tb_trilhas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tema TEXT NOT NULL,
      dia_trilha INTEGER NOT NULL,
      titulo TEXT NOT NULL,
      versiculo TEXT NOT NULL,
      reflexao TEXT NOT NULL,
      acao_pratica TEXT NOT NULL
    )
  `);

  // Criar tabela de progresso de trilhas do usuário
  await dbRun(`
    CREATE TABLE IF NOT EXISTS tb_usuario_trilha_progresso (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      trilha_ativa TEXT DEFAULT NULL,
      dia_progresso INTEGER DEFAULT 1,
      atualizado_em INTEGER DEFAULT 0
    )
  `);

  // Adicionar registro inicial de progresso se vazio
  const trProg = await dbGet('SELECT * FROM tb_usuario_trilha_progresso LIMIT 1');
  if (!trProg) {
    await dbRun('INSERT INTO tb_usuario_trilha_progresso (trilha_ativa, dia_progresso, atualizado_em) VALUES (NULL, 1, 0)');
  }

  // Popular trilhas de 30 dias se vazio
  const trilhaCount = await dbGet('SELECT COUNT(*) as count FROM tb_trilhas');
  if (trilhaCount.count === 0) {
    console.log('Populando Trilhas de Crescimento (30 dias para cada tema)...');
    const temas = ['Ansiedade', 'Família', 'Finanças', 'Propósito'];
    
    // Gerar 30 dias para cada tema
    for (const tema of temas) {
      for (let dia = 1; dia <= 30; dia++) {
        let titulo, versiculo, reflexao, acao_pratica;
        
        if (tema === 'Ansiedade') {
          titulo = `Dia ${dia}: Entregando o Controle`;
          versiculo = 'Não andeis ansiosos por coisa alguma... - Filipenses 4:6';
          reflexao = `A ansiedade surge quando tentamos carregar um fardo de amanhã com a força de hoje. No dia ${dia} dessa jornada de paz, lembre-se de que Deus governa o tempo e o agora.`;
          acao_pratica = 'Pare o que está fazendo por 2 minutos, respire fundo e declare: Eu confio no Teu governo.';
        } else if (tema === 'Família') {
          titulo = `Dia ${dia}: Fortalecendo Laços`;
          versiculo = 'Eu e a minha casa serviremos ao Senhor. - Josué 24:15';
          reflexao = `A família é o primeiro laboratório do Reino de Deus na terra. No dia ${dia}, veja o valor sagrado de cultivar relacionamentos saudáveis dentro do seu lar.`;
          acao_pratica = 'Faça um elogio sincero para alguém da sua família hoje ou mande uma mensagem de carinho.';
        } else if (tema === 'Finanças') {
          titulo = `Dia ${dia}: Princípio da Mordomia`;
          versiculo = 'Ao Senhor pertence a terra e tudo o que nela há. - Salmo 24:1';
          reflexao = `Não somos donos, mas mordomos dos recursos que Deus confiou a nós. No dia ${dia}, compreenda que a generosidade é a vacina contra a avareza e o medo da escassez.`;
          acao_pratica = 'Separe um valor ou prepare algo para abençoar alguém que está passando por necessidade.';
        } else {
          titulo = `Dia ${dia}: Descobrindo o Chamado`;
          versiculo = 'Pois Dele, por Ele e para Ele são todas as coisas. - Romanos 11:36';
          reflexao = `Propósito não é o que você faz para Deus, mas o que Deus faz através de você. No dia ${dia}, sintonize seu coração com os planos eternos do Pai.`;
          acao_pratica = 'Escreva em um papel três talentos que você tem e como pode usá-los para servir ao próximo.';
        }

        await dbRun(
          'INSERT INTO tb_trilhas (tema, dia_trilha, titulo, versiculo, reflexao, acao_pratica) VALUES (?, ?, ?, ?, ?, ?)',
          [tema, dia, titulo, versiculo, reflexao, acao_pratica]
        );
      }
    }
  }
}

// Inicializa Tabelas
initDb().catch(console.error);

// ---------------- ROTAS DO CORE ----------------

// Obter dados do usuário e progresso
app.get('/api/v1/usuario', async (req, res) => {
  try {
    const user = await dbGet('SELECT * FROM tb_usuario_progresso LIMIT 1');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Atualizar dados de perfil do usuário manualmente
app.post('/api/v1/usuario/perfil', async (req, res) => {
  try {
    const { nome, email, avatar } = req.body;
    await dbRun(
      'UPDATE tb_usuario_progresso SET nome = ?, email = ?, avatar = ?',
      [nome, email, avatar]
    );
    const updated = await dbGet('SELECT * FROM tb_usuario_progresso LIMIT 1');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Autenticação / Sincronização com o Google Sign-In
app.post('/api/v1/auth/google', async (req, res) => {
  try {
    const { nome, email, avatar } = req.body;
    
    // Como há apenas 1 usuário local simulado por banco SQLite, atualizamos os dados dele.
    await dbRun(
      'UPDATE tb_usuario_progresso SET nome = ?, email = ?, avatar = ?',
      [nome, email, avatar]
    );
    
    const user = await dbGet('SELECT * FROM tb_usuario_progresso LIMIT 1');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obter código do dia atual do usuário
app.get('/api/v1/codigo-dia', async (req, res) => {
  try {
    const user = await dbGet('SELECT * FROM tb_usuario_progresso LIMIT 1');
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    const code = await dbGet('SELECT * FROM tb_matriz_diaria WHERE dia_id = ?', [user.dia_atual]);
    res.json({ user, code });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Salvar código do dia enriquecido gerado pela IA
app.post('/api/v1/codigo-dia/save', async (req, res) => {
  try {
    const { dia_id, codigo_verbal, versiculo_chave, texto_reflexao, texto_meditacao } = req.body;
    if (!dia_id || !codigo_verbal || !versiculo_chave || !texto_reflexao) {
      return res.status(400).json({ error: 'Parâmetros ausentes' });
    }
    
    if (texto_meditacao) {
      await dbRun(
        'UPDATE tb_matriz_diaria SET codigo_verbal = ?, versiculo_chave = ?, texto_reflexao = ?, texto_meditacao = ? WHERE dia_id = ?',
        [codigo_verbal, versiculo_chave, texto_reflexao, texto_meditacao, dia_id]
      );
    } else {
      await dbRun(
        'UPDATE tb_matriz_diaria SET codigo_verbal = ?, versiculo_chave = ?, texto_reflexao = ? WHERE dia_id = ?',
        [codigo_verbal, versiculo_chave, texto_reflexao, dia_id]
      );
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Iniciar cronômetro do checkpoint (Pedágio)
app.post('/api/v1/checkpoint/start', async (req, res) => {
  try {
    const now = Date.now();
    await dbRun('UPDATE tb_usuario_progresso SET checkpoint_started_at = ?, checkpoint_completado = 0', [now]);
    res.json({ success: true, startedAt: now });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sincronizar Checkpoint e Validar 12 segundos
app.post('/api/v1/sync-checkpoint', async (req, res) => {
  try {
    const user = await dbGet('SELECT * FROM tb_usuario_progresso LIMIT 1');
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    const now = Date.now();
    const elapsedSeconds = (now - user.checkpoint_started_at) / 1000;

    // Se o cronômetro não foi iniciado ou foi burlado
    if (user.checkpoint_started_at === 0 || elapsedSeconds < 11.5) { // Tolerância pequena de rede
      return res.status(400).json({
        success: false,
        error: 'Pedágio espiritual incompleto. Você deve meditar no código por no mínimo 12 segundos.'
      });
    }

    // Libera o acesso ao aplicativo e avança para o próximo dia no check-in subsequente
    await dbRun('UPDATE tb_usuario_progresso SET checkpoint_completado = 1, checkpoint_started_at = 0');
    res.json({ success: true, message: 'O Agora foi destravado com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Avançar de Dia (Só após completar o checkpoint anterior)
app.post('/api/v1/avancar-dia', async (req, res) => {
  try {
    const user = await dbGet('SELECT * FROM tb_usuario_progresso LIMIT 1');
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    if (user.checkpoint_completado !== 1) {
      return res.status(400).json({ error: 'Você precisa concluir o Pedágio Espiritual primeiro.' });
    }

    const proximoDia = user.dia_atual >= 365 ? 1 : user.dia_atual + 1;
    await dbRun('UPDATE tb_usuario_progresso SET dia_atual = ?, checkpoint_completado = 0, checkpoint_started_at = 0', [proximoDia]);

    const updatedUser = await dbGet('SELECT * FROM tb_usuario_progresso LIMIT 1');
    const updatedCode = await dbGet('SELECT * FROM tb_matriz_diaria WHERE dia_id = ?', [updatedUser.dia_atual]);
    res.json({ user: updatedUser, code: updatedCode });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reiniciar Jornada (Para testes)
app.post('/api/v1/reiniciar-jornada', async (req, res) => {
  try {
    await dbRun('UPDATE tb_usuario_progresso SET dia_atual = 1, checkpoint_completado = 0, checkpoint_started_at = 0');
    res.json({ success: true, message: 'Jornada resetada para o Dia 1' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- GESTÃO DE CONTATOS ----------------

app.get('/api/v1/contatos', async (req, res) => {
  try {
    const contatos = await dbAll('SELECT * FROM tb_contatos');
    // Desserializar logs de ações
    const parseContatos = contatos.map(c => ({
      ...c,
      prioritario: !!c.prioritario,
      historico_acoes: JSON.parse(c.historico_acoes || '[]')
    }));
    res.json(parseContatos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/v1/contatos', async (req, res) => {
  try {
    const { nome, relacao, prioritario } = req.body;
    const user = await dbGet('SELECT status_plano FROM tb_usuario_progresso LIMIT 1');
    
    // Validar limite de 3 contatos para plano Free
    if (user.status_plano === 'FREE') {
      const countRow = await dbGet('SELECT COUNT(*) as count FROM tb_contatos');
      if (countRow.count >= 3) {
        return res.status(403).json({
          error: 'Limite de 3 contatos atingido no plano Gratuito. Atualize para o Premium para contatos ilimitados!'
        });
      }
    }

    const priorityVal = prioritario ? 1 : 0;
    const result = await dbRun(
      'INSERT INTO tb_contatos (nome, relacao, prioritario, historico_acoes) VALUES (?, ?, ?, ?)',
      [nome, relacao, priorityVal, '[]']
    );

    res.json({ success: true, id: result.lastID });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Registrar ação (Check-in) de um convite
app.post('/api/v1/contatos/:id/acao', async (req, res) => {
  try {
    const { id } = req.params;
    const { tipoAcao } = req.body; // 'mensagem', 'cafe', 'casa_igreja'
    const contato = await dbGet('SELECT * FROM tb_contatos WHERE id = ?', [id]);
    
    if (!contato) return res.status(404).json({ error: 'Contato não encontrado' });

    const acoes = JSON.parse(contato.historico_acoes || '[]');
    const now = Date.now();
    acoes.push({ tipo: tipoAcao, timestamp: now });

    await dbRun(
      'UPDATE tb_contatos SET ultimo_convite_timestamp = ?, historico_acoes = ? WHERE id = ?',
      [now, JSON.stringify(acoes), id]
    );

    res.json({ success: true, ultimo_convite_timestamp: now, historico_acoes: acoes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deletar Contato
app.delete('/api/v1/contatos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await dbRun('DELETE FROM tb_contatos WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- HISTÓRICO DE CÓDIGOS (PREMIUM) ----------------

app.get('/api/v1/historico', async (req, res) => {
  try {
    const user = await dbGet('SELECT * FROM tb_usuario_progresso LIMIT 1');
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    const rows = await dbAll('SELECT * FROM tb_matriz_diaria WHERE dia_id <= ?', [user.dia_atual]);
    res.json({ rows, premium: user.status_plano === 'PREMIUM' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- BÍBLIA (NVI) ----------------

// Obter todos os livros
app.get('/api/v1/biblia/livros', async (req, res) => {
  try {
    const livros = await dbAll('SELECT DISTINCT livro_nome, livro_abrev FROM tb_biblia');
    res.json(livros);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obter total de capítulos de um livro
app.get('/api/v1/biblia/capitulos/:abrev', async (req, res) => {
  try {
    const { abrev } = req.params;
    const row = await dbGet('SELECT MAX(capitulo) as total FROM tb_biblia WHERE livro_abrev = ?', [abrev]);
    res.json({ total: row.total || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obter texto de um capítulo específico
app.get('/api/v1/biblia/texto/:abrev/:capitulo', async (req, res) => {
  try {
    const { abrev, capitulo } = req.params;
    const versiculos = await dbAll('SELECT * FROM tb_biblia WHERE livro_abrev = ? AND capitulo = ? ORDER BY versiculo ASC', [abrev, capitulo]);
    res.json(versiculos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Buscar versículos por palavra (Busca Livre)
app.get('/api/v1/biblia/busca', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 3) {
      return res.status(400).json({ error: 'Termo de busca deve ter pelo menos 3 caracteres.' });
    }
    const versiculos = await dbAll('SELECT * FROM tb_biblia WHERE texto LIKE ? LIMIT 50', [`%${q}%`]);
    res.json(versiculos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obter versículo aleatório
app.get('/api/v1/biblia/aleatorio', async (req, res) => {
  try {
    const versiculo = await dbGet('SELECT * FROM tb_biblia ORDER BY RANDOM() LIMIT 1');
    res.json(versiculo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obter URL do áudio de um capítulo da Bíblia (WordProject MP3 CDN)
app.get('/api/v1/biblia/audio/:abrev/:capitulo', async (req, res) => {
  try {
    const { abrev, capitulo } = req.params;
    
    // Os 66 livros da Bíblia na ordem exata (1 a 66)
    const ordemLivros = [
      'gn', 'ex', 'lv', 'nm', 'dt', 'js', 'jz', 'rt', '1sm', '2sm', 
      '1rs', '2rs', '1cr', '2cr', 'ed', 'ne', 'et', 'jó', 'sl', 'pv', 
      'ec', 'ct', 'is', 'jr', 'lm', 'ez', 'dn', 'os', 'jl', 'am', 
      'ob', 'jn', 'mq', 'na', 'hc', 'sf', 'ag', 'zc', 'ml', 'mt', 'mc', 
      'lc', 'jo', 'atos', 'rm', '1co', '2co', 'gl', 'ef', 'fp', 'cl', 
      '1ts', '2ts', '1tm', '2tm', 'tt', 'fm', 'hb', 'tg', '1pe', '2pe', 
      '1jo', '2jo', '3jo', 'jd', 'ap'
    ];
    
    const englishBooks = [
      "genesis", "exodus", "leviticus", "numbers", "deuteronomy", "joshua", "judges", "ruth",
      "1samuel", "2samuel", "1kings", "2kings", "1chronicles", "2chronicles", "ezra", "nehemiah",
      "esther", "job", "psalms", "proverbs", "ecclesiastes", "songofsolomon", "isaiah", "jeremiah",
      "lamentations", "ezekiel", "daniel", "hosea", "joel", "amos", "obadiah", "jonah", "micah",
      "nahum", "habakkuk", "zephaniah", "haggai", "zechariah", "malachi", "matthew", "mark",
      "luke", "john", "acts", "romans", "1corinthians", "2corinthians", "galatians", "ephesians",
      "philippians", "colossians", "1thessalonians", "2thessalonians", "1timothy", "2timothy",
      "titus", "philemon", "hebrews", "james", "1peter", "2peter", "1john", "2john", "3john",
      "jude", "revelation"
    ];
    
    let searchAbrev = abrev.toLowerCase();
    if (searchAbrev === 'job') searchAbrev = 'jó';
    if (searchAbrev === 'at') searchAbrev = 'atos';
    
    let index = ordemLivros.indexOf(searchAbrev);
    if (index === -1) {
      return res.status(404).json({ error: 'Livro não suportado para áudio' });
    }
    
    const bookName = englishBooks[index];
    const capNumero = String(capitulo).padStart(3, '0');
    const audioUrl = `https://beblia.bible:81/BibleAudio/portuguese/${bookName}/${capNumero}.mp3`;
    
    res.json({ url: audioUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obter termos e significados do dicionário teológico
app.get('/api/v1/dicionario/termos', async (req, res) => {
  try {
    const termos = await dbAll('SELECT * FROM tb_dicionario');
    // Retorna como objeto chave-valor para facilitar o parse no frontend
    const dicMap = {};
    termos.forEach(t => {
      dicMap[t.termo.toLowerCase()] = t.significado;
    });
    res.json(dicMap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar todas as trilhas temáticas disponíveis
app.get('/api/v1/trilhas/lista', async (req, res) => {
  try {
    const trilhas = await dbAll('SELECT DISTINCT tema FROM tb_trilhas');
    res.json(trilhas.map(t => t.tema));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Iniciar uma trilha de crescimento
app.post('/api/v1/trilhas/iniciar', async (req, res) => {
  try {
    const { tema } = req.body;
    if (!tema) return res.status(400).json({ error: 'Tema da trilha é obrigatório' });
    
    await dbRun('UPDATE tb_usuario_trilha_progresso SET trilha_ativa = ?, dia_progresso = 1, atualizado_em = ?', [tema, Date.now()]);
    res.json({ success: true, tema, dia_progresso: 1 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cancelar/Finalizar a trilha ativa
app.post('/api/v1/trilhas/cancelar', async (req, res) => {
  try {
    await dbRun('UPDATE tb_usuario_trilha_progresso SET trilha_ativa = NULL, dia_progresso = 1');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obter dados da trilha ativa e conteúdo do dia atual dela
app.get('/api/v1/trilhas/ativa', async (req, res) => {
  try {
    const progresso = await dbGet('SELECT * FROM tb_usuario_trilha_progresso LIMIT 1');
    if (!progresso || !progresso.trilha_ativa) {
      return res.json({ ativa: false });
    }
    
    const conteudo = await dbGet(
      'SELECT * FROM tb_trilhas WHERE tema = ? AND dia_trilha = ?', 
      [progresso.trilha_ativa, progresso.dia_progresso]
    );
    
    res.json({
      ativa: true,
      tema: progresso.trilha_ativa,
      dia_progresso: progresso.dia_progresso,
      conteudo
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Completar dia da trilha e avançar
app.post('/api/v1/trilhas/completar-dia', async (req, res) => {
  try {
    const progresso = await dbGet('SELECT * FROM tb_usuario_trilha_progresso LIMIT 1');
    if (!progresso || !progresso.trilha_ativa) {
      return res.status(400).json({ error: 'Nenhuma trilha ativa no momento' });
    }
    
    const novoDia = progresso.dia_progresso + 1;
    
    if (novoDia > 30) {
      // Concluiu a trilha inteira!
      await dbRun('UPDATE tb_usuario_trilha_progresso SET trilha_ativa = NULL, dia_progresso = 1');
      res.json({ success: true, concluida: true });
    } else {
      await dbRun(
        'UPDATE tb_usuario_trilha_progresso SET dia_progresso = ?, atualizado_em = ?', 
        [novoDia, Date.now()]
      );
      res.json({ success: true, concluida: false, novoDia });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- INTEGRACAO MERCADO PAGO ----------------

// Criação de Preferência de Pagamento
app.post('/api/v1/pagamentos/criar-preferencia', async (req, res) => {
  try {
    const preferenceId = `pref_1convite_${Math.random().toString(36).substr(2, 9)}`;
    res.json({
      preferenceId,
      checkoutUrl: `/simular-pagamento?pref_id=${preferenceId}`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Webhook para Ativação Premium (IPN / Webhook do Mercado Pago)
app.post('/api/v1/pagamentos/webhook', async (req, res) => {
  try {
    const { action, data, pref_id } = req.body;
    await dbRun('UPDATE tb_usuario_progresso SET status_plano = "PREMIUM"');
    res.json({ success: true, message: 'Plano ativado para PREMIUM via webhook do Mercado Pago!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint extra para alterar o plano manualmente nos testes
app.post('/api/v1/admin/definir-plano', async (req, res) => {
  try {
    const { plano } = req.body;
    await dbRun('UPDATE tb_usuario_progresso SET status_plano = ?', [plano]);
    res.json({ success: true, plano });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Servir arquivos estáticos do React em produção
const distPath = join(__dirname, '../dist');
app.use(express.static(distPath));

app.get(/.*/, (req, res) => {
  res.sendFile(join(distPath, 'index.html'));
});

// Inicia o Servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
