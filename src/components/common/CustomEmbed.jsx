import React, { useState, useEffect } from "react";

export default function CustomEmbed({ src }) {
  const [loading, setLoading] = useState(true);

  const handleLoad = () => {
    setLoading(false);
  }

  return (
    <>
      {loading && (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '110px'}}>
          <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      <embed src={src} onLoad={handleLoad} onError={handleLoad}/>
    </>
  );
}

