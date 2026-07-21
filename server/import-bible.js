import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
    process.exit(1);
  }
});

const dbRun = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const BIBLE_URL = 'https://raw.githubusercontent.com/thiagobodruk/bible/master/json/pt_nvi.json';

const downloadBible = () => {
  return new Promise((resolve, reject) => {
    console.log('Baixando JSON da Bíblia (NVI)...');
    https.get(BIBLE_URL, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          // Remove BOM se existir
          if (data.charCodeAt(0) === 0xFEFF) {
            data = data.slice(1);
          }
          resolve(JSON.parse(data));
        } catch (e) {
          reject('Erro ao fazer parse do JSON: ' + e.message);
        }
      });
    }).on('error', err => reject(err));
  });
};

const importBible = async () => {
  try {
    const bibleData = await downloadBible();
    console.log(`Bíblia baixada com sucesso. Total de livros: ${bibleData.length}`);

    await dbRun(`
      CREATE TABLE IF NOT EXISTS tb_biblia (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        livro_nome TEXT NOT NULL,
        livro_abrev TEXT NOT NULL,
        capitulo INTEGER NOT NULL,
        versiculo INTEGER NOT NULL,
        texto TEXT NOT NULL
      )
    `);

    // Limpa a tabela se já existir
    await dbRun('DELETE FROM tb_biblia');

    console.log('Inserindo versículos...');
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      
      const stmt = db.prepare('INSERT INTO tb_biblia (livro_nome, livro_abrev, capitulo, versiculo, texto) VALUES (?, ?, ?, ?, ?)');
      
      let count = 0;
      for (const book of bibleData) {
        const bookName = book.name;
        const bookAbbrev = book.abbrev;
        
        book.chapters.forEach((chapter, chapterIndex) => {
          const capituloNum = chapterIndex + 1;
          
          chapter.forEach((verseText, verseIndex) => {
            const versiculoNum = verseIndex + 1;
            stmt.run([bookName, bookAbbrev, capituloNum, versiculoNum, verseText]);
            count++;
          });
        });
      }
      
      stmt.finalize();
      db.run('COMMIT', () => {
        console.log(`✅ Importação concluída com sucesso! ${count} versículos inseridos.`);
        db.close();
      });
    });

  } catch (err) {
    console.error('Erro na importação:', err);
    db.close();
  }
};

importBible();
