/* =============================================================
   INDEX.JS — Animação das fotos e abertura do login da home.
   O login é somente demonstrativo: não existe servidor de autenticação.
   ============================================================= */

(function () {
  const imagens = document.querySelectorAll('.ImagemDestaque');
  const fundo = document.getElementById('FundoModal');
  const abrir = document.getElementById('buttonAbrirLogin');
  const fechar = document.getElementById('buttonFecharLogin');
  const formulario = document.getElementById('FormularioLogin');
  const email = document.getElementById('EmailLogin');
  const senha = document.getElementById('SenhaLogin');
  const aviso = document.getElementById('AvisoLogin');
  let imagemAtual = 0;

  // Troca a fotografia com uma transição de transparência.
  // As demais fotografias são carregadas dos links do Unsplash.
  if (imagens.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setInterval(function () {
      imagens[imagemAtual].classList.remove('Ativa');
      imagemAtual = (imagemAtual + 1) % imagens.length;
      imagens[imagemAtual].classList.add('Ativa');
    }, 6000);
  }

  function abrirLogin() {
    fundo.hidden = false;
    document.body.style.overflow = 'hidden';
    email.focus();
  }

  function fecharLogin() {
    fundo.hidden = true;
    document.body.style.overflow = '';
    aviso.hidden = true;
    abrir.focus();
  }

  abrir.addEventListener('click', abrirLogin);
  fechar.addEventListener('click', fecharLogin);

  // Um clique fora da caixa também fecha o login.
  fundo.addEventListener('click', function (evento) {
    if (evento.target === fundo) fecharLogin();
  });

  document.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape' && !fundo.hidden) fecharLogin();
  });

  document.getElementById('buttonEsqueciSenha').addEventListener('click', function () {
    alert('Funcionalidade indisponível');
  });

  // Como a senha não é salva no cadastro, aqui validamos somente o formato
  // dos campos e o e-mail do cadastro local. Não é autenticação de verdade.
  formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();
    const usuario = FitDados.ler();
    const emailValido = email.validity.valid && email.value.trim() !== '';
    const senhaValida = senha.value.trim() !== '';
    const emailCadastrado = usuario.email &&
      usuario.email.toLowerCase() === email.value.trim().toLowerCase();

    email.classList.toggle('Invalido', !emailValido || !emailCadastrado);
    senha.classList.toggle('Invalido', !senhaValida);

    if (!emailValido || !senhaValida || !emailCadastrado) {
      aviso.hidden = false;
      return;
    }

    aviso.hidden = true;
    window.location.href = 'perfil.html';
  });
})();
