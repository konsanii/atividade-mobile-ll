// Serviço de acesso ao banco de dados SQLite
// Usa async/await para todas as operações

import { getDatabase } from './database';

// ─── Usuários ─────────────────────────────────────────────────

export const salvarUsuario = async (usuario) => {
  const db = await getDatabase();
  const id = Date.now().toString();
  const dataCadastro = new Date().toLocaleDateString('pt-BR');

  await db.runAsync(
    `INSERT INTO usuarios
       (id, nome, sexo, email, cep, rua, numero, complemento, bairro, cidade, estado, dataCadastro)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      usuario.nome ?? '',
      usuario.sexo ?? '',
      usuario.email ?? '',
      usuario.cep ?? '',
      usuario.rua ?? '',
      usuario.numero ?? '',
      usuario.complemento ?? '',
      usuario.bairro ?? '',
      usuario.cidade ?? '',
      usuario.estado ?? '',
      dataCadastro,
    ]
  );

  return { id, ...usuario, dataCadastro };
};

export const obterTodosUsuarios = async () => {
  const db = await getDatabase();
  return await db.getAllAsync('SELECT * FROM usuarios ORDER BY rowid DESC');
};

export const deletarUsuario = async (id) => {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM usuarios WHERE id = ?', [id]);
};

export const atualizarUsuario = async (id, dados) => {
  const db = await getDatabase();
  await db.runAsync(
    `UPDATE usuarios
     SET nome = ?, email = ?, numero = ?, complemento = ?
     WHERE id = ?`,
    [dados.nome ?? '', dados.email ?? '', dados.numero ?? '', dados.complemento ?? '', id]
  );
};

export const limparTodos = async () => {
  const db = await getDatabase();
  await db.execAsync('DELETE FROM usuarios');
};

// ─── Compras ──────────────────────────────────────────────────

export const salvarCompra = async (compra) => {
  const db = await getDatabase();
  const id = Date.now().toString();
  const dataCompra = new Date().toLocaleDateString('pt-BR');

  await db.runAsync(
    `INSERT INTO compras (id, produtoId, nomeProduto, preco, usuarioId, nomeUsuario, dataCompra)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      compra.produtoId,
      compra.nomeProduto,
      compra.preco,
      compra.usuarioId ?? '',
      compra.nomeUsuario ?? 'Anônimo',
      dataCompra,
    ]
  );

  return { id, ...compra, dataCompra };
};

export const obterCompras = async () => {
  const db = await getDatabase();
  return await db.getAllAsync('SELECT * FROM compras ORDER BY rowid DESC');
};

// ─── Avaliações ───────────────────────────────────────────────

export const salvarAvaliacao = async (avaliacao) => {
  const db = await getDatabase();
  const id = Date.now().toString();
  const data = new Date().toLocaleDateString('pt-BR');

  await db.runAsync(
    `INSERT INTO avaliacoes (id, produtoId, nomeProduto, estrelas, comentario, data)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      id,
      avaliacao.produtoId,
      avaliacao.nomeProduto,
      avaliacao.estrelas,
      avaliacao.comentario ?? '',
      data,
    ]
  );

  return { id, ...avaliacao, data };
};

export const obterAvaliacoes = async () => {
  const db = await getDatabase();
  return await db.getAllAsync('SELECT * FROM avaliacoes ORDER BY rowid DESC');
};

