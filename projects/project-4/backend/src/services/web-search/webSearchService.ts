import { GoogleWebSearchService } from './google/googleWebSearchService';
import { BingWebSearchService } from './bing/bingWebSearchService';

// This is a factory that returns the appropriate web search service
// based on the environment configuration.
const createWebSearchService = () => {
  const provider = process.env.WEB_SEARCH_PROVIDER || 'google';

  switch (provider) {
    case 'google':
      return new GoogleWebSearchService();
    case 'bing':
      return new BingWebSearchService();
    default:
      throw new Error(`Unsupported web search provider: ${provider}`);
  }
};

export const webSearchService = createWebSearchService();
