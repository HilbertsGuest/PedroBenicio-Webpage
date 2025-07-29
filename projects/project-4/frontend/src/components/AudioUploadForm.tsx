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
    <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
      <input type="file" onChange={handleFileChange} className="p-2 border rounded" />
      <button type="submit" disabled={loading} className="px-4 py-2 text-white rounded-full glass-button">
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>
    </form>
  );
};

export default AudioUploadForm;
