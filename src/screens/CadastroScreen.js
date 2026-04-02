import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { buscarEnderecoPorCep } from '../utils/cepService';
import { salvarUsuario } from '../utils/storageService';

export default function CadastroScreen({ onUsuarioCadastrado }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [ceoBuscado, setCepBuscado] = useState(false);

  // Buscar endereço pelo CEP - função async/await
  const handleBuscarCep = async () => {
    if (!cep.trim()) {
      Alert.alert('Erro', 'Digite um CEP válido');
      return;
    }

    setCarregando(true);
    try {
      // Usando async/await com fetch
      const endereco = await buscarEnderecoPorCep(cep);
      
      setRua(endereco.rua);
      setBairro(endereco.bairro);
      setCidade(endereco.cidade);
      setEstado(endereco.estado);
      setCepBuscado(true);

      Alert.alert('Sucesso', 'Endereço encontrado!');
    } catch (erro) {
      Alert.alert('Erro', erro.message);
      setCepBuscado(false);
    } finally {
      setCarregando(false);
    }
  };

  // Salvar usuário - função async/await
  const handleSalvarUsuario = async () => {
    if (!nome.trim() || !email.trim() || !cep.trim() || !ceoBuscado) {
      Alert.alert('Erro', 'Preencha todos os campos e busque o CEP');
      return;
    }

    setCarregando(true);
    try {
      // Usando async/await para salvar
      await salvarUsuario({
        nome,
        email,
        cep,
        rua,
        bairro,
        cidade,
        estado,
      });

      Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
      
      // Limpar formulário
      setNome('');
      setEmail('');
      setCep('');
      setRua('');
      setBairro('');
      setCidade('');
      setEstado('');
      setCepBuscado(false);

      // Notificar componente pai para recarregar lista
      if (onUsuarioCadastrado) {
        onUsuarioCadastrado();
      }
    } catch (erro) {
      Alert.alert('Erro', 'Erro ao salvar usuário: ' + erro.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.titulo}>Cadastro de Usuário</Text>

        {/* Campo Nome */}
        <View style={styles.formularioGroup}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu nome"
            value={nome}
            onChangeText={setNome}
            editable={!carregando}
          />
        </View>

        {/* Campo Email */}
        <View style={styles.formularioGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            editable={!carregando}
          />
        </View>

        {/* Campo CEP */}
        <View style={styles.formularioGroup}>
          <Text style={styles.label}>CEP</Text>
          <View style={styles.cepContainer}>
            <TextInput
              style={[styles.input, styles.cepInput]}
              placeholder="Digite seu CEP"
              value={cep}
              onChangeText={setCep}
              keyboardType="numeric"
              maxLength={9}
              editable={!carregando}
            />
            <TouchableOpacity
              style={[styles.botao, styles.botaoBusca, carregando && styles.botaoDesabilitado]}
              onPress={handleBuscarCep}
              disabled={carregando}
            >
              {carregando ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.textoBotao}>Buscar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Campos de Endereço */}
        {ceoBuscado && (
          <>
            <View style={styles.formularioGroup}>
              <Text style={styles.label}>Rua</Text>
              <TextInput
                style={styles.input}
                placeholder="Rua"
                value={rua}
                onChangeText={setRua}
                editable={false}
              />
            </View>

            <View style={styles.formularioGroup}>
              <Text style={styles.label}>Bairro</Text>
              <TextInput
                style={styles.input}
                placeholder="Bairro"
                value={bairro}
                onChangeText={setBairro}
                editable={false}
              />
            </View>

            <View style={styles.formularioGroup}>
              <Text style={styles.label}>Cidade</Text>
              <TextInput
                style={styles.input}
                placeholder="Cidade"
                value={cidade}
                onChangeText={setCidade}
                editable={false}
              />
            </View>

            <View style={styles.formularioGroup}>
              <Text style={styles.label}>Estado</Text>
              <TextInput
                style={styles.input}
                placeholder="Estado"
                value={estado}
                onChangeText={setEstado}
                editable={false}
              />
            </View>

            {/* Botão Salvar */}
            <TouchableOpacity
              style={[styles.botao, styles.botaoSalvar, carregando && styles.botaoDesabilitado]}
              onPress={handleSalvarUsuario}
              disabled={carregando}
            >
              {carregando ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.textoBotao}>Salvar Usuário</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    marginTop: 10,
  },
  formularioGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333',
  },
  cepContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  cepInput: {
    flex: 1,
  },
  botao: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  botaoBusca: {
    backgroundColor: '#0066cc',
    width: '30%',
  },
  botaoSalvar: {
    backgroundColor: '#28a745',
    marginTop: 20,
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
  textoBotao: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
