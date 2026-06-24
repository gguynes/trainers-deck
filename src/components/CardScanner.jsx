import { useRef, useState } from 'react';

export default function CardScanner({ onAnalyze, isLoading }) {
  const fileRef = useRef();
  const cameraRef = useRef();
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setPreview(dataUrl);
      const base64 = dataUrl.split(',')[1];
      onAnalyze(base64, file.type);
    };
    reader.readAsDataURL(file);
  }

  function onDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }

  return (
    <div className="scanner-section">
      <div
        className={`drop-zone ${dragOver ? 'drag-over' : ''} ${preview ? 'has-preview' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => !isLoading && fileRef.current.click()}
      >
        {preview ? (
          <div className="preview-container">
            <img src={preview} alt="Card preview" className="card-preview-img" />
            {isLoading && (
              <div className="scanning-overlay">
                <div className="scan-beam" />
                <p className="scan-text">Analyzing card...</p>
              </div>
            )}
          </div>
        ) : (
          <div className="drop-prompt">
            <div className="pokeball-icon">
              <div className="pokeball-top" />
              <div className="pokeball-middle" />
              <div className="pokeball-bottom" />
              <div className="pokeball-center" />
            </div>
            <h2 className="drop-title">Scan a Card</h2>
            <p className="drop-sub">Drop a photo here, click to browse, or use your camera</p>
          </div>
        )}
      </div>

      <div className="scanner-buttons">
        <button
          className="btn btn-primary"
          onClick={() => !isLoading && fileRef.current.click()}
          disabled={isLoading}
        >
          📁 Upload Photo
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => !isLoading && cameraRef.current.click()}
          disabled={isLoading}
        >
          📷 Take Photo
        </button>
        {preview && !isLoading && (
          <button
            className="btn btn-outline"
            onClick={() => { setPreview(null); }}
          >
            🔄 Scan Another
          </button>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => handleFile(e.target.files[0])}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={(e) => handleFile(e.target.files[0])}
      />
    </div>
  );
}
