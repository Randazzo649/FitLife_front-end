/* Exibição, criação e edição de treinos: persistência feita pelo BFF do MFE. */
(() => {
  const iniciais = [
    { titulo: 'AQUECIMENTO E CARDIO', cor: '#248c37', categorias: [
      { nome: 'Aquecimento', exercicios: ['5–10 minutos de esteira ou bicicleta', 'Mobilidade de ombros e quadril'] },
      { nome: 'Cardio leve', exercicios: ['15–20 minutos de caminhada rápida'] }
    ] },
    { titulo: 'MUSCULAÇÃO', cor: '#ffb900', categorias: [
      { nome: 'Peito e braços', exercicios: ['Supino reto — 3 x 12', 'Rosca direta — 3 x 12'] },
      { nome: 'Pernas', exercicios: ['Agachamento — 3 x 10'] }
    ] },
    { titulo: 'FINALIZAR', cor: '#e21e1e', categorias: [
      { nome: 'Alongamento', exercicios: ['Alongar por 10 minutos'] }
    ] }
  ];
  let treinos = [];
  let indiceEditado = -1;
  const atual = document.getElementById('TreinoAtual');
  const modal = document.getElementById('ModalTreino');
  const categoriasModal = document.getElementById('CategoriasModal');
  const sessoes = document.getElementById('SessoesNovas');
  const unwrap = resposta => Array.isArray(resposta) ? resposta : (resposta?.treinos || resposta?.data || []);
  const copia = value => JSON.parse(JSON.stringify(value));

  async function persistir() {
    await FitLifeApi.salvarTreinos(treinos);
  }

  function desenhar() {
    atual.replaceChildren();
    treinos.forEach((treino, indice) => {
      const card = document.createElement('article');
      card.className = 'CartaoTreino';
      card.style.borderBottomColor = treino.cor || '#ff6300';
      const titulo = document.createElement('h2');
      titulo.textContent = treino.titulo;
      titulo.style.color = treino.cor || '#ff6300';
      card.append(titulo);
      const editar = document.createElement('button');
      editar.className = 'buttonEditarTreino';
      editar.textContent = '✎';
      editar.type = 'button';
      editar.onclick = () => abrir(indice);
      card.append(editar);
      (treino.categorias || []).forEach(categoria => {
        const h = document.createElement('h3');
        h.textContent = categoria.nome;
        card.append(h);
        (categoria.exercicios || []).forEach(exercicio => {
          const p = document.createElement('p');
          p.textContent = exercicio;
          card.append(p);
        });
      });
      atual.append(card);
    });
  }

  function campo(texto = '', placeholder = 'Exercício') {
    const input = document.createElement('input');
    input.placeholder = placeholder;
    input.value = texto;
    input.required = true;
    return input;
  }

  function criarCategoria(container, dados = { nome: '', exercicios: [''] }) {
    const box = document.createElement('div');
    box.className = 'CategoriaEditavel';
    const label = document.createElement('label');
    label.textContent = 'Categoria';
    label.append(campo(dados.nome, 'Nome da categoria'));
    box.append(label);
    const lista = document.createElement('div');
    lista.className = 'ListaExercicios';
    box.append(lista);
    (dados.exercicios || ['']).forEach(exercicio => adicionarExercicio(lista, exercicio));
    const add = document.createElement('button');
    add.type = 'button';
    add.className = 'buttonMais';
    add.textContent = '+ ADICIONAR EXERCÍCIO';
    add.onclick = () => adicionarExercicio(lista);
    box.append(add);
    container.append(box);
  }

  function adicionarExercicio(lista, valor = '') {
    const linha = document.createElement('div');
    linha.className = 'LinhaExercicio';
    linha.append(campo(valor));
    const remover = document.createElement('button');
    remover.type = 'button';
    remover.className = 'buttonRemover';
    remover.textContent = '×';
    remover.onclick = () => { if (lista.children.length > 1) linha.remove(); };
    linha.append(remover);
    lista.append(linha);
  }

  function lerCategorias(container) {
    return [...container.querySelectorAll('.CategoriaEditavel')].map(box => ({
      nome: box.querySelector('label input').value.trim(),
      exercicios: [...box.querySelectorAll('.ListaExercicios input')].map(x => x.value.trim()).filter(Boolean)
    })).filter(categoria => categoria.nome && categoria.exercicios.length);
  }

  function abrir(indice) {
    indiceEditado = indice;
    categoriasModal.replaceChildren();
    (treinos[indice].categorias || []).forEach(categoria => criarCategoria(categoriasModal, categoria));
    modal.showModal();
  }

  document.getElementById('buttonAdicionarCategoria').onclick = () => criarCategoria(categoriasModal);
  document.getElementById('buttonFecharModal').onclick = () => modal.close();

  document.getElementById('FormularioModal').onsubmit = async evento => {
    evento.preventDefault();
    const categorias = lerCategorias(categoriasModal);
    if (!categorias.length) { alert('Adicione uma categoria e um exercício.'); return; }
    const anterior = copia(treinos);
    treinos[indiceEditado].categorias = categorias;
    try {
      await persistir();
      modal.close();
      desenhar();
    } catch (erro) {
      treinos = anterior;
      alert(`Não foi possível salvar o treino: ${erro.message}`);
    }
  };

  function novaSessao() {
    if (sessoes.children.length >= 3) { alert('Máximo de 3 novas sessões.'); return; }
    const sec = document.createElement('section');
    sec.className = 'SessaoEditavel';
    sec.innerHTML = '<div class="DuasColunas"><label>Título da sessão<input class="NomeSessao" required placeholder="Ex.: Aquecimento"></label><label>Cor do título e da barra<input type="color" class="CorSessao" value="#ff6300"></label></div><div class="CategoriasNovas"></div>';
    const categorias = sec.querySelector('.CategoriasNovas');
    criarCategoria(categorias);
    const add = document.createElement('button');
    add.type = 'button';
    add.className = 'buttonMais';
    add.textContent = '+ ADICIONAR CATEGORIA';
    add.onclick = () => criarCategoria(categorias);
    sec.append(add);
    sessoes.append(sec);
  }

  document.getElementById('buttonAdicionarSessao').onclick = novaSessao;

  document.getElementById('FormularioTreino').onsubmit = async evento => {
    evento.preventDefault();
    if (!evento.target.reportValidity()) return;
    const nome = document.getElementById('NomeTreino').value.trim();
    if (!nome) return;
    const novos = [...sessoes.children].map(sec => ({
      titulo: sec.querySelector('.NomeSessao').value.trim(),
      cor: sec.querySelector('.CorSessao').value,
      categorias: lerCategorias(sec.querySelector('.CategoriasNovas'))
    }));
    if (novos.some(item => !item.titulo || !item.categorias.length)) {
      alert('Preencha ao menos uma categoria e um exercício em cada sessão.');
      return;
    }
    const anteriores = treinos;
    treinos = novos;
    try {
      await persistir();
      evento.target.reset();
      sessoes.replaceChildren();
      novaSessao();
      desenhar();
      window.scrollTo(0, 0);
      alert('Novo treino salvo!');
    } catch (erro) {
      treinos = anteriores;
      alert(`Não foi possível salvar o novo treino: ${erro.message}`);
    }
  };

  async function iniciar() {
    try {
      const [respostaTreinos, respostaUsuario] = await Promise.all([FitLifeApi.treinos(), FitLifeApi.usuario()]);
      const salvos = unwrap(respostaTreinos);
      treinos = salvos.length ? salvos : copia(iniciais);
      const usuario = respostaUsuario?.usuario || respostaUsuario?.user || respostaUsuario?.data || respostaUsuario;
      document.getElementById('TituloObjetivoTreino').textContent = (usuario.objetivo || usuario.objetivoMedico || 'CONDICIONAMENTO FÍSICO').toUpperCase();
    } catch (erro) {
      alert(`Não foi possível carregar os treinos: ${erro.message}`);
      treinos = copia(iniciais);
    }
    novaSessao();
    desenhar();
  }

  document.addEventListener('DOMContentLoaded', iniciar);
})();
