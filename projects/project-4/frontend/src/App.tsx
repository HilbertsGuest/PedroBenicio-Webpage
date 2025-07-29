import { useState } from 'react';
import AudioUploadForm from './components/AudioUploadForm';
import ResultsDisplay from './components/ResultsDisplay';

function App() {
  const [results, setResults] = useState([]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center my-8">AI Fact-Checker</h1>
      <AudioUploadForm setResults={setResults} />
      <ResultsDisplay results={results} />
    </div>
  );
}

export default App;
