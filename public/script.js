document.getElementById('sidebar-toggle').addEventListener('click', function () {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const content = document.querySelector('.content');

    sidebar.classList.toggle('open');
    overlay.classList.toggle('show');
    content.classList.toggle('open');
});

document.getElementById('overlay').addEventListener('click', function () {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const content = document.querySelector('.content');

    sidebar.classList.remove('open');
    overlay.classList.remove('show');
    content.classList.remove('open');
});

function formatFileSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let i = 0;

    while (bytes >= 1024 && i < units.length - 1) {
        bytes /= 1024;
        i++;
    }

    return `${bytes.toFixed(2)} ${units[i]}`;
}

// Inicializa os Choices.js para os selects
const uploadFormatChoices = new Choices('#uploadFormatSelect', {
    searchEnabled: true,
    itemSelectText: '',
});

const convertFormatChoices = new Choices('#convertFormatSelect', {
    searchEnabled: true,
    itemSelectText: '',
});

// Mapa de formatos suportados para conversão
const conversionMap = {
    jpg: ['png', 'webp', 'tiff', 'gif', 'heif', 'avif', 'pdf'],
    jpeg: ['png', 'webp', 'tiff', 'gif', 'heif', 'avif', 'pdf'],
    png: ['jpg', 'jpeg', 'webp', 'tiff', 'gif', 'heif', 'avif', 'pdf'],
    webp: ['jpg', 'jpeg', 'png', 'tiff', 'gif', 'heif', 'avif', 'pdf'],
    tiff: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'heif', 'avif', 'pdf'],
    gif: ['jpg', 'jpeg', 'png', 'webp', 'tiff', 'heif', 'avif', 'pdf'],
    heif: ['jpg', 'jpeg', 'png', 'webp', 'tiff', 'gif', 'avif', 'pdf'],
    heic: ['jpg', 'jpeg', 'png', 'webp', 'tiff', 'gif', 'avif', 'pdf'],
    raw: ['jpg', 'jpeg', 'png', 'webp', 'tiff', 'gif', 'heif', 'avif', 'pdf'],
    jp2: ['jpg', 'jpeg', 'png', 'webp', 'tiff', 'gif', 'heif', 'avif', 'pdf'],
    jpx: ['jpg', 'jpeg', 'png', 'webp', 'tiff', 'gif', 'heif', 'avif', 'pdf'],
    j2k: ['jpg', 'jpeg', 'png', 'webp', 'tiff', 'gif', 'heif', 'avif', 'pdf'],
    j2c: ['jpg', 'jpeg', 'png', 'webp', 'tiff', 'gif', 'heif', 'avif', 'pdf'],
    ico: ['jpg', 'jpeg', 'png', 'webp', 'tiff', 'gif', 'heif', 'avif', 'pdf'],
    avif: ['jpg', 'jpeg', 'png', 'webp', 'tiff', 'gif', 'heif', 'pdf'],
    pdf: [] // PDF não suporta conversão para outros formatos neste exemplo
};

// Função para atualizar os selects com Choices.js
function updateFormatSelects(fileExtension) {
    const normalizedExtension = fileExtension.toLowerCase();

    // Atualiza o uploadFormatSelect
    if (conversionMap.hasOwnProperty(normalizedExtension)) {
        uploadFormatChoices.setChoiceByValue(normalizedExtension);
    } else {
        uploadFormatChoices.setChoiceByValue('');
        toastr.error(`Formato ${fileExtension} não suportado para upload.`);
        return;
    }

    // Atualiza o convertFormatSelect
    const availableFormats = conversionMap[normalizedExtension] || [];
    convertFormatChoices.clearChoices(); // Limpa as opções atuais

    // Adiciona a opção padrão "*"
    convertFormatChoices.setChoices(
        [{ value: '', label: '*', disabled: true, selected: true }],
        'value',
        'label',
        true
    );

    // Adiciona os formatos disponíveis para conversão
    if (availableFormats.length > 0) {
        const formatOptions = availableFormats.map(format => ({
            value: format,
            label: format.toUpperCase()
        }));
        convertFormatChoices.setChoices(formatOptions, 'value', 'label', false);
        convertFormatChoices.enable();
    } else {
        convertFormatChoices.disable();
        toastr.error(`Nenhuma conversão disponível para o formato ${fileExtension}.`);
    }
}

