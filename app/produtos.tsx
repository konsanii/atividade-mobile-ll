import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { salvarCompra, obterCompras, obterTodosUsuarios } from '../src/utils/storageService';

const PRODUTOS = [
  { id: '1', nome: 'Tênis Esportivo', preco: 189.90, categoria: 'Calçados', emoji: '👟', descricao: 'Confortável para corrida e caminhada' },
  { id: '2', nome: 'Camiseta Polo', preco: 79.90, categoria: 'Vestuário', emoji: '👕', descricao: 'Algodão premium, diversas cores' },
  { id: '3', nome: 'Notebook', preco: 2499.90, categoria: 'Tecnologia', emoji: '💻', descricao: 'Core i5, 8GB RAM, 256GB SSD' },
  { id: '4', nome: 'Fone Bluetooth', preco: 149.90, categoria: 'Tecnologia', emoji: '🎧', descricao: 'Cancelamento de ruído, 30h bateria' },
  { id: '5', nome: 'Mochila', preco: 119.90, categoria: 'Acessórios', emoji: '🎒', descricao: 'Impermeável, 30 litros' },
  { id: '6', nome: 'Relógio Smart', preco: 349.90, categoria: 'Acessórios', emoji: '⌚', descricao: 'Monitor cardíaco, GPS' },
  { id: '7', nome: 'Livro React Native', preco: 89.90, categoria: 'Livros', emoji: '📚', descricao: 'Do zero ao avançado' },
  { id: '8', nome: 'Garrafa Térmica', preco: 59.90, categoria: 'Casa', emoji: '🧴', descricao: 'Mantém temperatura por 12h' },
  { id: '9', nome: 'Mouse sem fio', preco: 99.90, categoria: 'Tecnologia', emoji: '🖱️', descricao: 'Ergonômico, 2.4GHz' },
  { id: '10', nome: 'Óculos de Sol', preco: 199.90, categoria: 'Acessórios', emoji: '🕶️', descricao: 'Proteção UV400' },
];

interface Compra {
  id: string;
  produtoId: string;
  nomeProduto: string;
  preco: number;
  usuarioId?: string;
  nomeUsuario?: string;
  dataCompra: string;
}

interface Usuario {
  id: string;
  nome: string;
}

