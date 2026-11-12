// Comunidade: cuida das ações desta página e mantém os dados de demonstração no navegador.

const chaveEventos = 'fitlife_eventos_v1';
const chaveParticipacoes = 'fitlife_participacoes_v1';
const eventosIniciais = [
  { id: 'corrida', nome: 'CORRIDA DE RUA', local: 'Parque da cidade', data: '2026-12-05T08:00', descricao: 'Encontro para correr em grupo, com percursos para diferentes ritmos.', imagem: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=900' },
  { id: 'bike', nome: 'BIKE ON ROOF', local: 'Espaço fitness', data: '2026-12-12T09:00', descricao: 'Aula coletiva de bike com música e muita energia.', imagem: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900' },
  { id: 'defesa', nome: 'WORKSHOP DEFESA PESSOAL', local: 'Centro esportivo', data: '2026-12-19T14:00', descricao: 'Introdução às técnicas de defesa pessoal em grupo.', imagem: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=900' },
  { id: 'trilha', nome: 'TRILHA NO PARQUE', local: 'Parque municipal', data: '2026-12-20T08:00', descricao: 'Caminhada ao ar livre com orientação.', imagem: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=900' },
  { id: 'yoga', nome: 'YOGA NO JARDIM BOTÂNICO', local: 'Jardim Botânico', data: '2026-12-21T09:00', descricao: 'Prática de yoga ao ar livre para todos os níveis.', imagem: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900' }
];

// Busca a lista salva no navegador. Se ainda não existir, usa os dados de exemplo.
function lerLista(chave, padrao) {
  try { const dados = JSON.parse(localStorage.getItem(chave)); return Array.isArray(dados) ? dados : padrao; }
  catch { return padrao; }
}

// Reúne os eventos que devem aparecer na comunidade.
function todosEventos() { 
  return lerLista(chaveEventos, eventosIniciais); 
}

// Recupera os eventos em que a pessoa escolheu participar.
function participacoes() { 
  return lerLista(chaveParticipacoes, []); 
}

// Guarda as alterações para que elas continuem aparecendo ao trocar de página.
function salvarLista(chave, lista) { 
  localStorage.setItem(chave, JSON.stringify(lista)); 
}

// Mostra um aviso enquanto a funcionalidade ainda não tem integração real.
function indisponivel() { 
  alert('Funcionalidade indisponível'); 
}

// Volta para a tela anterior ou para o perfil quando não há histórico.
function voltarPagina() { 
  if (history.length > 1) history.back(); else location.href = '../perfil/perfil.html'; 
}

// Deixa a data e a hora em um formato fácil de ler.
function dataLegivel(data) {
  const d = new Date(data);
  return Number.isNaN(d.getTime()) ? 'Data a confirmar' : d.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

// Prepara os links das redes sociais sem publicar nada automaticamente.
function redesSociais(texto) {
  const mensagem = encodeURIComponent(texto);
  const endereco = encodeURIComponent(location.href);
  return [
    { nome: 'Postar no Instagram', classe: 'Instagram', imagem: 'logo_insta.png', link: 'https://www.instagram.com/' },
    { nome: 'Postar no TikTok', classe: 'Tiktok', imagem: 'logo_tiktok.png', link: 'https://www.tiktok.com/' },
    { nome: 'Enviar por Whatsapp', classe: 'Whatsapp', imagem: 'logo_whatsapp.png', link: 'https://api.whatsapp.com/send?text=' + mensagem + '%20' + endereco }
  ];
}

// Monta os botões de compartilhamento que aparecem em cada cartão.
function criarBotoesRedes(alvo, texto) {
  redesSociais(texto).forEach(rede => {
    const botao = document.createElement('button');
    botao.type = 'button'; botao.className = 'buttonRede ' + rede.classe;
    const icone = document.createElement('img'); icone.src = 'assets/' + rede.imagem; icone.alt = '';
    botao.append(icone, document.createTextNode(rede.nome));
    botao.addEventListener('click', () => {
      if (rede.classe !== 'Whatsapp') navigator.clipboard?.writeText(texto).catch(() => {});
      window.open(rede.link, '_blank', 'noopener,noreferrer');
    });
    alvo.appendChild(botao);
  });
}

// Prepara a imagem, o título e as ações de um evento.
function criarCartao(evento, inscrito) {
  const caixa = document.createElement('div'); caixa.className = inscrito ? 'CartaoMeuEvento' : '';
  const botao = document.createElement('button'); botao.className = 'CartaoEvento'; botao.type = 'button';
  const imagem = document.createElement('img'); imagem.className = 'ImagemEvento'; imagem.src = evento.imagem; imagem.alt = '';
  const texto = document.createElement('span'); texto.className = 'TextoEvento';
  const titulo = document.createElement('strong'); titulo.textContent = evento.nome;
  const detalhes = document.createElement('small'); detalhes.textContent = evento.local + ' - ' + dataLegivel(evento.data);
  texto.append(titulo, detalhes); botao.append(imagem, texto);
  botao.addEventListener('click', () => abrirModal(evento)); caixa.appendChild(botao);
  if (inscrito) {
    const acoes = document.createElement('div'); acoes.className = 'AcoesEvento';
    criarBotoesRedes(acoes, 'Vou participar do evento ' + evento.nome + ' no FitLife!');
    caixa.appendChild(acoes);
    if (evento.criado) {
      const editar = document.createElement('button'); editar.className = 'buttonEditarEvento'; editar.textContent = '✎'; editar.title = 'Editar evento';
      editar.addEventListener('click', () => editarEvento(evento)); caixa.appendChild(editar);
    }
  }

  return caixa;
}

// Abre os detalhes do evento escolhido antes de confirmar a participação.
function abrirModal(evento) {
  const modal = document.getElementById('ModalEvento');
  if (!modal) return;
  document.getElementById('ImagemModal').src = evento.imagem;
  document.getElementById('TituloModal').textContent = evento.nome;
  document.getElementById('DataModal').textContent = evento.local + ' — ' + dataLegivel(evento.data);
  document.getElementById('DescricaoModal').textContent = evento.descricao;
  const participar = document.getElementById('buttonParticipar');
  const atualizar = () => { participar.textContent = participacoes().includes(evento.id) ? 'JÁ ESTOU PARTICIPANDO' : 'PARTICIPAR'; };
  atualizar();
  participar.onclick = () => {
    const lista = participacoes();
    if (!lista.includes(evento.id)) { lista.push(evento.id); salvarLista(chaveParticipacoes, lista); }
    atualizar(); alert('Participação confirmada! Veja em Meus eventos.');
  };

  modal.hidden = false;
}

// Fecha a janela de detalhes e devolve a navegação à página.
function fecharModal() { 
  document.getElementById('ModalEvento').hidden = true; 
}

function mostrarComunidade() {
  const grade = document.getElementById('EventosDisponiveis'); if (!grade) return;
  todosEventos().forEach(evento => grade.appendChild(criarCartao(evento, false)));
  const mensagem = document.getElementById('MensagemPostagem');
  criarBotoesRedes(document.getElementById('AcoesCompartilhar'), 'Meu resultado no FitLife! #fitlife #fitcrew');
  const arquivo = document.getElementById('ArquivoResultado');
  arquivo.addEventListener('change', () => {
    const selecionado = arquivo.files[0]; if (!selecionado) return;
    const previa = document.getElementById('PreviaResultado'); previa.replaceChildren();
    const url = URL.createObjectURL(selecionado);
    const elemento = document.createElement(selecionado.type.startsWith('video/') ? 'video' : 'img');
    elemento.src = url; elemento.style.maxHeight = '90px'; elemento.style.maxWidth = '180px';
    if (elemento.tagName === 'VIDEO') elemento.controls = true;
    previa.appendChild(elemento);
    document.getElementById('ImagemResultado').src = selecionado.type.startsWith('image/') ? url : document.getElementById('ImagemResultado').src;
  });
  document.getElementById('AcoesCompartilhar').addEventListener('click', () => {
    if (mensagem.value.trim()) navigator.clipboard?.writeText(mensagem.value.trim()).catch(() => {});
  });
  document.getElementById('ModalEvento').addEventListener('click', evento => {
    if (evento.target.id === 'ModalEvento') fecharModal();
  });
}

let imagemNova = '';
let eventoEmEdicao = null;

function mostrarMeusEventos() {
  const grade = document.getElementById('EventosInscritos'); if (!grade) return;
  const inscritos = participacoes();
  const lista = todosEventos().filter(evento => inscritos.includes(evento.id));
  if (!lista.length) {
    const aviso = document.createElement('p'); aviso.textContent = 'Você ainda não participa de eventos. Visite Minha comunidade para escolher um.';
    grade.appendChild(aviso);
  }
  lista.forEach(evento => grade.appendChild(criarCartao(evento, true)));
  const foto = document.getElementById('FotoEvento');
  foto.addEventListener('change', () => {
    const arquivo = foto.files[0]; if (!arquivo) return;
    if (arquivo.size > 1500000) { alert('Escolha uma imagem de até 1,5 MB.'); foto.value = ''; return; }
    const leitor = new FileReader();
    leitor.onload = () => {
      imagemNova = leitor.result;
      const previa = document.getElementById('PreviaEvento'); previa.src = imagemNova; previa.hidden = false;
      document.getElementById('TextoUpload').textContent = arquivo.name;
    };
    leitor.readAsDataURL(arquivo);
  });
  document.getElementById('FormularioNovoEvento').addEventListener('submit', salvarEvento);
}

// Coloca os dados de um evento existente no formulário para edição.
function editarEvento(evento) {
  eventoEmEdicao = evento.id;
  document.getElementById('NomeEvento').value = evento.nome;
  document.getElementById('DataEvento').value = evento.data;
  document.getElementById('LocalEvento').value = evento.local;
  document.getElementById('DescricaoEvento').value = evento.descricao || '';
  imagemNova = evento.imagem;
  document.getElementById('PreviaEvento').src = evento.imagem;
  document.getElementById('PreviaEvento').hidden = false;
  document.getElementById('FormularioNovoEvento').scrollIntoView({ behavior: 'smooth' });
}

function salvarEvento(evento) {
  evento.preventDefault();
  const nome = document.getElementById('NomeEvento').value.trim();
  const data = document.getElementById('DataEvento').value;
  const local = document.getElementById('LocalEvento').value.trim();
  if (!nome || !data || !local) { alert('Verifique as informações'); return; }
  const lista = todosEventos();
  const id = eventoEmEdicao || 'evento_' + Date.now();
  const novo = { id, nome, data, local, descricao: document.getElementById('DescricaoEvento').value.trim() || 'Evento criado pela comunidade FitLife.', imagem: imagemNova || 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=900', criado: true };
  const indice = lista.findIndex(item => item.id === id);
  if (indice >= 0) lista[indice] = novo; else lista.push(novo);
  try {
    salvarLista(chaveEventos, lista);
    const inscritos = participacoes(); if (!inscritos.includes(id)) { inscritos.push(id); salvarLista(chaveParticipacoes, inscritos); }
    alert('Evento salvo com sucesso!'); location.reload();
  } catch { alert('Não foi possível salvar. Tente uma imagem menor.'); }
}

document.addEventListener('DOMContentLoaded', () => { mostrarComunidade(); mostrarMeusEventos(); });