// Funções auxiliares (mantidas do seu código original)
function formatFileSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB'];
    let i = 0;
    while (bytes >= 1024 && i < units.length - 1) {
        bytes /= 1024;
        i++;
    }
    return `${bytes.toFixed(2)} ${units[i]}`;
}

function simulateProgress(fileSize, progressText, img) {
    let progress = 0;
    const intervalTime = 50;
    const step = (100 / (fileSize / 1024)) * 10;

    const interval = setInterval(() => {
        if (progress < 100) {
            progress = Math.min(progress + step, 100);
            progressText.textContent = `${Math.round(progress)}%`;
        } else {
            clearInterval(interval);
            progressText.textContent = '100%';
            img.style.opacity = '1';
            setTimeout(() => {
                progressText.parentElement.style.display = 'none';
            }, 500);
        }
    }, intervalTime);
}

// Evento de mudança no input de imagem
document.getElementById('imageInput').addEventListener('change', function (event) {
    const previewContainer = document.getElementById('previewContainer');
    previewContainer.innerHTML = '';

    if (this.files.length > 10) {
        toastr.error('Selecione no máximo 10 imagens!');
        this.value = '';
        return;
    }

    const files = Array.from(this.files);
    if (files.length > 0) {
        // Pega a extensão do primeiro arquivo
        const fileExtension = files[0].name.split('.').pop().toLowerCase();
        updateFormatSelects(fileExtension); // Atualiza o select com o formato correto

        // Mostrar o botão "Converter Todas" quando houver mais de 1 imagem
        if (files.length > 1) {
            document.getElementById('batchActionsConverter').style.display = 'block'; // Exibe o botão "Converter Todas"
        }

        // Lógica de pré-visualização
        files.forEach(file => {
            const row = document.createElement('tr');

            const imgCell = document.createElement('td');
            imgCell.style.position = 'relative';

            const img = document.createElement('img');
            img.className = 'previewImage';
            img.style.opacity = '0.3';
            img.style.transition = 'opacity 1s ease-in-out';

            const overlay = document.createElement('div');
            overlay.className = 'progress-overlay';
            overlay.style.position = 'absolute';
            overlay.style.top = '50%';
            overlay.style.left = '50%';
            overlay.style.transform = 'translate(-50%, -50%)';
            overlay.style.display = 'flex';
            overlay.style.justifyContent = 'center';
            overlay.style.alignItems = 'center';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.transition = 'opacity 3s ease-in-out';
            overlay.style.opacity = '1';

            const progressText = document.createElement('span');
            progressText.className = 'progress-text';
            progressText.textContent = '0%';
            progressText.style.fontSize = '14px';
            progressText.style.color = '#6dff33';
            progressText.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            progressText.style.textShadow = '0 0 5px rgba(0,0,0)';
            progressText.style.fontFamily = 'Arial, sans-serif';
            progressText.style.fontWeight = 'bold';
            progressText.style.minWidth = '50px';
            progressText.style.minHeight = '50px';
            progressText.style.textAlign = 'center';
            progressText.style.display = 'flex';
            progressText.style.justifyContent = 'center';
            progressText.style.alignItems = 'center';
            progressText.style.borderRadius = '.9rem';

            overlay.appendChild(progressText);
            imgCell.appendChild(img);
            imgCell.appendChild(overlay);

            function updateProgress() {
                let progress = 0;
                const interval = setInterval(() => {
                    progress += 1;
                    progressText.textContent = `${progress}%`;
                    if (progress >= 100) {
                        clearInterval(interval);
                        img.style.opacity = '1';
                        overlay.style.opacity = '0';
                        setTimeout(() => {
                            overlay.style.display = 'none';
                        }, 3000);
                    }
                }, 3000);
            }

            updateProgress();

            const nameCell = document.createElement('td');
            nameCell.textContent = file.name;

            const sizeCell = document.createElement('td');
            sizeCell.textContent = formatFileSize(file.size);

            const actionsCell = document.createElement('td');
            const actionButtons = document.createElement('div');
            actionButtons.classList.add('action-buttons');

            const convertButton = document.createElement('button');
            convertButton.className = 'convert-btn';
            convertButton.textContent = 'Converter';

            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-btn';
            deleteButton.textContent = 'Apagar';
            deleteButton.onclick = function () {
                row.remove();
                if (previewContainer.querySelectorAll('tr').length === 0) {
                    document.getElementById('batchActionsConverter').style.display = 'none'; // Oculta o botão "Converter Todas" quando não houver imagens
                }
            };

            actionButtons.appendChild(convertButton);
            actionButtons.appendChild(deleteButton);
            actionsCell.appendChild(actionButtons);

            row.appendChild(imgCell);
            row.appendChild(nameCell);
            row.appendChild(sizeCell);
            row.appendChild(actionsCell);
            previewContainer.appendChild(row);

            const reader = new FileReader();
            reader.onload = function (e) {
                img.src = e.target.result;
                simulateProgress(file.size, progressText, img);
            };
            reader.readAsDataURL(file);
        });
    }
});

