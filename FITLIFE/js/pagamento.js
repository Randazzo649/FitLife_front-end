/* =====================================================================
   PAGAMENTO.JS — INUTILIZADO
   ===================================================================== */

window.FitLifePagamento = (() => {
  // Fonte única dos preços. Para alterar valores, edite este objeto.
  const planos = {
    platinum: { nome: "FIT PLATINUM", preco: 169 },
    standard: { nome: "FIT STANDARD", preco: 119 },
    basic: { nome: "FIT BASIC", preco: 99 }
  };

  // Cada chave aponta para o bloco HTML exibido para aquele meio de pagamento.
  const metodos = {
    credit: document.getElementById("CamposCredito"),
    debit: document.getElementById("CamposDebito"),
    pix: document.getElementById("CamposPix")
  };

  // Guarda as seleções atuais de plano e método de pagamento.
  let PlanoAtual = null;
  let MetodoAtual = "credit";

  // Formata um número como valor em reais para exibição na interface.
  function moeda(valor) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  // Seleciona um único plano, aplica a classe visual e atualiza resumo/parcelas.
  function selecionarPlano(chave) {
    PlanoAtual = planos[chave] ? chave : null;
    document.querySelectorAll(".plan-card").forEach(card => {
      const ativo = card.dataset.plano === PlanoAtual;
      card.classList.toggle("Selecionado", ativo);
      card.setAttribute("aria-pressed", String(ativo));
    });
    atualizarResumo();
    atualizarParcelas();
  }

  // Atualiza no HTML o nome e o valor mensal do plano escolhido.
  function atualizarResumo() {
    const plano = planos[PlanoAtual];
    document.getElementById("NomePlanoSelecionado").textContent = plano ? plano.nome : "Nenhum";
    document.getElementById("PrecoPlanoSelecionado").textContent = plano ? moeda(plano.preco) : moeda(0);
  }

  // Gera opções de parcelamento com valores proporcionais ao número de parcelas.
  function atualizarParcelas() {
    const select = document.getElementById("NumeroParcelas");
    if (!select) return;
    const preco = planos[PlanoAtual]?.preco || 0;
    select.innerHTML = "";
    [1, 3, 6, 12].forEach(qtd => {
      const ValorParcela = qtd > 0 ? preco / qtd : preco;
      const option = document.createElement("option");
      option.value = String(qtd);
      option.textContent = qtd === 1
        ? `1 vez de ${moeda(ValorParcela)}`
        : `${qtd} vezes de ${moeda(ValorParcela)} por mês`;
      select.appendChild(option);
    });
  }

  // Mostra somente os campos do método escolhido e marca o botão selecionado.
  function selecionarMetodo(chave) {
    MetodoAtual = metodos[chave] ? chave : "credit";
    document.querySelectorAll(".method-card").forEach(card => {
      const ativo = card.dataset.metodo === MetodoAtual;
      card.classList.toggle("Selecionado", ativo);
      card.setAttribute("aria-pressed", String(ativo));
    });
    Object.entries(metodos).forEach(([nome, elemento]) => {
      elemento.hidden = nome !== MetodoAtual;
    });
    document.querySelectorAll(".CamposMetodo input, .CamposMetodo select").forEach(campo => {
      campo.classList.remove("Invalido");
    });
  }

  // Valida apenas os campos do método ativo; os demais ficam ocultos e não bloqueiam.
  function validar() {
    const v = window.FitLifeValidacoes;
    let valido = true;
    const exigir = (id, condicao) => {
      const campo = document.getElementById(id);
      if (!campo) return;
      campo.classList.toggle("Invalido", !condicao);
      if (!condicao) valido = false;
    };

    if (MetodoAtual === "credit") {
      const numero = v.somenteNumeros(document.getElementById("NumeroCartao").value);
      exigir("NumeroCartao", numero.length === 16);
      exigir("TitularCartao", document.getElementById("TitularCartao").value.trim().length >= 3);
      exigir("ValidadeCartao", v.validadeCartao(document.getElementById("ValidadeCartao").value));
      const cvv = v.somenteNumeros(document.getElementById("CodigoSeguranca").value);
      exigir("CodigoSeguranca", cvv.length === 3 || cvv.length === 4);
      exigir("NumeroParcelas", Boolean(document.getElementById("NumeroParcelas").value));
    } else if (MetodoAtual === "debit") {
      exigir("CpfDebito", v.cpfValido(document.getElementById("CpfDebito").value));
      exigir("BancoDebito", Boolean(document.getElementById("BancoDebito").value));
    } else {
      exigir("CpfPix", v.cpfValido(document.getElementById("CpfPix").value));
    }
    return valido;
  }

  // Disponibiliza o método e o plano escolhidos para outros scripts.
  function obterMetodo() { return MetodoAtual; }
  function obterPlano() { return PlanoAtual; }

  // Eventos dos botões de plano e pagamento: delegam a atualização às funções acima.
  // Liga os cliques dos botões aos métodos de seleção definidos acima.
  document.querySelectorAll(".plan-card").forEach(card =>
    card.addEventListener("click", () => selecionarPlano(card.dataset.plano)));
  document.querySelectorAll(".method-card").forEach(card =>
    card.addEventListener("click", () => selecionarMetodo(card.dataset.metodo)));

  // Máscaras numéricas dos campos financeiros (não armazenar dados reais neste protótipo).
  const CampoNumeroCartao = document.getElementById("NumeroCartao");
  CampoNumeroCartao.addEventListener("input", () => {
    const digits = window.FitLifeValidacoes.somenteNumeros(CampoNumeroCartao.value).slice(0, 16);
    CampoNumeroCartao.value = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  });
  document.getElementById("ValidadeCartao").addEventListener("input", event => {
    const digits = window.FitLifeValidacoes.somenteNumeros(event.target.value).slice(0, 4);
    event.target.value = digits.length > 2 ? digits.slice(0, 2) + "/" + digits.slice(2) : digits;
  });
  ["CodigoSeguranca", "CpfDebito", "CpfPix"].forEach(id => {
    const campo = document.getElementById(id);
    campo.addEventListener("input", () => {
      const digits = window.FitLifeValidacoes.somenteNumeros(campo.value);
      campo.value = id === "CodigoSeguranca" ? digits.slice(0, 4) : window.FitLifeValidacoes.formatarCPF(digits);
    });
  });

  // Prepara o parcelamento e deixa o cartão de crédito selecionado inicialmente.
  atualizarParcelas();
  selecionarMetodo("credit");
  return { selecionarPlano, selecionarMetodo, validar, obterMetodo, obterPlano, planos };
})();
