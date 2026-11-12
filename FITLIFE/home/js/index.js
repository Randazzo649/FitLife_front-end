/* Index: carrossel das fotos do banner e config do login */

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

  // Troca a fotografia com uma transição de fade.
  if (imagens.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setInterval(function () {
      imagens[imagemAtual].classList.remove('Ativa');
      imagemAtual = (imagemAtual + 1) % imagens.length;
      imagens[imagemAtual].classList.add('Ativa');
    }, 6000);
  }

  // Mostra a caixa de login por cima da página inicial.
  function abrirLogin() {
    fundo.hidden = false;
    document.body.style.overflow = 'hidden';
    email.focus();
  }

  // Esconde a caixa de login e libera a rolagem da página.
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

  // Validação dos campos do cadastro 
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
    window.location.href = '../perfil/perfil.html';
  });
})();
