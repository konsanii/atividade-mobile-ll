import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { salvarAvaliacao, obterAvaliacoes } from '../src/utils/storageService';

const PRODUTOS = [
  { id: '1', nome: 'Tênis Esportivo', emoji: '👟', categoria: 'Calçados' },
  { id: '2', nome: 'Camiseta Polo', emoji: '👕', categoria: 'Vestuário' },
  { id: '3', nome: 'Notebook', emoji: '💻', categoria: 'Tecnologia' },
  { id: '4', nome: 'Fone Bluetooth', emoji: '🎧', categoria: 'Tecnologia' },
  { id: '5', nome: 'Mochila', emoji: '🎒', categoria: 'Acessórios' },
  { id: '6', nome: 'Relógio Smart', emoji: '⌚', categoria: 'Acessórios' },
  { id: '7', nome: 'Livro React Native', emoji: '📚', categoria: 'Livros' },
  { id: '8', nome: 'Garrafa Térmica', emoji: '🧴', categoria: 'Casa' },
  { id: '9', nome: 'Mouse sem fio', emoji: '🖱️', categoria: 'Tecnologia' },
  { id: '10', nome: 'Óculos de Sol', emoji: '🕶️', categoria: 'Acessórios' },
];

interface Avaliacao {
  id: string;
  produtoId: string;
  nomeProduto: string;
  estrelas: number;
  comentario: string;
  data: string;
}

