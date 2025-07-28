// GHPages-Mock-Start
import { mockApiResponse } from '../mocks/mockApi';

const uploadAudio = async (file: File) => {
  console.log('Using mock API response', file);
  return Promise.resolve(mockApiResponse);
};

export const apiService = {
  uploadAudio,
};
// GHPages-Mock-End
