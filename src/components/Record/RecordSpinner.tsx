import "../../styles/recordspinner.css"; 

const Spinner = () => {
  return (
    <div className="spinner-overlay">
      <div className="spinner-circle">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className={`spinner-dot dot-${i + 1}`} />
        ))}
      </div>
    </div>
  );
};

export default Spinner;