// Tabela download
document.getElementById('uploadForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const fileInput = document.getElementById('imageInput');
    const convertFormat = document.getElementById('convertFormatSelect').value;
    const downloadTableBody = document.getElementById('downloadTableBody');

    if (fileInput.files.length === 0) return toastr.error('Selecione pelo menos uma imagem!');
    if (!convertFormat) return toastr.error('Selecione um formato de conversão!');

    // Limpa a tabela e adiciona o spinner
    downloadTableBody.innerHTML = '';
    const spinnerRow = document.createElement('tr');
    const spinnerCell = document.createElement('td');
    spinnerCell.colSpan = 4; // Abrange todas as colunas da tabela
    spinnerCell.style.textAlign = 'center';
    spinnerCell.innerHTML = '<div class="spinner" style="border: 4px solid #f3f3f3; border-top: 4px solid #6dff33; border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; margin: 20px auto;"></div>';
    spinnerRow.appendChild(spinnerCell);
    downloadTableBody.appendChild(spinnerRow);

    // Estilo do spinner via JavaScript (poderia ser em CSS separado)
    const style = document.createElement('style');
    style.textContent = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
    document.head.appendChild(style);

    const files = Array.from(fileInput.files);
    const processedImages = []; // Armazena os dados das imagens processadas

    async function processImage(index) {
        if (index >= files.length) {
            // Após processar todas as imagens, espera 5 segundos e exibe os resultados
            setTimeout(() => {
                downloadTableBody.innerHTML = ''; // Remove o spinner
                processedImages.forEach(({ tr, tdSize, convertedSize, downloadUrl, newFileName }) => {
                    tdSize.textContent = formatFileSize(convertedSize);

                    const link = document.createElement('a');
                    link.href = downloadUrl;
                    link.download = newFileName;

                    const downloadButton = document.createElement('button');
                    downloadButton.textContent = 'Baixar';
                    downloadButton.classList.add('download-btn');
                    downloadButton.onclick = () => link.click();

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Excluir';
                    deleteButton.classList.add('delete-btn');
                    deleteButton.onclick = () => tr.remove();

                    const tdActions = tr.querySelector('.action-buttons');
                    tdActions.appendChild(downloadButton);
                    tdActions.appendChild(deleteButton);

                    downloadTableBody.appendChild(tr);
                });

                if (downloadTableBody.querySelectorAll('tr').length > 0) {
                    document.getElementById('batchActionsDownload').style.display = 'block';
                }
            }, 5000); // 5 segundos de delay
            return;
        }

        const file = files[index];
        const formData = new FormData();
        formData.append('image', file);
        formData.append('format', convertFormat);

        const tr = document.createElement('tr');

        const tdImg = document.createElement('td');
        const thumbnail = document.createElement('img');
        thumbnail.src = URL.createObjectURL(file);
        thumbnail.className = 'thumbnail';
        tdImg.appendChild(thumbnail);

        const tdName = document.createElement('td');
        const newFileName = `Convertido_${Date.now()}.${convertFormat}`;
        tdName.innerHTML = `<strong>${newFileName}</strong>`;

        const tdSize = document.createElement('td');
        tdSize.textContent = 'Processando...';

        const tdActions = document.createElement('td');
        tdActions.classList.add('action-buttons');

        tr.appendChild(tdImg);
        tr.appendChild(tdName);
        tr.appendChild(tdSize);
        tr.appendChild(tdActions);

        try {
            const response = await fetch('/convert', {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'image/*' }
            });

            if (!response.ok) {
                toastr.error('Erro ao converter imagem!');
                processImage(index + 1);
                return;
            }

            const blob = await response.blob();
            const downloadUrl = URL.createObjectURL(blob);
            const convertedSize = blob.size;

            // Armazena os dados processados para exibir depois
            processedImages.push({ tr, tdSize, convertedSize, downloadUrl, newFileName });
            processImage(index + 1);
        } catch (error) {
            toastr.error('Erro ao processar a imagem!');
            processImage(index + 1);
        }
    }

    processImage(0);
});

