import axios from 'axios';

const API_URL = 'http://localhost:3001/api/fact-check';

const uploadAudio = async (file) => {
  const formData = new FormData();
  formData.append('audio', file);

  const response = await axios.post(`${API_URL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const apiService = {
  uploadAudio,
};
