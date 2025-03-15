// Função para capturar parâmetros da URL
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        status: params.get('status'),
        message: params.get('message')
    };
}

// Exibe mensagens de erro ou sucesso
window.onload = function () {
    const { status, message } = getUrlParams();
    const container = document.getElementById('message-container');

    if (status && message) {
        const messages = decodeURIComponent(message).split('|');
        let html = '';

        if (status === 'success') {
            html = `<div class="alert alert-success"><p>${messages[0]}</p></div>`;
        } else if (status === 'error') {
            html = '<div class="alert alert-danger">';
            messages.forEach(msg => {
                html += `<p>${msg}</p>`;
            });
            html += '</div>';
        }

        container.innerHTML = html;

        // Remove os parâmetros da URL após exibir
        window.history.replaceState({}, document.title, window.location.pathname);
    }
};