document.getElementById('convertAllBtn').addEventListener('click', async function () {
    const fileInput = document.getElementById('imageInput');
    const convertFormat = document.getElementById('convertFormatSelect').value;
    const files = Array.from(fileInput.files);

    if (!convertFormat) return toastr.error('Selecione um formato de conversão!');

    const batchActionsConverter = document.getElementById('batchActionsConverter');
    batchActionsConverter.style.display = 'none';

    const downloadTableBody = document.getElementById('downloadTableBody');
    downloadTableBody.innerHTML = '';

    const promises = files.map((file, index) => {
        return new Promise(async (resolve, reject) => {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('format', convertFormat);

            const tr = document.createElement('tr');

            const tdImg = document.createElement('td');
            const thumbnail = document.createElement('img');
            thumbnail.src = URL.createObjectURL(file);
            thumbnail.className = 'thumbnail';
            tdImg.appendChild(thumbnail);

            const tdName = document.createElement('td');
            const newFileName = `Convertido_${Date.now()}.${convertFormat}`;
            tdName.innerHTML = `<strong>${newFileName}</strong>`;

            const tdSize = document.createElement('td');
            tdSize.textContent = 'Processando...';

            const tdActions = document.createElement('td');
            tdActions.classList.add('action-buttons');

            tr.appendChild(tdImg);
            tr.appendChild(tdName);
            tr.appendChild(tdSize);
            tr.appendChild(tdActions);

            downloadTableBody.appendChild(tr);

            try {
                const response = await fetch('/convert', {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'image/*' }
                });

                if (!response.ok) {
                    toastr.error('Erro ao converter imagem!');
                    tr.remove();
                    reject();
                    return;
                }

                const blob = await response.blob();
                const downloadUrl = URL.createObjectURL(blob);
                const convertedSize = blob.size;

                tdSize.textContent = formatFileSize(convertedSize);

                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = newFileName;

                const downloadButton = document.createElement('button');
                downloadButton.textContent = 'Baixar';
                downloadButton.classList.add('download-btn');
                downloadButton.onclick = () => link.click();

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Excluir';
                deleteButton.classList.add('delete-btn');
                deleteButton.onclick = () => tr.remove();

                tdActions.appendChild(downloadButton);
                tdActions.appendChild(deleteButton);
                resolve();
            } catch (error) {
                toastr.error('Erro ao processar a imagem!');
                tr.remove();
                reject();
            }
        });
    });

    try {
        await Promise.all(promises);
        if (downloadTableBody.querySelectorAll('tr').length > 0) {
            document.getElementById('batchActionsDownload').style.display = 'block';
        }
    } catch {
        toastr.error('Erro no processamento em lote.');
    }
});

document.getElementById('downloadAllBtn').addEventListener('click', function () {
    const downloadLinks = document.querySelectorAll('#downloadTableBody .download-btn');
    downloadLinks.forEach(button => button.click());
});