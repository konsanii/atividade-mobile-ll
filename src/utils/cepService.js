// Serviço para buscar endereço pelo CEP usando a API ViaCEP
// Usa async/await e fetch

export const buscarEnderecoPorCep = async (cep) => {
  try {
    // Remove caracteres especiais do CEP
    const cepLimpo = cep.replace(/\D/g, '');

    // Valida se o CEP tem 8 dígitos
    if (cepLimpo.length !== 8) {
      throw new Error('CEP deve conter 8 dígitos');
    }

    // Faz a requisição para a API ViaCEP
    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);

    // Verifica se a resposta foi bem-sucedida
    if (!response.ok) {
      throw new Error('Erro na requisição da API');
    }

    // Converte a resposta para JSON
    const dados = await response.json();

    // Verifica se o CEP foi encontrado
    if (dados.erro) {
      throw new Error('CEP não encontrado');
    }

    // Retorna os dados do endereço
    return {
      cep: dados.cep,
      rua: dados.logradouro,
      bairro: dados.bairro,
      cidade: dados.localidade,
      estado: dados.uf,
    };
  } catch (erro) {
    console.error('Erro ao buscar CEP:', erro.message);
    throw erro;
  }
};
