// Configuração básica do Toastr (opcional)
toastr.options = {
    "closeButton": true,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "timeOut": "5000"
};

function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        status: params.get('status'),
        message: params.get('message')
    };
}

window.onload = function () {
    const { status, message } = getUrlParams();

    if (status && message) {
        const messages = decodeURIComponent(message).split('|');

        if (status === 'success') {
            toastr.success(messages[0], 'Parabéns!');
        } else if (status === 'error') {
            messages.forEach(msg => {
                toastr.error(msg, 'Erro!');
            });
        }

        window.history.replaceState({}, document.title, window.location.pathname);
    }
};

window.onload = function () {
    const { status, message } = getUrlParams();

    if (status && message) {
        const decodedMessage = decodeURIComponent(message.replace(/\+/g, ' '));

        if (status === 'success') {
            toastr.success(decodedMessage, 'Sucesso!');
        } else if (status === 'error') {
            toastr.error(decodedMessage, 'Erro!');
        }

        setTimeout(() => {
            window.history.replaceState({}, document.title, window.location.pathname);
        }, 100);
    }
};