export default function ProdutosScreen() {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<typeof PRODUTOS[0] | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState<'produtos' | 'pedidos'>('produtos');

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [comprasCarregadas, usuariosCarregados] = await Promise.all([
        obterCompras(),
        obterTodosUsuarios(),
      ]);
      setCompras(comprasCarregadas as Compra[]);
      setUsuarios(usuariosCarregados as Usuario[]);
    } catch (erro) {
      console.error(erro);
    }
  };

  const handleComprar = (produto: typeof PRODUTOS[0]) => {
    setProdutoSelecionado(produto);
    setModalVisivel(true);
  };

  const confirmarCompra = async (usuario?: Usuario) => {
    if (!produtoSelecionado) return;
    setCarregando(true);
    try {
      await salvarCompra({
        produtoId: produtoSelecionado.id,
        nomeProduto: produtoSelecionado.nome,
        preco: produtoSelecionado.preco,
        usuarioId: usuario?.id,
        nomeUsuario: usuario?.nome ?? 'Anônimo',
      });
      setModalVisivel(false);
      await carregarDados();
      Alert.alert('✅ Compra realizada!', `${produtoSelecionado.nome} adicionado ao histórico.`);
    } catch (erro) {
      Alert.alert('Erro', (erro as Error).message);
    } finally {
      setCarregando(false);
    }
  };

  const contarComprasProduto = (produtoId: string) =>
    compras.filter(c => c.produtoId === produtoId).length;

  const renderProduto = ({ item }: { item: typeof PRODUTOS[0] }) => {
    const qtdCompras = contarComprasProduto(item.id);
    return (
      <View style={styles.cartaoProduto}>
        <View style={styles.emojiContainer}>
          <Text style={styles.emoji}>{item.emoji}</Text>
        </View>
        <View style={styles.infoProduto}>
          <View style={styles.linhaTopo}>
            <Text style={styles.nomeProduto}>{item.nome}</Text>
            <Text style={styles.categoriaBadge}>{item.categoria}</Text>
          </View>
          <Text style={styles.descricaoProduto}>{item.descricao}</Text>
          <View style={styles.rodapeProduto}>
            <Text style={styles.precoProduto}>
              R$ {item.preco.toFixed(2).replace('.', ',')}
            </Text>
            <View style={styles.acoesProduto}>
              {qtdCompras > 0 && (
                <Text style={styles.qtdCompras}>{qtdCompras}x vendido</Text>
              )}
              <TouchableOpacity
                style={styles.botaoComprar}
                onPress={() => handleComprar(item)}
              >
                <Text style={styles.textoComprar}>Comprar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderPedido = ({ item }: { item: Compra }) => (
    <View style={styles.cartaoPedido}>
      <Text style={styles.pedidoEmoji}>
        {PRODUTOS.find(p => p.id === item.produtoId)?.emoji ?? '📦'}
      </Text>
      <View style={styles.infoPedido}>
        <Text style={styles.nomePedido}>{item.nomeProduto}</Text>
        <Text style={styles.usuarioPedido}>👤 {item.nomeUsuario}</Text>
        <View style={styles.rodapePedido}>
          <Text style={styles.precoPedido}>
            R$ {item.preco.toFixed(2).replace('.', ',')}
          </Text>
          <Text style={styles.dataPedido}>{item.dataCompra}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Abas internas */}
      <View style={styles.abasContainer}>
        <TouchableOpacity
          style={[styles.aba, abaAtiva === 'produtos' && styles.abaAtiva]}
          onPress={() => setAbaAtiva('produtos')}
        >
          <Text style={[styles.textoAba, abaAtiva === 'produtos' && styles.textoAbaAtivo]}>
            🛍️ Produtos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.aba, abaAtiva === 'pedidos' && styles.abaAtiva]}
          onPress={() => setAbaAtiva('pedidos')}
        >
          <Text style={[styles.textoAba, abaAtiva === 'pedidos' && styles.textoAbaAtivo]}>
            📦 Pedidos ({compras.length})
          </Text>
        </TouchableOpacity>
      </View>

      {abaAtiva === 'produtos' ? (
        <FlatList
          data={PRODUTOS}
          renderItem={renderProduto}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.lista}
        />
      ) : compras.length === 0 ? (
        <View style={styles.vazio}>
          <Text style={styles.vazioEmoji}>📦</Text>
          <Text style={styles.vazioTexto}>Nenhum pedido ainda</Text>
          <Text style={styles.vazioSub}>Compre um produto para ver aqui</Text>
        </View>
      ) : (
        <FlatList
          data={[...compras].reverse()}
          renderItem={renderPedido}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.lista}
        />
      )}

      {/* Modal de seleção de usuário */}
      <Modal visible={modalVisivel} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>
              {produtoSelecionado?.emoji} {produtoSelecionado?.nome}
            </Text>
            <Text style={styles.modalPreco}>
              R$ {produtoSelecionado?.preco.toFixed(2).replace('.', ',')}
            </Text>
            <Text style={styles.modalPergunta}>Comprar como qual usuário?</Text>
            <ScrollView style={{ maxHeight: 200 }}>
              {usuarios.map(u => (
                <TouchableOpacity
                  key={u.id}
                  style={styles.usuarioOpcao}
                  onPress={() => confirmarCompra(u)}
                  disabled={carregando}
                >
                  <Text style={styles.usuarioOpcaoTexto}>👤 {u.nome}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.usuarioOpcao, styles.opcaoAnonimo]}
                onPress={() => confirmarCompra()}
                disabled={carregando}
              >
                <Text style={styles.usuarioOpcaoTexto}>👻 Comprar sem usuário</Text>
              </TouchableOpacity>
            </ScrollView>
            <TouchableOpacity
              style={styles.botaoCancelar}
              onPress={() => setModalVisivel(false)}
            >
              <Text style={styles.textoCancelar}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  abasContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  aba: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  abaAtiva: {
    borderBottomWidth: 2,
    borderBottomColor: '#0066cc',
  },
  textoAba: { fontSize: 13, color: '#999', fontWeight: '500' },
  textoAbaAtivo: { color: '#0066cc', fontWeight: '700' },
  lista: { padding: 15, paddingBottom: 30 },
  cartaoProduto: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 14,
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  emojiContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  emoji: { fontSize: 28 },
  infoProduto: { flex: 1 },
  linhaTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nomeProduto: { fontSize: 15, fontWeight: '700', color: '#222', flex: 1, marginRight: 8 },
  categoriaBadge: {
    fontSize: 10,
    color: '#0066cc',
    backgroundColor: '#e8f0fe',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    fontWeight: '600',
  },
  descricaoProduto: { fontSize: 12, color: '#888', marginBottom: 8 },
  rodapeProduto: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  precoProduto: { fontSize: 16, fontWeight: '800', color: '#28a745' },
  acoesProduto: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtdCompras: { fontSize: 11, color: '#999' },
  botaoComprar: {
    backgroundColor: '#0066cc',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  textoComprar: { color: '#fff', fontSize: 13, fontWeight: '600' },
  cartaoPedido: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  pedidoEmoji: { fontSize: 32, marginRight: 12 },
  infoPedido: { flex: 1 },
  nomePedido: { fontSize: 15, fontWeight: '700', color: '#222', marginBottom: 2 },
  usuarioPedido: { fontSize: 12, color: '#555', marginBottom: 6 },
  rodapePedido: { flexDirection: 'row', justifyContent: 'space-between' },
  precoPedido: { fontSize: 14, fontWeight: '700', color: '#28a745' },
  dataPedido: { fontSize: 11, color: '#aaa' },
  vazio: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  vazioEmoji: { fontSize: 56, marginBottom: 12 },
  vazioTexto: { fontSize: 17, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  vazioSub: { fontSize: 13, color: '#999' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
  modalTitulo: { fontSize: 18, fontWeight: '700', color: '#222', marginBottom: 4 },
  modalPreco: { fontSize: 20, fontWeight: '800', color: '#28a745', marginBottom: 16 },
  modalPergunta: { fontSize: 14, color: '#666', marginBottom: 12 },
  usuarioOpcao: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    marginBottom: 8,
  },
  opcaoAnonimo: { backgroundColor: '#fff3e0' },
  usuarioOpcaoTexto: { fontSize: 14, color: '#333', fontWeight: '500' },
  botaoCancelar: {
    marginTop: 8,
    padding: 14,
    alignItems: 'center',
  },
  textoCancelar: { fontSize: 14, color: '#e53e3e', fontWeight: '600' },
});
