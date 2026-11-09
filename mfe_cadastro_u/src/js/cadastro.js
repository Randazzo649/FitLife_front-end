/* =====================================================================
   CADASTRO.JS — Navegação e validação das três etapas do cadastro.
   ===================================================================== */

(() => {
  // Localiza os painéis do cadastro, o formulário e os botões de navegação.
  const paineis = [...document.querySelectorAll('.PainelEtapa')], form = document.getElementById('FormularioFitLife');
  const avancar = document.getElementById('nextButton'), voltar = document.getElementById('backTop');
  // Define os títulos exibidos na barra de progresso e acessa as validações compartilhadas.
  const titulos = ['DADOS PESSOAIS', 'INFORMAÇÕES MÉDICAS', 'ESCOLHA SEU OBJETIVO'];
  const v = window.FitLifeValidacoes;
  let etapa = 0, objetivo = '';
  
  // Exibe a etapa atual, atualiza o progresso e limpa o aviso de erro.
  function mostrar() {
    paineis.forEach((p, i) => p.classList.toggle('Ativo', i === etapa));
    document.getElementById('PreenchimentoProgresso').style.width = ((etapa + 1) / 3 * 100) + '%';
    document.getElementById('NumeroEtapa').textContent = (etapa + 1) + '.';
    document.getElementById('TituloEtapa').textContent = titulos[etapa];
    avancar.textContent = etapa === 2 ? 'CONCLUIR': 'AVANÇAR';
    voltar.style.visibility = 'visible';
    document.getElementById('AvisoGeral').hidden = true;
    window.scrollTo(0, 0);
  }

  // Verifica os campos da etapa atual, incluindo CPF, data, telefone e senha.
  // Também exige uma escolha nos grupos de opções obrigatórios.
  function valido() {
    let ok = true;
    const painel = paineis[etapa];
    painel.querySelectorAll('input,select').forEach(c => {
      if (c.type === 'radio' || c.type === 'checkbox') return;
      let certo = c.checkValidity();
      if (c.id === 'cpf') certo = v.cpfValido(c.value);
      if (c.id === 'nascimento') certo = v.dataValida(c.value);
      if (c.id === 'telefone') certo = v.telefoneValido(c.value);
      if (c.id === 'senha') certo = v.senhaValida(c.value);
      c.classList.toggle('Invalido', !certo);
      if (!certo) ok = false;
    });
    const grupos = [...new Set([...painel.querySelectorAll('input[type=radio][required]')].map(c => c.name))];
    grupos.forEach(nome => {
      const escolhido = !!painel.querySelector('input[name="' + nome + '"]:checked');
      painel.querySelectorAll('input[name="' + nome + '"]').forEach(c => c.closest('label')?.classList.toggle('Invalido', !escolhido));
      if (!escolhido) ok = false;
    });
    if (etapa === 2 && !objetivo) ok = false;
    document.getElementById('AvisoGeral').hidden = ok;
    return ok;
  }

  // Aplica uma máscara durante a digitação e remove o destaque de erro do campo.
  function mascarar(id, fn) {
    const c = document.getElementById(id);
    if (c)c.addEventListener('input', () => {
      c.value = fn(c.value);
      c.classList.remove('Invalido');
    });
  }

  // Configura as máscaras de CPF, nascimento e telefone.
  mascarar('cpf', v.formatarCPF);
  mascarar('nascimento', s => v.somenteNumeros(s).slice(0, 8).replace(/(\d{2})(\d)/, '$1/$2').replace(/(\d{2}\/\d{2})(\d)/, '$1/$2'));
  mascarar('telefone', s => {
    let n = v.somenteNumeros(s).slice(0, 11);
    return n.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d{1,4})$/, '$1-$2');
  });

  // Registra a escolha do objetivo e destaca visualmente o botão selecionado.
  document.querySelectorAll('.buttonObjetivo').forEach(b => b.addEventListener('click', () => {
    objetivo = b.dataset.objetivo;
    document.querySelectorAll('.buttonObjetivo').forEach(x => x.classList.toggle('Selecionado', x === b));
    document.getElementById('AvisoGeral').hidden = true;
  }));

  // Ao avançar, valida a etapa; na última, reúne os dados e abre o perfil.
  // A senha é excluída antes do armazenamento local usado neste protótipo.
  avancar.addEventListener('click', () => {
    if (!valido()) return;
    if (etapa < 2) {
      etapa++;
      mostrar();
      return;
    }
    const dados = {
    };
    new FormData(form).forEach((valor, chave) => {
      if (chave === 'saude') {
        (dados.saude ??= []).push(valor);
      } else dados[chave] = valor;
    });
    dados.objetivo = objetivo;
    delete dados.senha;
    FitDados.salvar(dados);
    location.href = 'perfil.html';
  });

  // Retorna à etapa anterior ou à página de origem quando está na primeira etapa.
  voltar.addEventListener('click', () => {
    if (etapa > 0) {
      etapa--;
      mostrar();
    } else if (history.length > 1) history.back();
    else location.href = 'index.html';
  });

  // Inicializa a primeira etapa assim que o script é carregado.
  mostrar();
})();
