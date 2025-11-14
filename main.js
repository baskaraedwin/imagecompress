import imageCompression from 'browser-image-compression';

const input = document.getElementById('upload');
input.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  console.log('Original size:', (file.size / 1024 / 1024).toFixed(2), 'MB');

  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 800,
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    console.log('Compressed size:', (compressedFile.size / 1024 / 1024).toFixed(2), 'MB');
  } catch (error) {
    console.error(error);
  }
});
