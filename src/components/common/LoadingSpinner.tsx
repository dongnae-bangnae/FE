interface LoadingSpinnerProps {
  size: number;
}

const LoadingSpinner = ({ size }: LoadingSpinnerProps) => {
  return (
    <>
      <div
        className="gallery-mini-spinner"
        style={{
          width: `${size}px`,
          height: `${size}px`
        }}
      />
      <style>
        {`
          .gallery-mini-spinner {
            border-radius: 50%;
          background: conic-gradient(
            rgba(255, 234, 195, 0.3) 0%,
            rgba(255, 204, 130, 0.5) 25%,
            rgba(255, 178, 71, 0.7) 50%,
            rgba(255, 153, 0, 0.9) 75%,
            rgba(255, 128, 0, 1) 100%
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

export default LoadingSpinner;
