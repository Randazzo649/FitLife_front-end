/* =====================================================================
   TREINOS.JS — Exibição, criação e edição dos treinos.
   ===================================================================== */

(() => {
  // Treino de exemplo utilizado quando o usuário ainda não salvou um treino.
  const inicial = [{
    titulo: 'AQUECIMENTO E CARDIO', cor: '#248c37', categorias: [{
      nome: 'Aquecimento', exercicios: ['5–10 minutos de esteira ou bicicleta', 'Mobilidade de ombros e quadril']
    }, {
      nome: 'Cardio leve', exercicios: ['15–20 minutos de caminhada rápida']
    }]
  }, {
    titulo: 'MUSCULAÇÃO', cor: '#ffb900', categorias: [{
      nome: 'Peito e braços', exercicios: ['Supino reto — 3 x 12', 'Rosca direta — 3 x 12']
    }, {
      nome: 'Pernas', exercicios: ['Agachamento — 3 x 10']
    }]
  }, {
    titulo: 'FINALIZAR', cor: '#e21e1e', categorias: [{
      nome: 'Alongamento', exercicios: ['Alongar por 10 minutos']
    }]
  }];

  // Carrega os treinos salvos e acompanha qual sessão está sendo editada.
  let treinos = FitDados.treinos() || inicial;
  let indiceEditado = - 1;

  // Localiza os elementos da lista de treinos e da janela de edição.
  const atual = document.getElementById('TreinoAtual'), modal = document.getElementById('ModalTreino'), categoriasModal = document.getElementById('CategoriasModal');
  document.getElementById('TituloObjetivoTreino').textContent = (FitDados.ler().objetivo || 'CONDICIONAMENTO FÍSICO').toUpperCase();

  // Reconstrói os cartões de treino, com categorias, exercícios e botão de edição.
  function desenhar() {
    atual.innerHTML = '';
    treinos.forEach((t, i) => {
      const card = document.createElement('article');
      card.className = 'CartaoTreino';
      card.style.borderBottomColor = t.cor;
      const titulo = document.createElement('h2');
      titulo.textContent = t.titulo;
      titulo.style.color = t.cor;
      card.append(titulo);
      const editar = document.createElement('button');
      editar.className = 'buttonEditarTreino';
      editar.textContent = '✎';
      editar.type = 'button';
      editar.onclick = () => abrir(i);
      card.append(editar);
      t.categorias.forEach(c => {
        const h = document.createElement('h3');
        h.textContent = c.nome;
        card.append(h);
        c.exercicios.forEach(ex => {
          const p = document.createElement('p');
          p.textContent = ex;
          card.append(p);
        });
      });
      atual.append(card);
    });
  }

  // Cria um campo de texto reutilizado nos formulários dinâmicos.
  function campo(texto = '', placeholder = 'Exercício') {
    const input = document.createElement('input');
    input.placeholder = placeholder;
    input.value = texto;
    input.required = true;
    return input;
  }

  // Monta uma categoria editável e seu conjunto de exercícios.
  function criarCategoria(container, dados = {
    nome: '', exercicios: ['']
  }) {
    const box = document.createElement('div');
    box.className = 'CategoriaEditavel';
    const label = document.createElement('label');
    label.textContent = 'Categoria';
    label.append(campo(dados.nome, 'Nome da categoria'));
    box.append(label);
    const lista = document.createElement('div');
    lista.className = 'ListaExercicios';
    box.append(lista);
    (dados.exercicios || ['']).forEach(ex => adicionarExercicio(lista, ex));
    const add = document.createElement('button');
    add.type = 'button';
    add.className = 'buttonMais';
    add.textContent = '+ ADICIONAR EXERCÍCIO';
    add.onclick = () => adicionarExercicio(lista);
    box.append(add);
    container.append(box);
  }

  // Acrescenta uma linha de exercício com opção de remoção.
  function adicionarExercicio(lista, valor = '') {
    const linha = document.createElement('div');
    linha.className = 'LinhaExercicio';
    linha.append(campo(valor));
    const remover = document.createElement('button');
    remover.type = 'button';
    remover.className = 'buttonRemover';
    remover.textContent = '×';
    remover.onclick = () => {
      if (lista.children.length > 1)linha.remove();
    };
    linha.append(remover);
    lista.append(linha);
  }

  // Converte os campos preenchidos em uma lista de categorias válidas.
  function lerCategorias(container) {
    return[...container.querySelectorAll('.CategoriaEditavel')].map(box => ({
      nome: box.querySelector('label input').value.trim(), exercicios: [...box.querySelectorAll('.ListaExercicios input')].map(x => x.value.trim()).filter(Boolean)
    })).filter(c => c.nome && c.exercicios.length);
  }

  // Abre a janela de edição e carrega as categorias da sessão escolhida.
  function abrir(i) {
    indiceEditado = i;
    categoriasModal.innerHTML = '';
    treinos[i].categorias.forEach(c => criarCategoria(categoriasModal, c));
    modal.showModal();
  }

  // Conecta os botões de adicionar categoria e fechar a janela.
  document.getElementById('buttonAdicionarCategoria').onclick = () => criarCategoria(categoriasModal);
  document.getElementById('buttonFecharModal').onclick = () => modal.close();

  // Salva as alterações de uma sessão existente e redesenha os cartões.
  document.getElementById('FormularioModal').onsubmit = e => {
    e.preventDefault();
    const cats = lerCategorias(categoriasModal);
    if (!cats.length) {
      alert('Adicione uma categoria e um exercício.');
      return;
    }
    treinos[indiceEditado].categorias = cats;
    FitDados.salvarTreinos(treinos);
    modal.close();
    desenhar();
  };

  // Localiza o espaço onde serão criadas as sessões de um novo treino.
  const sessoes = document.getElementById('SessoesNovas');

  // Adiciona uma sessão editável, respeitando o limite de três novas sessões.
  function novaSessao() {
    if (sessoes.children.length >= 3) {
      alert('Máximo de 3 novas sessões.');
      return;
    }
    const sec = document.createElement('section');
    sec.className = 'SessaoEditavel';
    sec.innerHTML = '<div class="DuasColunas"><label>Título da sessão<input class="NomeSessao" required placeholder="Ex.: Aquecimento"></label><label>Cor do título e da barra<input type="color" class="CorSessao" value="#ff6300"></label></div><div class="CategoriasNovas"></div>';
    const cat = sec.querySelector('.CategoriasNovas');
    criarCategoria(cat);
    const add = document.createElement('button');
    add.type = 'button';
    add.className = 'buttonMais';
    add.textContent = '+ ADICIONAR CATEGORIA';
    add.onclick = () => criarCategoria(cat);
    sec.append(add);
    sessoes.append(sec);
  }

  // Liga o botão de adicionar sessão ao formulário de criação.
  document.getElementById('buttonAdicionarSessao').onclick = novaSessao;

  // Valida e salva um novo treino, substituindo a lista atual do protótipo.
  document.getElementById('FormularioTreino').onsubmit = e => {
    e.preventDefault();
    if (!e.target.reportValidity()) return;
    const nome = document.getElementById('NomeTreino').value.trim();
    if (!nome) return;
    const novos = [...sessoes.children].map(sec => ({
      titulo: sec.querySelector('.NomeSessao').value.trim(), cor: sec.querySelector('.CorSessao').value, categorias: lerCategorias(sec.querySelector('.CategoriasNovas'))
    }));
    if (novos.some(x => !x.titulo || !x.categorias.length)) {
      alert('Preencha ao menos uma categoria e um exercício em cada sessão.');
      return;
    }
    treinos = novos;
    FitDados.salvarTreinos(treinos);
    e.target.reset();
    sessoes.innerHTML = '';
    novaSessao();
    desenhar();
    window.scrollTo(0, 0);
    alert('Novo treino salvo!');
  };
  
  // Inicializa uma sessão em branco e mostra os treinos existentes.
  novaSessao();
  desenhar();
})();
