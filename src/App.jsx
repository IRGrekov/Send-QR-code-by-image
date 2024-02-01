import React, { useRef, useState, useEffect } from 'react';
import Modal from 'react-modal';
import { uploadPhoto } from './api';
import { FcOk, FcHighPriority } from "react-icons/fc";
import './App.css';

function App() {
  const videoRef = useRef(null);
  const [cameraErrorModalOpen, setCameraErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [notification, setNotification] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [showTopButton, setShowTopButton] = useState(true);
  const [clickCount, setClickCount] = useState(0);
  const [photoErrorModalOpen, setPhotoErrorModalOpen] = useState(false);
  
  

  const showNotification = (message) => {
    setNotification(message);
    setNotificationOpen(true);
  };

  useEffect(() => {
    if (notificationOpen) {
      const timer = setTimeout(() => {
        setNotificationOpen(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notificationOpen]);

  const handleCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOpen(true);
        setShowTopButton(false); // Скрыть верхнюю кнопку при открытии камеры
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setErrorMessage('Ошибка доступа к камере устройства');
      setCameraErrorModalOpen(true);
    }
  };
  const notificationType = (message) => {
    if (message === 'QR отправлен и распознан') {
      return <FcOk />;
    } else if (
      message === 'QR отправлен, но не распознан.' ||
      message === 'Получил Код, но дальше ошибка.'
    ) {
      return <FcHighPriority />;
    } else {
      return null; // Для других случаев можно вернуть null или другую иконку
    }
  }


  const handleStopResumeCamera = () => {
    if (isCameraOpen) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraOpen(false); // Установить флаг, что камера закрыта
      setShowTopButton(true); // Показать верхнюю кнопку при закрытии камеры
    } else {
      handleCapture();
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
      //console.log('URL фото:', photoDataUrl);
  
      // Отправляем данные на сервер
      try {
        const result = await uploadPhoto({ qr: photoDataUrl });
        if (result) {
          showNotification('QR отправлен и распознан');
        }
      } catch (error) {
        let errorMessageToShow;
        if (error.message === 'QR not recognized') {
          errorMessageToShow = 'QR отправлен, но не распознан.';
        } else if (error.message === 'Was not sent to 1C/QR not recognized') {
          errorMessageToShow = 'Получил Код, но дальше ошибка.';
        } else {
          errorMessageToShow = 'Ошибка при загрузке фото.';
        }
        showNotification(errorMessageToShow);
        console.error('Ошибка при загрузке фото:', error);
        setErrorMessage(error.message || 'Ошибка при загрузке фото');
        setPhotoErrorModalOpen(true);
      } finally {
        // Если камера была открыта с кнопки "СДЕЛАТЬ ФОТО", то закрываем ее
        if (!isCameraOpen) {
          const stream = video.srcObject;
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop());
          video.srcObject = null;
        }
        // Устанавливаем флаг, что камера больше не нужна
        // setIsCameraOpen(false);
      }
    }
  };
  


  return (
    <div className="App">
    {notificationOpen &&
        <div className="notification">
          {notificationType(notification)}
          {"  "}
          {notification}
        </div>
      }
      <h1>Сканируй Qr-код</h1>
      {showTopButton && (
      <button onClick={handleCapture} disabled={isCameraOpen}>
        Открыть камеру
      </button>
    )}
      <br />
      <video ref={videoRef} autoPlay style={{ maxWidth: '100%' }} />
      <br />
      {/* <button onClick={handleTakePhoto}>СДЕЛАТЬ ФОТО</button> */}

      {isCameraOpen && (
      <>
        <button onClick={handleTakePhoto}>Сделать фото</button>
        <br />
        <button onClick={handleStopResumeCamera}>
          Закрыть камеру
        </button>
      </>
    )}

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