function Estrelas({ total, tamanho = 16, onPress }: { total: number; tamanho?: number; onPress?: (n: number) => void }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <TouchableOpacity
          key={n}
          onPress={() => onPress?.(n)}
          disabled={!onPress}
          activeOpacity={onPress ? 0.6 : 1}
        >
          <Text style={{ fontSize: tamanho, color: n <= total ? '#f5a623' : '#ddd' }}>★</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function AvaliacoesScreen() {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<typeof PRODUTOS[0] | null>(null);
  const [estrelasModal, setEstrelasModal] = useState(0);
  const [comentarioModal, setComentarioModal] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [produtoExpandido, setProdutoExpandido] = useState<string | null>(null);

  useEffect(() => {
    carregarAvaliacoes();
  }, []);

  const carregarAvaliacoes = async () => {
    try {
      const dados = await obterAvaliacoes();
      setAvaliacoes(dados as Avaliacao[]);
    } catch (erro) {
      console.error(erro);
    }
  };

  const abrirModal = (produto: typeof PRODUTOS[0]) => {
    setProdutoSelecionado(produto);
    setEstrelasModal(0);
    setComentarioModal('');
    setModalVisivel(true);
  };

  const handleSalvar = async () => {
    if (!produtoSelecionado) return;
    if (estrelasModal === 0) {
      Alert.alert('Atenção', 'Selecione pelo menos 1 estrela.');
      return;
    }
    setSalvando(true);
    try {
      await salvarAvaliacao({
        produtoId: produtoSelecionado.id,
        nomeProduto: produtoSelecionado.nome,
        estrelas: estrelasModal,
        comentario: comentarioModal.trim(),
      });
      setModalVisivel(false);
      await carregarAvaliacoes();
      Alert.alert('✅ Obrigado!', 'Sua avaliação foi salva.');
    } catch (erro) {
      Alert.alert('Erro', (erro as Error).message);
    } finally {
      setSalvando(false);
    }
  };

  const getAvaliacoesProduto = (produtoId: string) =>
    avaliacoes.filter(a => a.produtoId === produtoId);

  const getMediaEstrelas = (produtoId: string) => {
    const lista = getAvaliacoesProduto(produtoId);
    if (lista.length === 0) return 0;
    return lista.reduce((soma, a) => soma + a.estrelas, 0) / lista.length;
  };

  const renderProduto = ({ item }: { item: typeof PRODUTOS[0] }) => {
    const avalProduto = getAvaliacoesProduto(item.id);
    const media = getMediaEstrelas(item.id);
    const expandido = produtoExpandido === item.id;

    return (
      <View style={styles.cartao}>
        <TouchableOpacity
          style={styles.cabecalhoProduto}
          onPress={() => setProdutoExpandido(expandido ? null : item.id)}
          activeOpacity={0.7}
        >
          <View style={styles.emojiBox}>
            <Text style={styles.emoji}>{item.emoji}</Text>
          </View>
          <View style={styles.infoCabecalho}>
            <Text style={styles.nomeProduto}>{item.nome}</Text>
            <Text style={styles.categoriaProduto}>{item.categoria}</Text>
            {avalProduto.length > 0 ? (
              <View style={styles.linhaMedia}>
                <Estrelas total={Math.round(media)} tamanho={14} />
                <Text style={styles.textoMedia}>
                  {media.toFixed(1)} ({avalProduto.length} avaliação{avalProduto.length !== 1 ? 'ões' : ''})
                </Text>
              </View>
            ) : (
              <Text style={styles.semAvaliacao}>Sem avaliações</Text>
            )}
          </View>
          <View style={styles.acoesDir}>
            <TouchableOpacity
              style={styles.botaoAvaliar}
              onPress={() => abrirModal(item)}
            >
              <Text style={styles.textoBotaoAvaliar}>⭐ Avaliar</Text>
            </TouchableOpacity>
            <Text style={styles.setaExpand}>{expandido ? '▲' : '▼'}</Text>
          </View>
        </TouchableOpacity>

        {expandido && (
          <View style={styles.listaReviews}>
            {avalProduto.length === 0 ? (
              <Text style={styles.semReviews}>Seja o primeiro a avaliar!</Text>
            ) : (
              [...avalProduto].reverse().map(av => (
                <View key={av.id} style={styles.reviewItem}>
                  <View style={styles.reviewTopo}>
                    <Estrelas total={av.estrelas} tamanho={13} />
                    <Text style={styles.reviewData}>{av.data}</Text>
                  </View>
                  {av.comentario ? (
                    <Text style={styles.reviewComentario}>"{av.comentario}"</Text>
                  ) : null}
                </View>
              ))
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Resumo geral */}
      <View style={styles.resumo}>
        <Text style={styles.resumoTexto}>
          {avaliacoes.length} avaliação{avaliacoes.length !== 1 ? 'ões' : ''} no total
        </Text>
      </View>

      <FlatList
        data={PRODUTOS}
        renderItem={renderProduto}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.lista}
      />

      {/* Modal avaliação */}
      <Modal visible={modalVisivel} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>
              Avaliar {produtoSelecionado?.emoji} {produtoSelecionado?.nome}
            </Text>

            <Text style={styles.labelModal}>Sua nota:</Text>
            <View style={styles.estrelasModal}>
              <Estrelas total={estrelasModal} tamanho={36} onPress={setEstrelasModal} />
            </View>
            {estrelasModal > 0 && (
              <Text style={styles.textoEstrela}>
                {['', 'Ruim', 'Regular', 'Bom', 'Muito bom', 'Excelente!'][estrelasModal]}
              </Text>
            )}

            <Text style={styles.labelModal}>Comentário (opcional):</Text>
            <TextInput
              style={styles.inputComentario}
              placeholder="O que você achou do produto?"
              value={comentarioModal}
              onChangeText={setComentarioModal}
              multiline
              numberOfLines={3}
              maxLength={300}
            />

            <TouchableOpacity
              style={[styles.botaoSalvar, estrelasModal === 0 && styles.botaoDesabilitado]}
              onPress={handleSalvar}
              disabled={salvando || estrelasModal === 0}
            >
              <Text style={styles.textoBotaoSalvar}>
                {salvando ? 'Salvando...' : 'Enviar Avaliação'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisivel(false)} style={styles.botaoCancelar}>
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
  resumo: {
    backgroundColor: '#fff7e0',
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ffe0b2',
  },
  resumoTexto: { fontSize: 13, color: '#e65100', fontWeight: '600' },
  lista: { padding: 14, paddingBottom: 30 },
  cartao: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    overflow: 'hidden',
  },
  cabecalhoProduto: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  emojiBox: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#fff9e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  emoji: { fontSize: 24 },
  infoCabecalho: { flex: 1 },
  nomeProduto: { fontSize: 14, fontWeight: '700', color: '#222', marginBottom: 2 },
  categoriaProduto: { fontSize: 11, color: '#999', marginBottom: 4 },
  linhaMedia: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  textoMedia: { fontSize: 11, color: '#888' },
  semAvaliacao: { fontSize: 11, color: '#bbb' },
  acoesDir: { alignItems: 'flex-end', gap: 8 },
  botaoAvaliar: {
    backgroundColor: '#fff7e0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f5a623',
  },
  textoBotaoAvaliar: { fontSize: 12, color: '#e65100', fontWeight: '600' },
  setaExpand: { fontSize: 12, color: '#aaa' },
  listaReviews: {
    backgroundColor: '#fafafa',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    padding: 12,
    gap: 8,
  },
  semReviews: { fontSize: 13, color: '#aaa', textAlign: 'center', paddingVertical: 8 },
  reviewItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#f5a623',
  },
  reviewTopo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  reviewData: { fontSize: 10, color: '#bbb' },
  reviewComentario: { fontSize: 13, color: '#555', fontStyle: 'italic' },
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
  modalTitulo: { fontSize: 17, fontWeight: '700', color: '#222', marginBottom: 20, textAlign: 'center' },
  labelModal: { fontSize: 13, color: '#555', marginBottom: 8, fontWeight: '600' },
  estrelasModal: { flexDirection: 'row', justifyContent: 'center', marginBottom: 6 },
  textoEstrela: { fontSize: 13, color: '#f5a623', textAlign: 'center', marginBottom: 16, fontWeight: '600' },
  inputComentario: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: '#333',
    textAlignVertical: 'top',
    minHeight: 80,
    backgroundColor: '#fafafa',
    marginBottom: 16,
  },
  botaoSalvar: {
    backgroundColor: '#f5a623',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 8,
  },
  botaoDesabilitado: { backgroundColor: '#ddd' },
  textoBotaoSalvar: { color: '#fff', fontSize: 15, fontWeight: '700' },
  botaoCancelar: { padding: 12, alignItems: 'center' },
  textoCancelar: { fontSize: 14, color: '#e53e3e', fontWeight: '600' },
});
