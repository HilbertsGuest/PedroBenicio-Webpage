import { useState, ChangeEvent, FormEvent } from 'react';
import { apiService } from '../services/apiService';

interface AudioUploadFormProps {
  setResults: (results: any) => void;
}

const AudioUploadForm = ({ setResults }: AudioUploadFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const results = await apiService.uploadAudio(file);
    setResults(results);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} />
      <button type="submit" disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>
    </form>
  );
};

export default AudioUploadForm;
