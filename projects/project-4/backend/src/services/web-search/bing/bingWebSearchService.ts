export class BingWebSearchService {
  async search(query: string): Promise<any> {
    // TODO: Implement Bing Web Search API call
    console.log(`Searching for: ${query} with Bing`);
    return Promise.resolve({ results: [] });
  }
}
