import * as SQLite from 'expo-sqlite';

let dbInstance = null;

export const getDatabase = async () => {
  if (dbInstance) return dbInstance;

  const db = await SQLite.openDatabaseAsync('meuapp.db');

  await db.execAsync('PRAGMA journal_mode = WAL;');

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      sexo TEXT DEFAULT '',
      email TEXT DEFAULT '',
      cep TEXT DEFAULT '',
      rua TEXT DEFAULT '',
      numero TEXT DEFAULT '',
      complemento TEXT DEFAULT '',
      bairro TEXT DEFAULT '',
      cidade TEXT DEFAULT '',
      estado TEXT DEFAULT '',
      dataCadastro TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS compras (
      id TEXT PRIMARY KEY,
      produtoId TEXT NOT NULL,
      nomeProduto TEXT NOT NULL,
      preco REAL NOT NULL,
      usuarioId TEXT DEFAULT '',
      nomeUsuario TEXT DEFAULT 'Anônimo',
      dataCompra TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS avaliacoes (
      id TEXT PRIMARY KEY,
      produtoId TEXT NOT NULL,
      nomeProduto TEXT NOT NULL,
      estrelas INTEGER NOT NULL,
      comentario TEXT DEFAULT '',
      data TEXT DEFAULT ''
    );
  `);

  dbInstance = db;
  return db;
};
