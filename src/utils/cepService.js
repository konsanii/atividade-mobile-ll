export const buscarEnderecoPorCep = async (cep) => {
  try {
    const cepLimpo = cep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
      throw new Error('CEP deve conter 8 dígitos');
    }

    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);

    if (!response.ok) {
      throw new Error('Erro na requisição da API');
    }

    const dados = await response.json();

    if (dados.erro) {
      throw new Error('CEP não encontrado');
    }

    return {
      cep: dados.cep,
      rua: dados.logradouro,
      bairro: dados.bairro,
      cidade: dados.localidade,
      estado: dados.uf,
    };
  } catch (erro) {
    throw erro;
  }
};
