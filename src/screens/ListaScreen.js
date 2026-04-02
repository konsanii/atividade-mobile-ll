import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { obterTodosUsuarios, deletarUsuario } from '../utils/storageService';

export default function ListaScreen() {
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(false);

  // Carregar usuários quando a tela ganhar foco
  useFocusEffect(
    React.useCallback(() => {
      carregarUsuarios();
    }, [])
  );

  // Função async/await para carregar usuários
  const carregarUsuarios = async () => {
    setCarregando(true);
    try {
      // Usando async/await para obter dados do AsyncStorage
      const usuariosCarregados = await obterTodosUsuarios();
      setUsuarios(usuariosCarregados);
    } catch (erro) {
      Alert.alert('Erro', 'Erro ao carregar usuários: ' + erro.message);
    } finally {
      setCarregando(false);
    }
  };

  // Função async/await para deletar usuário
  const handleDeletarUsuario = async (id, nome) => {
    Alert.alert('Confirmar', `Deseja deletar o usuário ${nome}?`, [
      { text: 'Cancelar', onPress: () => {} },
      {
        text: 'Deletar',
        onPress: async () => {
          try {
            // Usando async/await para deletar
            await deletarUsuario(id);
            
            Alert.alert('Sucesso', 'Usuário deletado com sucesso!');
            
            // Recarregar lista
            await carregarUsuarios();
          } catch (erro) {
            Alert.alert('Erro', 'Erro ao deletar usuário: ' + erro.message);
          }
        },
        style: 'destructive',
      },
    ]);
  };

  // Componente para renderizar cada usuário
  const renderUsuario = ({ item }) => (
    <View style={styles.cartao}>
      <View style={styles.cabecalhoCartao}>
        <View>
          <Text style={styles.nomeUsuario}>{item.nome}</Text>
          <Text style={styles.emailUsuario}>{item.email}</Text>
        </View>
        <TouchableOpacity
          style={styles.botaoDeletar}
          onPress={() => handleDeletarUsuario(item.id, item.nome)}
        >
          <Text style={styles.textoDeletar}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divisor} />

      <View style={styles.endereco}>
        <Text style={styles.labelEndereco}>Endereço:</Text>
        <Text style={styles.textoEndereco}>
          {item.rua}, {item.bairro}
        </Text>
        <Text style={styles.textoEndereco}>
          {item.cidade} - {item.estado}, {item.cep}
        </Text>
      </View>

      <Text style={styles.dataCadastro}>
        Cadastrado em: {item.dataCadastro}
      </Text>
    </View>
  );

  // Tela vazia
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
      <View style={styles.cabecalho}>
        <Text style={styles.tituloLista}>Usuários Cadastrados</Text>
        <View style={styles.badge}>
          <Text style={styles.numeroBadge}>{usuarios.length}</Text>
        </View>
      </View>

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
          scrollEnabled={true}
        />
      )}

      {usuarios.length > 0 && (
        <TouchableOpacity
          style={styles.botaoRecarregar}
          onPress={carregarUsuarios}
        >
          <Text style={styles.textoRecarregar}>🔄 Recarregar</Text>
        </TouchableOpacity>
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
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#0066cc',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
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
