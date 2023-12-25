
import  { useRef } from 'react';
import './App.css'

function App() {
  const videoRef = useRef(null);

  const handleCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const handleTakePhoto = () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const video = videoRef.current;

    if (video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Сохраняем фото (вы можете изменить эту часть согласно вашим потребностям)
      const photoDataUrl = canvas.toDataURL('image/png');
      console.log('Photo Data URL:', photoDataUrl);

      // Остановка видеопотока
      const stream = video.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  return (
    <div className="App">
      <h1>Сканируй Qr-код</h1>
      <button onClick={handleCapture}>Для доступа к камере</button>
      <br />
      <video ref={videoRef} autoPlay style={{ maxWidth: '100%' }} />
      <br />
      <button onClick={handleTakePhoto}>СДЕЛАТЬ ФОТО</button>
    </div>
  );
}

export default App;
