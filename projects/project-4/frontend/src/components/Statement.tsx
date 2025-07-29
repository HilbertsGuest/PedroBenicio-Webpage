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
    <div className="border rounded-lg p-4 my-4 shadow-md">
      <p className="text-lg">{result.text}</p>
      <p className={`text-xl font-bold ${result.isTrue ? 'text-green-500' : 'text-red-500'}`}>
        {result.isTrue ? 'True' : 'False'}
      </p>
      <p className="text-gray-700">{result.reasoning}</p>
      <button onClick={handleReplay} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Replay</button>
    </div>
  );
};

export default Statement;
