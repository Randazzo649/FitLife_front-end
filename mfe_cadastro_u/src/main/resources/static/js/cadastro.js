/* Navegação e validação das três etapas do cadastro FitLife. */
(() => {
  const paineis = [...document.querySelectorAll('.PainelEtapa')];
  const form = document.getElementById('FormularioFitLife');
  const avancar = document.getElementById('nextButton');
  const voltar = document.getElementById('backTop');
  const titulos = ['DADOS PESSOAIS', 'INFORMAÇÕES MÉDICAS', 'ESCOLHA SEU OBJETIVO'];
  const v = window.FitLifeValidacoes;
  let etapa = 0;
  let objetivo = '';

  function mostrar() {
    paineis.forEach((painel, indice) => painel.classList.toggle('Ativo', indice === etapa));
    document.getElementById('PreenchimentoProgresso').style.width = ((etapa + 1) / 3 * 100) + '%';
    document.getElementById('NumeroEtapa').textContent = (etapa + 1) + '.';
    document.getElementById('TituloEtapa').textContent = titulos[etapa];
    avancar.textContent = etapa === 2 ? 'CONCLUIR' : 'AVANÇAR';
    voltar.style.visibility = 'visible';
    document.getElementById('AvisoGeral').hidden = true;
    window.scrollTo(0, 0);
  }

  function valido() {
    let ok = true;
    const painel = paineis[etapa];
    painel.querySelectorAll('input,select').forEach(campo => {
      if (campo.type === 'radio' || campo.type === 'checkbox') return;
      let certo = campo.checkValidity();
      if (campo.id === 'cpf') certo = v.cpfValido(campo.value);
      if (campo.id === 'nascimento') certo = v.dataValida(campo.value);
      if (campo.id === 'telefone') certo = v.telefoneValido(campo.value);
      if (campo.id === 'senha') certo = v.senhaValida(campo.value);
      campo.classList.toggle('Invalido', !certo);
      if (!certo) ok = false;
    });
    const grupos = [...new Set([...painel.querySelectorAll('input[type=radio][required]')].map(campo => campo.name))];
    grupos.forEach(nome => {
      const escolhido = !!painel.querySelector(`input[name="${nome}"]:checked`);
      painel.querySelectorAll(`input[name="${nome}"]`).forEach(campo => campo.closest('label')?.classList.toggle('Invalido', !escolhido));
      if (!escolhido) ok = false;
    });
    if (etapa === 2 && !objetivo) ok = false;
    document.getElementById('AvisoGeral').hidden = ok;
    return ok;
  }

  function mascarar(id, fn) {
    const campo = document.getElementById(id);
    if (campo) campo.addEventListener('input', () => {
      campo.value = fn(campo.value);
      campo.classList.remove('Invalido');
    });
  }

  mascarar('cpf', v.formatarCPF);
  mascarar('nascimento', s => v.somenteNumeros(s).slice(0, 8).replace(/(\d{2})(\d)/, '$1/$2').replace(/(\d{2}\/\d{2})(\d)/, '$1/$2'));
  mascarar('telefone', s => {
    const n = v.somenteNumeros(s).slice(0, 11);
    return n.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d{1,4})$/, '$1-$2');
  });

  document.querySelectorAll('.buttonObjetivo').forEach(botao => botao.addEventListener('click', () => {
    objetivo = botao.dataset.objetivo;
    document.querySelectorAll('.buttonObjetivo').forEach(outro => outro.classList.toggle('Selecionado', outro === botao));
    document.getElementById('AvisoGeral').hidden = true;
  }));

  async function cadastrar() {
    const dados = {};
    new FormData(form).forEach((valor, chave) => {
      if (chave === 'saude') (dados.saude ??= []).push(valor);
      else dados[chave] = valor;
    });
    dados.objetivo = objetivo;

    avancar.disabled = true;
    avancar.textContent = 'ENVIANDO...';
    try {
      const resposta = await fetch('/bff/usuarios/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(dados)
      });
      const corpo = await resposta.json().catch(() => ({}));
      if (!resposta.ok) throw new Error(corpo.message || corpo.error || 'Não foi possível concluir o cadastro.');
      alert('Cadastro realizado! Faça login para acessar seu perfil.');
      const shellUrl = (window.FITLIFE_CONFIG?.SHELL_URL || 'https://fitligemfes.z41.web.core.windows.net/');
      window.location.href = shellUrl;
    } catch (erro) {
      const aviso = document.getElementById('AvisoGeral');
      aviso.textContent = erro.message || 'Não foi possível concluir o cadastro.';
      aviso.hidden = false;
    } finally {
      avancar.disabled = false;
      avancar.textContent = 'CONCLUIR';
    }
  }

  avancar.addEventListener('click', async () => {
    if (!valido()) return;
    if (etapa < 2) {
      etapa++;
      mostrar();
      return;
    }
    await cadastrar();
  });

  voltar.addEventListener('click', () => {
    if (etapa > 0) {
      etapa--;
      mostrar();
    } else if (history.length > 1) history.back();
    else window.location.href = window.FITLIFE_CONFIG?.SHELL_URL || 'http://127.0.0.1:5500/';
  });

  mostrar();
})();
