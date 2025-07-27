import Statement from './Statement';

const ResultsDisplay = ({ results }) => {
  return (
    <div>
      {results.map((result, index) => (
        <Statement key={index} result={result} />
      ))}
    </div>
  );
};

export default ResultsDisplay;
