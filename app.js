let selectedVersion = 'latest'
    function changeVersion(event) {
      document.querySelector("#version").innerHTML = 'loading...';
      const script = document.createElement('script');
      selectedVersion = event.srcElement.value
      script.src = "https://cdn.jsdelivr.net/npm/browser-image-compression@"+selectedVersion+"/dist/browser-image-compression.js";
      document.body.appendChild(script);
      script.addEventListener('load', () => {
        document.querySelector("#version").innerHTML = imageCompression.version;
      });
    }

    var controller
    document.querySelector("#version").innerHTML = imageCompression.version;
    function compressImage(event, useWebWorker) {
      var file = event.target.files[0];
      var logDom, progressDom;
      if (useWebWorker) {
        logDom = document.querySelector("#web-worker-log");
        progressDom = document.querySelector("#web-worker-progress");
      } else {
        logDom = document.querySelector("#main-thread-log");
        progressDom = document.querySelector("#main-thread-progress");
      }
      // document.getElementById("preview").src = URL.createObjectURL(file);

      logDom.innerHTML =
        "Source image size:" + (file.size / 1024 / 1024).toFixed(2) + "mb";
      console.log("input", file);
      imageCompression.getExifOrientation(file).then(function (o) {
        console.log("ExifOrientation", o);
      });

      controller = typeof AbortController !== 'undefined' && new AbortController();

      var options = {
        maxSizeMB: parseFloat(document.querySelector("#maxSizeMB").value),
        maxWidthOrHeight: parseFloat(
          document.querySelector("#maxWidthOrHeight").value
        ),
        useWebWorker: useWebWorker,
        onProgress: onProgress,
        preserveExif: true,
        libURL: "https://cdn.jsdelivr.net/npm/browser-image-compression@"+selectedVersion+"/dist/browser-image-compression.js"
      };
      if (controller) {
        options.signal = controller.signal;
      }
      imageCompression(file, options)
        .then(function (output) {
          logDom.innerHTML +=
            ", output size:" + (output.size / 1024 / 1024).toFixed(2) + "mb";
          console.log("output", output);
          const downloadLink = URL.createObjectURL(output);
          logDom.innerHTML +=
            '&nbsp;<a href="' +
            downloadLink +
            '" download="' +
            file.name +
            '">download compressed image</a>';
          // document.getElementById('preview-after-compress').src = downloadLink
          return uploadToServer(output);
        })
        .catch(function (error) {
          alert(error.message);
        });

      function onProgress(p) {
        console.log("onProgress", p);
        progressDom.innerHTML = "(" + p + "%" + ")";
      }
    }

    function abort() {
      if (!controller) return
      controller.abort(new Error('I just want to stop'));
    }

    function uploadToServer(file) {
      // const formData = new FormData()
      // formData.append('image', file, file.name)
      // const url = 'http://localhost:3000/image-upload-api'
      // return fetch(url, {
      //   method: 'POST',
      //   body: formData
      // }).then(res => res.json())
      //   .then(body => console.log('got server response', body))
    }