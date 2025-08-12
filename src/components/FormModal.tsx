import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { FieldValues } from 'react-hook-form';
import CommonForm, { FormField, FormButton } from './CommonForm';

interface FormModalProps<T extends FieldValues> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  fields: FormField<T>[];
  buttons: FormButton[];
  onSubmit: (data: T) => void | Promise<void>;
  defaultValues?: Partial<T>;
  loading?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const FormModal = <T extends FieldValues>({
  isOpen,
  onClose,
  title,
  description,
  fields,
  buttons,
  onSubmit,
  defaultValues,
  loading = false,
  maxWidth = '2xl'
}: FormModalProps<T>) => {
  
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleFormSubmit = async (data: T) => {
    await onSubmit(data);
  };

  const getModalPanelSizeClass = (size: string) => {
    switch (size) {
      case 'sm': return 'modal-panel--sm';
      case 'md': return 'modal-panel--md';
      case 'lg': return 'modal-panel--lg';
      case 'xl': return 'modal-panel--xl';
      case '2xl': return 'modal-panel--2xl';
      default: return 'modal-panel--2xl';
    }
  };

  const modalContent = (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className={`modal-panel ${getModalPanelSizeClass(maxWidth)}`} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <h3 className="modal-title">
              {title}
            </h3>
            {description && (
              <p className="modal-description">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            disabled={loading}
          >
            <XMarkIcon className="icon--lg" />
          </button>
        </div>

        {/* Form content */}
        <div className="modal-body">
          <CommonForm
            fields={fields}
            buttons={buttons}
            onSubmit={handleFormSubmit}
            defaultValues={defaultValues}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );

  // Render directly to body instead of modal-root to ensure maximum z-index priority
  return createPortal(modalContent, document.body);
};

export default FormModal; 