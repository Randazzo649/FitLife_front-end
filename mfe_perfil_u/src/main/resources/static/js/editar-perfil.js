(() => {
  const unwrap = x => x?.usuario || x?.user || x?.data || x;
  async function iniciar() {
    const form = document.getElementById('FormularioPerfil'); if (!form) return;
    try {
      const user = unwrap(await FitLifeApi.usuario());
      ['email','genero','telefone','endereco'].forEach(k => { if (form.elements[k]) form.elements[k].value = user[k] || ''; });
      const foto = user.fotoUrl || user.foto_url || user.foto;
      if (foto) document.getElementById('FotoPerfil').innerHTML = `<img alt="Foto de perfil" src="${foto}">`;
    } catch (error) { alert(`Não foi possível carregar os dados: ${error.message}`); }
    form.addEventListener('submit', async event => {
      event.preventDefault(); if (!form.reportValidity()) return;
      const data = Object.fromEntries(new FormData(form));
      try { await FitLifeApi.atualizarUsuario(data); alert('Perfil atualizado!'); location.href='/perfil'; }
      catch (error) { alert(`Não foi possível atualizar o perfil: ${error.message}`); }
    });
    const fileInput = document.getElementById('ArquivoFoto');
    if (fileInput) fileInput.addEventListener('change', async () => {
      const file = fileInput.files?.[0]; if (!file) return;
      if (file.size > 2*1024*1024) { alert('Escolha uma foto de até 2 MB.'); fileInput.value=''; return; }
      try { const result = await FitLifeApi.enviarFoto(file); const url = result?.fotoUrl || URL.createObjectURL(file); document.getElementById('FotoPerfil').innerHTML=`<img alt="Foto de perfil" src="${url}">`; }
      catch (error) { alert(`Não foi possível salvar a foto: ${error.message}`); }
    });
  }
  document.addEventListener('DOMContentLoaded', iniciar);
})();
