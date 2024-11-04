import React from 'react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  altText: string;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  altText,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <button style={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>
        <img src={imageUrl} alt={altText} style={styles.modalImage} />
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
    maxWidth: '90%',
    maxHeight: '90%',
    overflow: 'auto',
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
  modalImage: {
    maxWidth: '100%',
    maxHeight: '80vh',
    borderRadius: '8px',
    marginTop: '16px',
  },
};

export default ImageModal;
