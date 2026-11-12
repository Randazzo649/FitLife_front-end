/* Perfil: Exibição e edição das informações do perfil */

(() => {
  // Recupera os dados do usuário armazenados no navegador.
  const d = FitDados.ler();

  // Exibe o nome e a foto, quando houver uma imagem previamente salva.
  const nome = document.getElementById('NomePerfil');
  if (nome)nome.textContent = d.nome || 'Usuário FitLife';
  document.querySelectorAll('#FotoPerfil').forEach(f => {
    if (d.foto)f.innerHTML = '<img alt="Foto de perfil" src="' + d.foto + '">';
  });

  // Identifica o formulário de edição, que pode não existir em todas as páginas.
  const form = document.getElementById('FormularioPerfil');
  if (form) {
    // Preenche os campos de edição com os valores atuais do perfil.
    ['email', 'genero', 'telefone', 'endereco'].forEach(k => {
      if (form.elements[k])form.elements[k].value = d[k] || '';
    });
    // Valida, salva os dados editados e volta à página de perfil.
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const dados = Object.fromEntries(new FormData(form));
      FitDados.salvar(dados);
      alert('Perfil atualizado!');
      location.href = '../perfil/perfil.html';
    });

    // Prepara a troca de foto de perfil pelo arquivo selecionado.
    const arquivo = document.getElementById('ArquivoFoto');

    // Limita a foto a 2 MB e converte a imagem para exibição no protótipo.
    arquivo.addEventListener('change', () => {
      const file = arquivo.files[0];
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) {
        alert('Escolha uma foto de até 2 MB.');
        return;
      }
      const r = new FileReader();
      r.onload = () => {
        FitDados.salvar({
          foto: r.result
        });
        document.getElementById('FotoPerfil').innerHTML = '<img alt="Foto de perfil" src="' + r.result + '">';
      };
      r.readAsDataURL(file);
    });
  }

  // Mostra o objetivo do usuário na página de busca por personal.
  const objetivo = document.getElementById('ObjetivoBusca');
  if (objetivo)objetivo.textContent = d.objetivo || 'Não selecionado';
  
  // Exibe o endereço resumido como referência de localização.
  const cidade = document.getElementById('CidadeBusca');
  if (cidade) {
    const endereco = (d.endereco || '').split(',');
    cidade.textContent = endereco.length > 2 ? endereco.slice( - 3).join(',').trim(): (d.endereco || 'Não informado');
  }
})();
