import { useState } from 'react';
import AudioUploadForm from './components/AudioUploadForm';
import ResultsDisplay from './components/ResultsDisplay';

function App() {
  const [results, setResults] = useState([]);

  return (
    <div>
      <h1>AI Fact-Checker</h1>
      <AudioUploadForm setResults={setResults} />
      <ResultsDisplay results={results} />
    </div>
  );
}

export default App;
