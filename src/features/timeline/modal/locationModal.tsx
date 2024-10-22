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
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <button style={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>
        <div style={styles.mapContainer}>
          <iframe
            title="Location Map"
            src={mapSrc}
            style={styles.mapIframe}
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

const styles = {
  modalOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '16px',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '90%',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    position: 'relative' as const,
  },
  header: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end' as const,
  },
  closeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '32px',
    cursor: 'pointer',
    color: '#000',
  },
  mapContainer: {
    width: '100%',
    paddingBottom: '56.25%', // 16:9のアスペクト比を維持
    position: 'relative' as const,
    marginTop: '16px',
  },
  mapIframe: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 'none',
    borderRadius: '8px',
  },
};

export default LocationModal;
