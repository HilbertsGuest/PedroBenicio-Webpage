import { GoogleLLMService } from './google/googleLLMService';
import { OpenAILLMService } from './openai/openAILLMService';

// This is a factory that returns the appropriate LLM service
// based on the environment configuration.
const createLLMService = () => {
  const provider = process.env.LLM_PROVIDER || 'google';

  switch (provider) {
    case 'google':
      return new GoogleLLMService();
    case 'openai':
      return new OpenAILLMService();
    default:
      throw new Error(`Unsupported LLM provider: ${provider}`);
  }
};

export const llmService = createLLMService();
