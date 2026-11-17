(() => {
    async function req(url, opts = {}) {
        const h = new Headers(opts.headers || {});
        h.set('Accept', 'application/json');
        if (opts.body && !(opts.body instanceof FormData)) h.set('Content-Type', 'application/json');
        const r = await fetch(url, { credentials: 'same-origin', ...opts, headers: h });
        const ct = r.headers.get('content-type') || '';
        const b = ct.includes('application/json') ? await r.json() : await r.text();
        if (!r.ok) {
            if (r.status === 401) location.href = window.FITLIFE_URLS?.shell || 'https://fitligemfes.z41.web.core.windows.net/'; throw new Error(b?.message || b?.error || `Falha ${r.status}`);
        }
        return b;
    } window.FitLifeApi = { 
        requisicao: req, eventos: () => req('/bff/eventos'), meusEventos: () => req('/bff/eventos/meus'), participar: id => req(`/bff/eventos/${encodeURIComponent(id)}/participacoes`, { method: 'POST', body: '{}' }), criarEvento: d => req('/bff/eventos', { method: 'POST', body: JSON.stringify(d) }), atualizarEvento: (id, d) => req(`/bff/eventos/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(d) }) }; window.voltarPagina = () => { if (history.length > 1) history.back(); else location.href = window.FITLIFE_URLS?.perfil || 'https://fitlifemfeperfil-h0gfcmh9gecshfhf.mexicocentral-01.azurewebsites.net/perfil'; }; window.indisponivel = () => alert('Funcionalidade indisponível');
})();
