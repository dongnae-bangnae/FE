interface MiniSpinnerProps {
  size: number; // px 단위
}

const MiniSpinner = ({ size }: MiniSpinnerProps) => {
  return (
    <>
      <div
        className="gallery-mini-spinner"
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
      />
      <style>
        {`
          .gallery-mini-spinner {
            border-radius: 50%;
            background: conic-gradient(
              rgba(255, 255, 255, 0.3) 0%,
              rgba(200, 200, 200, 0.5) 25%,
              rgba(100, 100, 100, 0.7) 50%,
              rgba(50, 50, 50, 0.9) 75%,
              rgba(0, 0, 0, 1) 100%
            );
            animation: spin 0.8s linear infinite;
            mask: radial-gradient(farthest-side, transparent 70%, black 71%);
            -webkit-mask: radial-gradient(farthest-side, transparent 70%, black 71%);
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </>
  );
};

export default MiniSpinner;
