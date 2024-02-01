import axios from 'axios';

export const uploadPhoto = async (photoData) => {
  try {
    const response = await axios.post('/api/send_qrcode', {
      qr: photoData.qr
    }, 
    {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = response.data;
   // console.log('Фото успешно загружено на сервер:', data);

    if (data.result === false) {
      let error = data.error || 'Неизвестная ошибка';
      throw new Error(error);
    }

    return data.result;

  } catch (error) {
    console.error('Ошибка при загрузке фото:', error);
    throw error;
  }
};

