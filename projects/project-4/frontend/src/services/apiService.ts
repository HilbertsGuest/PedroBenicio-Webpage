// GHPages-Mock-Start
import { mockApiResponse } from '../mocks/mockApi';

const uploadAudio = async (file) => {
  console.log('Using mock API response');
  return Promise.resolve(mockApiResponse);
};

export const apiService = {
  uploadAudio,
};
// GHPages-Mock-End
