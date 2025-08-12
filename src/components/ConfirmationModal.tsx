import React from 'react';
import { createPortal } from 'react-dom';
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { BUTTON_LABELS } from '../utils/ButtonLabels';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = BUTTON_LABELS.CONFIRM,
  cancelText = BUTTON_LABELS.CANCEL,
  type = 'danger',
  loading = false,
}) => {
  if (!isOpen) return null;

  // Get button variant based on type
  const getConfirmButtonVariant = (type: string) => {
    switch (type) {
      case 'danger':
        return 'btn--danger';
      case 'warning':
        return 'btn--warning';
      case 'info':
        return 'btn--primary';
      default:
        return 'btn--danger';
    }
  };

  // Get icon styling based on type
  const getIconClasses = (type: string) => {
    switch (type) {
      case 'danger':
        return 'confirmation-modal__icon--danger';
      case 'warning':
        return 'confirmation-modal__icon--warning';
      case 'info':
        return 'confirmation-modal__icon--info';
      default:
        return 'confirmation-modal__icon--danger';
    }
  };

  const confirmButtonClass = `btn ${getConfirmButtonVariant(type)}`;
  const iconClass = `confirmation-modal__icon ${getIconClasses(type)}`;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = async () => {
    if (!loading) {
      onConfirm();
    }
  };

  const modalContent = (
    <div className="confirmation-modal" onClick={handleBackdropClick}>
      <div className="confirmation-modal__backdrop" />
      
      <div className="confirmation-modal__content">
        <div className="confirmation-modal__header">
          <button
            type="button"
            className="confirmation-modal__close"
            onClick={onClose}
            disabled={loading}
          >
            <XMarkIcon className="confirmation-modal__close-icon" />
          </button>
        </div>

        <div className="confirmation-modal__body">
          <div className={iconClass}>
            <ExclamationTriangleIcon className="confirmation-modal__warning-icon" />
          </div>
          
          <div className="confirmation-modal__text">
            <h3 className="confirmation-modal__title">{title}</h3>
            <p className="confirmation-modal__message">{message}</p>
          </div>
        </div>

        <div className="confirmation-modal__actions">
          <button
            type="button"
            className={confirmButtonClass}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? (
              <div className="btn-loading">
                <svg className="btn-spinner" viewBox="0 0 24 24">
                  <circle
                    className="btn-spinner__track"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="btn-spinner__path"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                {BUTTON_LABELS.PROCESSING}
              </div>
            ) : (
              confirmText
            )}
          </button>
          
          <button
            type="button"
            className="btn btn--secondary"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ConfirmationModal; 