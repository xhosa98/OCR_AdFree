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
    try {
        const { data: { text } } = await Tesseract.recognize(
            file, 'eng', {
            logger: m => console.log(m)
        });
        resultElement.textContent = text;
    } catch (error) {
        resultElement.textContent = 'Error during OCR processing: ' + error;
        console.error(error);
        document.getElementById('saveButton').style.hidden = false;
    } finally {
        submitBtn.disabled = false;
    }
};
document.getElementById('saveButton').onclick = function () {
    const text = document.getElementById('result').textContent;
    createAndDownloadFile('extracted_text.txt', text);
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', 'extracted_text.txt');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
};