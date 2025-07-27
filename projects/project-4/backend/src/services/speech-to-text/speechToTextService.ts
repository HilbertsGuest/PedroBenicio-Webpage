import { GoogleSpeechToTextService } from './google/googleSpeechToTextService';
import { OpenAISpeechToTextService } from './openai/openAISpeechToTextService';

// This is a factory that returns the appropriate speech-to-text service
// based on the environment configuration.
const createSpeechToTextService = () => {
  const provider = process.env.SPEECH_TO_TEXT_PROVIDER || 'google';

  switch (provider) {
    case 'google':
      return new GoogleSpeechToTextService();
    case 'openai':
      return new OpenAISpeechToTextService();
    default:
      throw new Error(`Unsupported speech-to-text provider: ${provider}`);
  }
};

export const speechToTextService = createSpeechToTextService();
