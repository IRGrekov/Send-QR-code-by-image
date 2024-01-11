import axios from 'axios';

export const uploadPhoto = async (photoDataUrl) => {
    try {
      
      const response = await axios.post('api-tyt', {
        photoDataUrl: photoDataUrl,
      });
      console.log('Фото успешно загружено на сервер:', response.data);
    } catch (error) {
      console.error('Ошибка при загрузке фото:', error);
    }
};