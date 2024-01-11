import React, { useRef, useState } from 'react';
import Modal from 'react-modal';
import { uploadPhoto } from './api';
import './App.css';

function App() {
  const videoRef = useRef(null);
  const [cameraErrorModalOpen, setCameraErrorModalOpen] = useState(false);
  const [photoErrorModalOpen, setPhotoErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

    } catch (error) {
      console.error('Error accessing camera:', error);
      setErrorMessage('Ошибка доступа к камере устройства');
      setCameraErrorModalOpen(true);
    }
  };

  const handleTakePhoto = async () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const video = videoRef.current;
  
    if (video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
      // Сохраняем фото 
      const photoDataUrl = canvas.toDataURL('image/png');
      console.log('URL фото:', photoDataUrl);
  
      // Остановка видеопотока
      const stream = video.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
  
      // Отправляем данные на сервер
      try {
        await uploadPhoto({ qr: photoDataUrl });
      } catch (error) {
        console.error('Ошибка при загрузке фото:', error);
        setErrorMessage('Ошибка при загрузке фото');
        setPhotoErrorModalOpen(true);
      }
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

      <Modal
        isOpen={cameraErrorModalOpen}
        onRequestClose={() => setCameraErrorModalOpen(false)}
        contentLabel="Ошибка доступа"
        ariaHideApp={false} 
      >
        <p>{errorMessage}</p>
        <button onClick={() => setCameraErrorModalOpen(false)}>Закрыть</button>
      </Modal>
      
    </div>
  );
}

export default App;


// import { useRef, useState } from 'react';
// import './App.css';

// function App() {
//   const videoRef = useRef(null);
//   const [photoDataUrl, setPhotoDataUrl] = useState(null);

//   const handleCapture = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//       }
//     } catch (error) {
//       console.error('Error accessing camera:', error);
//     }
//   };

//   const handleTakePhoto = () => {
//     const video = videoRef.current;

//     if (video) {
//       const canvas = document.createElement('canvas');
//       const context = canvas.getContext('2d');
      
//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;
//       context.drawImage(video, 0, 0, canvas.width, canvas.height);

//       // Сохраняем фото
//       const capturedPhotoDataUrl = canvas.toDataURL('image/png');
//       setPhotoDataUrl(capturedPhotoDataUrl);

//       // Остановка видеопотока
//       const stream = video.srcObject;
//       const tracks = stream.getTracks();
//       tracks.forEach(track => track.stop());
//     }
//   };

//   return (
//     <div className="App">
//       <h1>Сканируй Qr-код</h1>
//       <button onClick={handleCapture}>Для доступа к камере</button>
//       <br />
//       {photoDataUrl && <img src={photoDataUrl} alt="Captured" style={{ maxWidth: '100%' }} />}
//       <br />
//       <video ref={videoRef} autoPlay style={{ maxWidth: '100%' }} />
//       <br />
//       <button onClick={handleTakePhoto}>СДЕЛАТЬ ФОТО</button>
//     </div>
//   );
// }

// export default App;

