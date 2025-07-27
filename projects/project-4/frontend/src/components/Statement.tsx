const Statement = ({ result }) => {
  const handleReplay = () => {
    const audio = new Audio(result.audioSlice);
    audio.play();
  };

  return (
    <div style={{ border: '1px solid black', margin: '10px', padding: '10px' }}>
      <p>{result.text}</p>
      <p style={{ color: result.isTrue ? 'green' : 'red' }}>
        {result.isTrue ? 'True' : 'False'}
      </p>
      <p>{result.reasoning}</p>
      <button onClick={handleReplay}>Replay</button>
    </div>
  );
};

export default Statement;
