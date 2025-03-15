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

document.getElementById('imageInput').addEventListener('change', function (event) {
    const previewContainer = document.getElementById('previewContainer');
    previewContainer.innerHTML = '';

    if (this.files.length > 10) {
        alert('Selecione no máximo 10 imagens!');
        this.value = '';
        return;
    }

    const files = Array.from(this.files);

    files.forEach(file => {
        const row = document.createElement('tr');

        // Coluna de Miniatura
        const imgCell = document.createElement('td');
        const img = document.createElement('img');
        img.className = 'previewImage';
        img.style.opacity = '0.3';
        const overlay = document.createElement('div');
        overlay.className = 'progress-overlay';
        const progressText = document.createElement('span');
        progressText.className = 'progress-text';
        progressText.textContent = '0%';
        overlay.appendChild(progressText);
        imgCell.appendChild(img);
        imgCell.appendChild(overlay);

        // Coluna de Nome do Arquivo
        const nameCell = document.createElement('td');
        nameCell.textContent = file.name;

        // Coluna de Tamanho
        const sizeCell = document.createElement('td');
        sizeCell.textContent = formatFileSize(file.size);

        // Coluna de Ações
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
        };

        actionButtons.appendChild(convertButton);
        actionButtons.appendChild(deleteButton);
        actionsCell.appendChild(actionButtons);

        // Adiciona as células à linha
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
});

// Função para formatar o tamanho do arquivo
function formatFileSize(size) {
    if (size < 1024) {
        return size + ' bytes';
    } else if (size < 1048576) {
        return (size / 1024).toFixed(2) + ' KB';
    } else if (size < 1073741824) {
        return (size / 1048576).toFixed(2) + ' MB';
    } else {
        return (size / 1073741824).toFixed(2) + ' GB';
    }
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

document.getElementById('uploadForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const fileInput = document.getElementById('imageInput');
    const formatSelect = document.getElementById('formatSelect');
    const downloadLinks = document.getElementById('downloadLinks');
    const progressContainer = document.getElementById('progressContainer');

    if (fileInput.files.length === 0) return alert('Selecione pelo menos uma imagem!');

    downloadLinks.innerHTML = '';
    progressContainer.style.display = 'none';
    const files = Array.from(fileInput.files);

    const conversionContainer = document.createElement('div');
    conversionContainer.className = 'conversion-container';
    downloadLinks.appendChild(conversionContainer);

    async function processImage(index) {
        if (index >= files.length) {
            conversionContainer.remove();
            downloadLinks.classList.add('show');
            document.getElementById('uploadLinks').classList.add('hide');
            return;
        }

        const file = files[index];

        const imgWrapper = document.createElement('div');
        imgWrapper.classList.add('imageWrapper');

        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.className = 'previewImage';
        img.style.opacity = '0.3';

        const overlay = document.createElement('div');
        overlay.className = 'progress-overlay';

        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar-individual';
        progressBar.style.width = '0%';
        progressBar.textContent = '0%';

        overlay.appendChild(progressBar);
        imgWrapper.appendChild(img);
        imgWrapper.appendChild(overlay);

        const fileSizeInfo = document.createElement('p');
        fileSizeInfo.className = 'imageInfo';
        fileSizeInfo.textContent = `Tamanho: ${formatFileSize(file.size)}`;
        imgWrapper.appendChild(fileSizeInfo);

        conversionContainer.appendChild(imgWrapper);

        const formData = new FormData();
        formData.append('image', file);
        formData.append('format', formatSelect.value);

        const response = await fetch('/convert', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            alert('Erro ao converter imagem!');
            processImage(index + 1);
            return;
        }

        const blob = await response.blob();
        const convertedSize = blob.size;
        const downloadUrl = URL.createObjectURL(blob);

        const table = document.createElement('table');
        const tr = document.createElement('tr');

        const tdImg = document.createElement('td');
        const thumbnail = document.createElement('img');
        thumbnail.src = URL.createObjectURL(file);
        thumbnail.className = 'thumbnail';
        tdImg.appendChild(thumbnail);

        const tdName = document.createElement('td');
        const randomNumber = Math.floor(Math.random() * 1000);
        const newFileName = `Convertter_Web_${randomNumber}.${formatSelect.value}`;
        tdName.innerHTML = `${newFileName}<br><small>Tamanho: ${formatFileSize(convertedSize)}</small>`;

        const tdActions = document.createElement('td');
        tdActions.classList.add('action-buttons');

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
        deleteButton.onclick = () => {
            table.remove();
            checkIfTableIsEmpty();
        };

        tdActions.appendChild(downloadButton);
        tdActions.appendChild(deleteButton);

        tr.appendChild(tdImg);
        tr.appendChild(tdName);
        tr.appendChild(tdActions);

        table.appendChild(tr);
        downloadLinks.appendChild(table);

        progressBar.style.width = '100%';
        progressBar.textContent = '100%';
        img.style.opacity = '1';
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 500);

        processImage(index + 1);
    }

    processImage(0);
});

function checkIfTableIsEmpty() {
    const downloadLinks = document.getElementById('downloadLinks');
    if (!downloadLinks.querySelector('table')) {
        downloadLinks.style.display = 'none';
    }
}