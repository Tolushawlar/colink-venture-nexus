import React, { useEffect } from 'react';

const GoogleAuthCallback = () => {
  useEffect(() => {
    // Extract code from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      // Set authentication flag
      sessionStorage.setItem('googleAuthed', 'true');
      
      // Close the popup window
      window.close();
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Authentication Successful</h2>
        <p className="text-gray-600">You can now close this window.</p>
      </div>
    </div>
  );
};

export default GoogleAuthCallback;