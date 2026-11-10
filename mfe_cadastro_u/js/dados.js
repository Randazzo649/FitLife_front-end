/* =====================================================================
   DADOS.JS — Armazenamento temporário dos dados do protótipo.
   ===================================================================== */

// Centraliza a leitura e a gravação dos dados de demonstração no navegador.
window.FitDados = {
  // Recupera os dados do usuário; se não houver dados válidos, retorna um objeto vazio.
  ler() {
    try {
      return JSON.parse(localStorage.getItem('fitlife_usuario') || '{}');
    } catch {
      return {
      };
    }

  // Mescla os novos dados com os anteriores e os grava no localStorage.
  }, salvar(dados) {
    localStorage.setItem('fitlife_usuario', JSON.stringify({
      ...this.ler(), ...dados
    }));

  // Lê os treinos salvos, ou retorna null quando ainda não existem.
  }, treinos() {
    try {
      return JSON.parse(localStorage.getItem('fitlife_treinos') || 'null');
    } catch {
      return null;
    }

  // Persiste a lista de treinos criada ou editada pelo usuário.
  }, salvarTreinos(lista) {
    localStorage.setItem('fitlife_treinos', JSON.stringify(lista));
  }
};

// Mostra um aviso para recursos que ainda não foram implementados.
function indisponivel() {
  alert('Funcionalidade indisponível');
}

// Volta pelo histórico do navegador ou abre o perfil como alternativa.
function voltarPagina() {
  if (history.length > 1) history.back();
  else location.href = 'perfil.html';
}
