(() => {
  const unwrap = x => x?.usuario || x?.user || x?.data || x;
  async function iniciar() {
    try {
      const usuario = unwrap(await FitLifeApi.usuario());
      const nome = document.getElementById('NomePerfil'); if (nome) nome.textContent = usuario.nome || 'Usuário FitLife';
      const foto = usuario.fotoUrl || usuario.foto_url || usuario.foto;
      document.querySelectorAll('#FotoPerfil').forEach(el => { if (foto) el.innerHTML = `<img alt="Foto de perfil" src="${foto}">`; });
    } catch (error) { console.error(error); alert(`Não foi possível carregar o perfil: ${error.message}`); }
  }
  document.addEventListener('DOMContentLoaded', iniciar);
})();
