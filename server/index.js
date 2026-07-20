import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

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
      url_audio_meditacao TEXT NOT NULL
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS tb_usuario_progresso (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      dia_atual INTEGER DEFAULT 1,
      checkpoint_completado INTEGER DEFAULT 0,
      checkpoint_started_at INTEGER DEFAULT 0,
      status_plano TEXT DEFAULT 'FREE'
    )
  `);

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
    await dbRun('INSERT INTO tb_usuario_progresso (dia_atual, checkpoint_completado, status_plano) VALUES (1, 0, "FREE")');
  }

  // Preenche a tabela tb_matriz_diaria se estiver vazia
  const countRow = await dbGet('SELECT COUNT(*) as count FROM tb_matriz_diaria');
  if (countRow.count === 0) {
    console.log('Populando tabela de 365 dias...');
    const reais = [
      {
        dia_id: 1,
        pilar_origem: 'PROPÓSITO_M2414',
        codigo_verbal: 'Código 01: O Reino começa no quintal da sua casa.',
        versiculo_chave: 'E este evangelho do reino será pregado em todo o mundo como testemunho a todas as nações, então, virá o fim. - Mateus 24:14',
        texto_reflexao: 'O evangelismo eficaz não começa em outra nação, mas no próximo contato que você fizer hoje. Note quem está ao seu redor no agora de Deus e faça uma conexão real.',
        url_audio_meditacao: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
      },
      {
        dia_id: 2,
        pilar_origem: 'RECOMPENSA_AP321',
        codigo_verbal: 'Código 02: Desfrute da vitória que você não teve que conquistar.',
        versiculo_chave: 'Ao vencedor darei o direito de sentar-se comigo em meu trono, assim como eu também venci e sentei-me com meu Pai em seu trono. - Apocalipse 3:21',
        texto_reflexao: 'A ansiedade morre quando você entende que a batalha principal já foi ganha. Você não trabalha para ser aceito, mas opera a partir da vitória consumada. Descanse nesse sábado eterno.',
        url_audio_meditacao: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
      },
      {
        dia_id: 3,
        pilar_origem: 'PROPÓSITO_M2414',
        codigo_verbal: 'Código 03: Pague um café para comprar um tempo de atenção.',
        versiculo_chave: 'Ninguém tem maior amor do que este: de dar alguém a própria vida pelos seus amigos. - João 15:13',
        texto_reflexao: 'Um convite intencional demonstra valor. Pagar um café ou dedicar 15 minutos para ouvir alguém genuinamente é doar um fragmento da sua vida pelo outro.',
        url_audio_meditacao: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
      },
      {
        dia_id: 4,
        pilar_origem: 'RECOMPENSA_AP321',
        codigo_verbal: 'Código 04: A pressa é uma mentira que tenta roubar a sua eternidade.',
        versiculo_chave: 'Portanto, resta ainda um descanso sabático para o povo de Deus. - Hebreus 4:9',
        texto_reflexao: 'A pressa e o ativismo tentam nos convencer de que nosso valor vem da nossa produtividade. Acalme o seu coração no Agora. Respire fundo, e sinta o repouso divino de Apocalipse 3:21.',
        url_audio_meditacao: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
      },
      {
        dia_id: 5,
        pilar_origem: 'PROPÓSITO_M2414',
        codigo_verbal: 'Código 05: A conexão real vence o algoritmo digital.',
        versiculo_chave: 'E não nos cansemos de fazer o bem, pois no tempo próprio colheremos, se não desanimarmos. - Gálatas 6:9',
        texto_reflexao: 'Substitua 10 minutos de feed infinito por uma mensagem direcionada a um amigo ou familiar que você não vê há tempos. Um convite sincero é uma semente do Reino.',
        url_audio_meditacao: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
      },
      {
        dia_id: 6,
        pilar_origem: 'RECOMPENSA_AP321',
        codigo_verbal: 'Código 06: Sentar no trono exige aprender a descansar.',
        versiculo_chave: 'Na tranquilidade e na confiança está a vossa força. - Isaías 30:15',
        texto_reflexao: 'Os governantes do Reino não andam ansiosos ou apressados. Eles confiam na soberania e descansam em Deus. Encontre a força do governo próprio no desfrute espiritual.',
        url_audio_meditacao: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3'
      },
      {
        dia_id: 7,
        pilar_origem: 'PROPÓSITO_M2414',
        codigo_verbal: 'Código 07: O Reino é construído sobre mesas e refeições.',
        versiculo_chave: 'E eles, perseverando unânimes todos os dias no templo, e partindo o pão em casa, comiam juntos com alegria e singeleza de coração. - Atos 2:46',
        texto_reflexao: 'Abra a porta da sua casa ou convide alguém para uma refeição. A comunhão de mesa é o método mais poderoso de pregar o evangelho de Mateus 24:14 no dia a dia.',
        url_audio_meditacao: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3'
      }
    ];

    // Gerador programático dos outros 358 dias
    for (let i = 1; i <= 365; i++) {
      const realDay = reais.find(r => r.dia_id === i);
      if (realDay) {
        await dbRun(
          'INSERT INTO tb_matriz_diaria (dia_id, pilar_origem, codigo_verbal, versiculo_chave, texto_reflexao, url_audio_meditacao) VALUES (?, ?, ?, ?, ?, ?)',
          [realDay.dia_id, realDay.pilar_origem, realDay.codigo_verbal, realDay.versiculo_chave, realDay.texto_reflexao, realDay.url_audio_meditacao]
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
        const audio = `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${(i % 15) + 1}.mp3`;

        await dbRun(
          'INSERT INTO tb_matriz_diaria (dia_id, pilar_origem, codigo_verbal, versiculo_chave, texto_reflexao, url_audio_meditacao) VALUES (?, ?, ?, ?, ?, ?)',
          [i, pilar, codigo, versiculo, reflexao, audio]
        );
      }
    }
    console.log('Matriz diária populada com sucesso!');
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
