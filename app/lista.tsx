import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { obterTodosUsuarios, deletarUsuario, atualizarUsuario } from '../src/utils/storageService';

interface Usuario {
  id: string;
  nome: string;
  sexo: string;
  email: string;
  cep: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  dataCadastro: string;
}

export default function ListaScreen() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [modalEditarVisivel, setModalEditarVisivel] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
  const [nomeEdit, setNomeEdit] = useState('');
  const [emailEdit, setEmailEdit] = useState('');
  const [numeroEdit, setNumeroEdit] = useState('');
  const [complementoEdit, setComplementoEdit] = useState('');
  const [salvandoEdit, setSalvandoEdit] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      carregarUsuarios();
    }, [])
  );

  const carregarUsuarios = async () => {
    setCarregando(true);
    try {
      const usuariosCarregados = await obterTodosUsuarios();
      setUsuarios(usuariosCarregados as Usuario[]);
    } catch (erro) {
      Alert.alert('Erro', 'Erro ao carregar usuários: ' + (erro as Error).message);
    } finally {
      setCarregando(false);
    }
  };

  const abrirEdicao = (usuario: Usuario) => {
    setUsuarioEditando(usuario);
    setNomeEdit(usuario.nome);
    setEmailEdit(usuario.email);
    setNumeroEdit(usuario.numero);
    setComplementoEdit(usuario.complemento ?? '');
    setModalEditarVisivel(true);
  };

  const handleSalvarEdicao = async () => {
    if (!usuarioEditando) return;
    if (!nomeEdit.trim()) {
      Alert.alert('Atenção', 'O nome não pode ficar vazio.');
      return;
    }
    setSalvandoEdit(true);
    try {
      await atualizarUsuario(usuarioEditando.id, {
        nome: nomeEdit.trim(),
        email: emailEdit.trim(),
        numero: numeroEdit.trim(),
        complemento: complementoEdit.trim(),
      });
      setModalEditarVisivel(false);
      await carregarUsuarios();
      Alert.alert('✅ Salvo!', 'Dados do usuário atualizados.');
    } catch (erro) {
      Alert.alert('Erro', (erro as Error).message);
    } finally {
      setSalvandoEdit(false);
    }
  };

  const handleDeletarUsuario = async (id: string, nome: string) => {
    Alert.alert('Confirmar', `Deseja deletar o usuário ${nome}?`, [
      { text: 'Cancelar', onPress: () => {} },
      {
        text: 'Deletar',
        onPress: async () => {
          try {
            await deletarUsuario(id);

            Alert.alert('Sucesso', 'Usuário deletado com sucesso!');

            await carregarUsuarios();
          } catch (erro) {
            Alert.alert('Erro', 'Erro ao deletar usuário: ' + (erro as Error).message);
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const renderUsuario = ({ item }: { item: Usuario }) => (
    <View style={styles.cartao}>
      <View style={styles.cabecalhoCartao}>
        <View>
          <Text style={styles.nomeUsuario}>{item.nome}</Text>
          <Text style={styles.sexoBadge}>{item.sexo}</Text>
          <Text style={styles.emailUsuario}>{item.email}</Text>
        </View>
        <View style={styles.botoesCartao}>
          <TouchableOpacity
            style={styles.botaoEditar}
            onPress={() => abrirEdicao(item)}
          >
            <Text style={styles.textoEditar}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.botaoDeletar}
            onPress={() => handleDeletarUsuario(item.id, item.nome)}
          >
            <Text style={styles.textoDeletar}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.divisor} />

      <View style={styles.endereco}>
        <Text style={styles.labelEndereco}>Endereço:</Text>
        <Text style={styles.textoEndereco}>
          {item.rua}, {item.numero}{item.complemento ? ` - ${item.complemento}` : ''}
        </Text>
        <Text style={styles.textoEndereco}>
          {item.bairro} - {item.cidade} / {item.estado}
        </Text>
        <Text style={styles.textoEndereco}>CEP: {item.cep}</Text>
      </View>

      <Text style={styles.dataCadastro}>
        Cadastrado em: {item.dataCadastro}
      </Text>
    </View>
  );

  const modalEdicao = (
    <Modal visible={modalEditarVisivel} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <Text style={styles.modalTitulo}>✏️ Editar Usuário</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.labelInput}>Nome *</Text>
            <TextInput
              style={styles.inputEdit}
              value={nomeEdit}
              onChangeText={setNomeEdit}
              placeholder="Nome completo"
            />
            <Text style={styles.labelInput}>E-mail</Text>
            <TextInput
              style={styles.inputEdit}
              value={emailEdit}
              onChangeText={setEmailEdit}
              placeholder="E-mail"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Text style={styles.labelInput}>Número</Text>
            <TextInput
              style={styles.inputEdit}
              value={numeroEdit}
              onChangeText={setNumeroEdit}
              placeholder="Número"
              keyboardType="numeric"
            />
            <Text style={styles.labelInput}>Complemento</Text>
            <TextInput
              style={styles.inputEdit}
              value={complementoEdit}
              onChangeText={setComplementoEdit}
              placeholder="Apto, bloco, etc."
            />
            {usuarioEditando && (
              <View style={styles.infoSoLeitura}>
                <Text style={styles.infoSoLeituraLabel}>Endereço (somente leitura):</Text>
                <Text style={styles.infoSoLeituraTexto}>
                  {usuarioEditando.rua} — {usuarioEditando.bairro}
                </Text>
                <Text style={styles.infoSoLeituraTexto}>
                  {usuarioEditando.cidade}/{usuarioEditando.estado} — CEP {usuarioEditando.cep}
                </Text>
              </View>
            )}
          </ScrollView>
          <TouchableOpacity
            style={[styles.botaoSalvarEdit, salvandoEdit && styles.botaoDesabilitado]}
            onPress={handleSalvarEdicao}
            disabled={salvandoEdit}
          >
            <Text style={styles.textoBotaoSalvar}>{salvandoEdit ? 'Salvando...' : 'Salvar'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.botaoCancelarEdit}
            onPress={() => setModalEditarVisivel(false)}
          >
            <Text style={styles.textoCancelarEdit}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const telaVazia = () => (
    <View style={styles.containerVazio}>
      <Text style={styles.textoVazio}>📋</Text>
      <Text style={styles.textoVazioMensagem}>
        Nenhum usuário cadastrado
      </Text>
      <Text style={styles.textoVazioSubtexto}>
        Volte à aba &quot;Cadastro&quot; para adicionar novo usuário
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {modalEdicao}
      {carregando ? (
        <View style={styles.containerCarregando}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.textoCarregando}>Carregando usuários...</Text>
        </View>
      ) : usuarios.length === 0 ? (
        telaVazia()
      ) : (
        <FlatList
          data={usuarios}
          renderItem={renderUsuario}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.lista}
          ListHeaderComponent={
            <View style={styles.cabecalho}>
              <Text style={styles.tituloLista}>Usuários Cadastrados</Text>
              <View style={styles.badge}>
                <Text style={styles.numeroBadge}>{usuarios.length}</Text>
              </View>
            </View>
          }
          ListFooterComponent={
            usuarios.length > 0 ? (
              <TouchableOpacity
                style={styles.botaoRecarregar}
                onPress={carregarUsuarios}
              >
                <Text style={styles.textoRecarregar}>🔄 Recarregar</Text>
              </TouchableOpacity>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 10,
  },
  tituloLista: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  badge: {
    backgroundColor: '#0066cc',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  numeroBadge: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  lista: {
    padding: 15,
    paddingTop: 0,
    paddingBottom: 80,
  },
  cartao: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cabecalhoCartao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  nomeUsuario: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  emailUsuario: {
    fontSize: 13,
    color: '#0066cc',
  },
  sexoBadge: {
    fontSize: 11,
    color: '#555',
    backgroundColor: '#eef2ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 2,
    fontWeight: '500',
  },
  botoesCartao: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  botaoEditar: {
    backgroundColor: '#fff3e0',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f5a623',
  },
  textoEditar: {
    fontSize: 15,
  },
  botaoDeletar: {
    backgroundColor: '#ff6b6b',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoDeletar: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
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
    maxHeight: '85%',
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginBottom: 20,
    textAlign: 'center',
  },
  labelInput: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  inputEdit: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 11,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fafafa',
    marginBottom: 14,
  },
  infoSoLeitura: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  infoSoLeituraLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 4,
    fontWeight: '600',
  },
  infoSoLeituraTexto: {
    fontSize: 12,
    color: '#666',
  },
  botaoSalvarEdit: {
    backgroundColor: '#0066cc',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  botaoDesabilitado: { backgroundColor: '#aaa' },
  textoBotaoSalvar: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  botaoCancelarEdit: {
    padding: 12,
    alignItems: 'center',
  },
  textoCancelarEdit: {
    fontSize: 14,
    color: '#e53e3e',
    fontWeight: '600',
  },
  divisor: {
    height: 1,
    backgroundColor: '#eee',
    marginBottom: 10,
  },
  endereco: {
    marginBottom: 10,
  },
  labelEndereco: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  textoEndereco: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
  },
  dataCadastro: {
    fontSize: 11,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 8,
  },
  containerVazio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  textoVazio: {
    fontSize: 64,
    marginBottom: 15,
  },
  textoVazioMensagem: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  textoVazioSubtexto: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  containerCarregando: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoCarregando: {
    marginTop: 15,
    fontSize: 14,
    color: '#666',
  },
  botaoRecarregar: {
    backgroundColor: '#0066cc',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  textoRecarregar: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});
