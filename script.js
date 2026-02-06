const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
document.getElementById('uploadForm').onsubmit = async function (event) {
    event.preventDefault();
    const fileInput = document.getElementById('fileInput');
    const submitBtn = document.querySelector('#uploadForm button[type="submit"]');
    if (fileInput.files.length === 0) {
        alert('Please select a file to upload.');
        return;
    }
    submitBtn.disabled = true;
    const file = fileInput.files[0];
    const resultElement = document.getElementById('result');
    resultElement.textContent = 'Processing...';
    progressBar.hidden = false; progressBar.value = 0; progressText.textContent = 'Starting...';
    try {
        const { data: { text } } = await Tesseract.recognize(
            file, 'eng', {
            logger: m => {
                console.log(m);
                if (m.status) progressText.textContent = m.status;
                if (m.progress !== undefined) progressBar.value = Math.round(m.progress * 100);
            }
        });
        resultElement.textContent = text;
        document.getElementById('saveButton').hidden = false;
    } catch (error) {
        resultElement.textContent = 'Error: ' + error;
        document.getElementById('saveButton').hidden = false;
    } finally {
        progressBar.hidden = true;
        submitBtn.disabled = false;
    }
};

function createAndDownloadFile(filename, content) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

document.getElementById('saveButton').onclick = function () {
    const text = document.getElementById('result').textContent;
    createAndDownloadFile('extracted_text.txt', text);
};