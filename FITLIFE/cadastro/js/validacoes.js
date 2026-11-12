/* Validações: funções reutilizáveis para validar e formatar dados */


// Reúne as funções de validação em um objeto acessível pelos demais scripts.
window.FitLifeValidacoes = (() => {
  // Remove pontuação e letras; usada pelas máscaras e validações numéricas.
  const somenteNumeros = valor => (valor || "").replace(/\D/g, "");

  // Aplica a máscara visual 000.000.000-00, sem validar os dígitos.
  function formatarCPF(valor) {
    return somenteNumeros(valor).slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  // Confere tamanho, sequências repetidas e os dois dígitos verificadores do CPF.
  function cpfValido(valor) {
    const cpf = somenteNumeros(valor);
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    let soma = 0;
    for (let i = 0; i < 9; i++) soma += Number(cpf[i]) * (10 - i);
    let digito = (soma * 10) % 11;
    if (digito === 10) digito = 0;
    if (digito !== Number(cpf[9])) return false;
    soma = 0;
    for (let i = 0; i < 10; i++) soma += Number(cpf[i]) * (11 - i);
    digito = (soma * 10) % 11;
    if (digito === 10) digito = 0;
    return digito === Number(cpf[10]);
  }

  // Confere o formato DD/MM/AAAA, a existência da data e se não está no futuro.
  function dataValida(valor) {
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(valor)) return false;
    const [dia, mes, ano] = valor.split("/").map(Number);
    const data = new Date(ano, mes - 1, dia);
    return data.getFullYear() === ano && data.getMonth() === mes - 1 &&
      data.getDate() === dia && data <= new Date();
  }

  // Exige DDD válido e celular brasileiro com nove dígitos iniciado por 9.
  function telefoneValido(valor) {
    const numero = somenteNumeros(valor);
    return numero.length === 11 && /^[1-9]{2}9\d{8}$/.test(numero);
  }

  // Exige no mínimo oito caracteres, uma letra maiúscula e um símbolo.
  function senhaValida(valor) {
    return valor.length >= 8 && /[A-Z]/.test(valor) && /[^A-Za-z0-9]/.test(valor);
  }

  // Confere MM/AA, mês entre 01 e 12 e validade não expirada.
  function validadeCartao(valor) {
    if (!/^\d{2}\/\d{2}$/.test(valor)) return false;
    const [mes, ano] = valor.split("/").map(Number);
    if (mes < 1 || mes > 12) return false;
    const agora = new Date();
    const anoCompleto = 2000 + ano;
    return anoCompleto > agora.getFullYear() ||
      (anoCompleto === agora.getFullYear() && mes >= agora.getMonth() + 1);
  }

  return { somenteNumeros, formatarCPF, cpfValido, dataValida, telefoneValido, senhaValida, validadeCartao };
})();
