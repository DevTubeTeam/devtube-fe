import React from 'react';
import { useLoader } from '../hooks/useLoader';

const LoaderExample: React.FC = () => {
  const { showLoader, hideLoader } = useLoader();

  const handleStartLoading = () => {
    // Show loader with custom message
    showLoader('Uploading video...');

    // Simulate an API call
    setTimeout(() => {
      // Hide loader when done
      hideLoader();
    }, 3000);
  };

  const handleQuickLoading = () => {
    // Show loader with default message
    showLoader();

    // Hide after 1.5 seconds
    setTimeout(hideLoader, 1500);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Loader Example</h2>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={handleStartLoading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#ff5252',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Show Custom Loader (3s)
        </button>

        <button
          onClick={handleQuickLoading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4285f4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Show Default Loader (1.5s)
        </button>
      </div>
    </div>
  );
};

export default LoaderExample;
