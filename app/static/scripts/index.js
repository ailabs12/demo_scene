window.onload = function() {
    let canvas = document.getElementById('download-image');
    let ctx = canvas.getContext('2d');

    const backgroundColor = '#e6e6e6',
          fontColor = '#000000'

    const readData = (data) => {
        let reader = new FileReader();
        reader.onloadend = (event) => {
            setImageInCanvas(event.target.result);
        };
        reader.readAsDataURL(data);
    }

    const setImageInCanvas = (base64Str) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let img = new Image();
        img.onload = () => {
            let scaleFactor = (img.width > img.height) ? 
                (img.height / img.width) : 
                (img.width / img.height);
            if (scaleFactor == 1) {
                scaleFactor -= 0.1;
            }
            while (img.width > canvas.width || img.height > canvas.height) {
                img.width *= scaleFactor;
                img.height *= scaleFactor;
            }
            let x = (canvas.width / 2) - (img.width / 2);
            let y = (canvas.height / 2) - (img.height / 2);
            // ctx.scale(0.5, 0.5);
            // (img, 0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, x, y, img.width, img.height);
        };
        img.src = base64Str;
        document.querySelector('[name="base64"]').value = base64Str;
    }

    const setTextInCanvas = (text) => {
        json_res = JSON.parse(text);
        json_res = JSON.stringify(json_res, "", 4);
        document.getElementById('json').innerHTML = json_res;
    }

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = fontColor;
    ctx.font = '42px Courier';
    ctx.textAlign = 'center';
    ctx.textBaseLine = 'middle';

    ctx.fillText('Your image here', (canvas.width / 2), (canvas.height / 2));

    document.querySelector('[name="url"]').onchange = function() {
        const http = new XMLHttpRequest();
        const url = document.querySelector('[name="url"]').value;
        // console.log(url);
        http.onload = () => {
            setImageInCanvas(http.response);
        }
    

        var json = JSON.stringify({
            url: url,
        });
        http.open('POST', '/parseURL')
        http.setRequestHeader('Content-type', 'application/json');
        // http.responseType = 'blob';
        http.send(json);
    }

    document.querySelector('[name="filepath"]').onchange = (event) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let file = event.target.files[0];
        let path = document.querySelector('[name="filepath"]').value;
        let path1 = document.querySelector('[name="filepath"]').innerHTML;
        console.log(path1);
        filename = path.split('\\');
        filename = filename[2];
        el = document.getElementsByClassName('chosen-file')[0];
        if (filename.length > 20) {
            let crop_filename = filename.slice(0, 9) + '...' + filename.slice(filename.length - 9, filename.length);
            el.innerHTML = crop_filename;
        }
        else {
            el.innerHTML = filename;
        }
        el.classList.add('chosen');
        readData(file);
    }

    document.getElementById('send-btn').onclick = () => {
        let formData = new FormData(document.getElementById('classificator-selector'))
        let request = new XMLHttpRequest();
        request.onloadend = () => {
            // result = JSON.parse(request.response);
            setTextInCanvas(request.response);
        }
        request.open('POST', '/parser');
        request.send(formData);
        return false;
    }
};