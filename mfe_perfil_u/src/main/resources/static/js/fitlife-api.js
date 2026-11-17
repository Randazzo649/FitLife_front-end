(() => {
  async function requisicao(url, opcoes = {}) {
    const headers = new Headers(opcoes.headers || {});
    headers.set('Accept', 'application/json');
    if (opcoes.body && !(opcoes.body instanceof FormData)) headers.set('Content-Type', 'application/json');
    const response = await fetch(url, { credentials: 'same-origin', ...opcoes, headers });
    const contentType = response.headers.get('content-type') || '';
    const body = contentType.includes('application/json') ? await response.json() : await response.text();
    if (!response.ok) {
      const message = body && typeof body === 'object' ? (body.message || body.error || body.detail) : body;
      if (response.status === 401) location.href = window.FITLIFE_URLS?.shell || 'https://fitligemfes.z41.web.core.windows.net/';
      throw new Error(message || `Falha na comunicação (${response.status}).`);
    }
    return body;
  }
  window.FitLifeApi = {
    requisicao,
    sessao: () => requisicao('/bff/autenticacao/sessao'),
    usuario: () => requisicao('/bff/usuarios/me'),
    atualizarUsuario: data => requisicao('/bff/usuarios/me', { method: 'PUT', body: JSON.stringify(data) }),
    atualizarInformacoes: data => requisicao('/bff/usuarios/me/informacoes-medicas', { method: 'PUT', body: JSON.stringify(data) }),
    enviarFoto: file => { const form = new FormData(); form.append('foto', file); return requisicao('/bff/usuarios/me/foto', { method: 'PUT', body: form }); }
  };
  window.voltarPagina = () => { if (history.length > 1) history.back(); else location.href = '/perfil'; };
  window.indisponivel = () => alert('Funcionalidade indisponível');
})();
