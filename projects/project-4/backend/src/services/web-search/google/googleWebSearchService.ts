export class GoogleWebSearchService {
  async search(query: string): Promise<any> {
    // TODO: Implement Google Web Search API call
    console.log(`Searching for: ${query} with Google`);
    return Promise.resolve({ results: [] });
  }
}
