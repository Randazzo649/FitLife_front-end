/* SHELL — navegação simples entre módulos separados. */
const rotas = {

  inicio: '../home/index.html',
  cadastro: '../cadastro/cadastro.html',
  perfil: '../perfil/perfil.html',
  treinos: '../treinos/treinos.html',
  informacoes: '../atualizar-informacoes/atualizar-informacoes.html',
  editar: '../editar-perfil/editar-perfil.html',
  personal: '../encontrar-personal/encontrar-personal.html',
  comunidade: '../comunidade/comunidade.html',
  eventos: '../eventos/eventos.html'
};

// Carrega a página selecionada dentro da área principal.
function abrirModulo(nome) {
  const rota = rotas[nome] || rotas.inicio;
  document.getElementById('PaginaAtual').src = rota;
  history.replaceState({}, '', '?pagina=' + encodeURIComponent(nome));
}

window.addEventListener('message', function (evento) {
  if (evento.data && evento.data.tipo === 'navegar' && rotas[evento.data.pagina]) {
    abrirModulo(evento.data.pagina);
  }
});

abrirModulo(new URLSearchParams(location.search).get('pagina') || 'inicio');
