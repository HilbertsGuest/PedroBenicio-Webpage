interface StatementProps {
  result: {
    audioSlice: string;
    text: string;
    isTrue: boolean;
    reasoning: string;
  };
}

const Statement = ({ result }: StatementProps) => {
  const handleReplay = () => {
    const audio = new Audio(result.audioSlice);
    audio.play();
  };

  return (
    <div className={`border-l-4 ${result.isTrue ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'} rounded-lg p-4 my-4 shadow-md`}>
      <p className="text-lg">{result.text}</p>
      <p className={`text-xl font-bold ${result.isTrue ? 'text-green-700' : 'text-red-700'}`}>
        {result.isTrue ? 'True' : 'False'}
      </p>
      <p className="text-gray-700">{result.reasoning}</p>
      <button onClick={handleReplay} className="mt-4 px-4 py-2 text-white rounded-full glass-button">Replay</button>
    </div>
  );
};

export default Statement;
