import React from 'react';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  lat: number;
  lng: number;
}

const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  lat,
  lng,
}) => {
  if (!isOpen) {
    return null;
  }

  const zoomFactor = 0.002; // ズームの範囲
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${
    lng - zoomFactor
  },${lat - zoomFactor},${lng + zoomFactor},${lat + zoomFactor}&layer=mapnik&marker=${lat},${lng}`;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div
        style={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <button style={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <iframe
          title="Location Map"
          src={mapSrc}
          style={styles.mapIframe}
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

const styles = {
  modalOverlay: {
    position: 'fixed' as const,
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center', // 中央寄せ
    alignItems: 'center', // 縦方向中央寄せ
    zIndex: 1000,
  },
  modalContent: {
    position: 'relative' as const,
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '16px',
    width: '80%',
    maxWidth: '800px',
    maxHeight: '90%',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  mapIframe: {
    width: '100%',
    height: '100%',
    border: 'none',
    flexGrow: 1,
    marginTop: '16px',
  },
  closeButton: {
    position: 'absolute' as const,
    top: '5px',
    right: '5px',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '32px',
    cursor: 'pointer',
    color: '#000',
    zIndex: 1,
  },
};

export default LocationModal;
