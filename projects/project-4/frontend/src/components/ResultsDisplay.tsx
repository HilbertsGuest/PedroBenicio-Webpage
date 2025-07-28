import Statement from './Statement';

interface ResultsDisplayProps {
  results: any[];
}

const ResultsDisplay = ({ results }: ResultsDisplayProps) => {
  return (
    <div>
      {results.map((result, index) => (
        <Statement key={index} result={result} />
      ))}
    </div>
  );
};

export default ResultsDisplay;
