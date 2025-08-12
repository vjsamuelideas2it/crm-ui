import { useEffect } from 'react';
import { useForm, FieldValues, Path } from 'react-hook-form';
import { BUTTON_LABELS } from '../utils/ButtonLabels';
import { MESSAGES } from '../utils/Messages';

export type FieldType = 'text' | 'email' | 'tel' | 'password' | 'textarea' | 'select' | 'number';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface FormField<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  validation?: {
    required?: string;
    pattern?: {
      value: RegExp;
      message: string;
    };
    minLength?: {
      value: number;
      message: string;
    };
    maxLength?: {
      value: number;
      message: string;
    };
    min?: {
      value: number;
      message: string;
    };
    max?: {
      value: number;
      message: string;
    };
    validate?: (value: any) => boolean | string;
  };
  options?: SelectOption[]; // For select fields
  rows?: number; // For textarea fields
  helpText?: string;
  disabled?: boolean;
  loading?: boolean; // For select fields that are loading data
  error?: string; // For select fields that have errors
}

export interface FormButton {
  label: string;
  type: 'submit' | 'button';
  variant: 'primary' | 'secondary' | 'danger';
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

interface CommonFormProps<T extends FieldValues> {
  fields: FormField<T>[];
  buttons: FormButton[];
  onSubmit: (data: T) => void | Promise<void>;
  defaultValues?: Partial<T>;
  loading?: boolean;
  title?: string;
  description?: string;
  className?: string;
}

const CommonForm = <T extends FieldValues>({
  fields,
  buttons,
  onSubmit,
  defaultValues,
  loading = false,
  title,
  description,
  className = ''
}: CommonFormProps<T>) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<T>({
    defaultValues: defaultValues as any
  });

  // Reset form when defaultValues change
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues as any);
    }
  }, [defaultValues, reset]);

  const getFieldValidation = (field: FormField<T>) => {
    const rules: any = {};
    
    if (field.required) {
      rules.required = field.validation?.required || MESSAGES.VALIDATION_REQUIRED;
    }
    
    if (field.validation) {
      if (field.validation.pattern) {
        rules.pattern = field.validation.pattern;
      }
      if (field.validation.minLength) {
        rules.minLength = field.validation.minLength;
      }
      if (field.validation.maxLength) {
        rules.maxLength = field.validation.maxLength;
      }
      if (field.validation.min) {
        rules.min = field.validation.min;
      }
      if (field.validation.max) {
        rules.max = field.validation.max;
      }
      if (field.validation.validate) {
        rules.validate = field.validation.validate;
      }
    }

    // Auto validation for email fields
    if (field.type === 'email') {
      rules.pattern = {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: MESSAGES.VALIDATION_EMAIL
      };
    }

    return rules;
  };

  const renderField = (field: FormField<T>) => {
    const fieldError = errors[field.name];
    const hasError = !!fieldError;

    const baseInputClasses = `
      form-input
      ${hasError ? 'form-input--error' : ''}
      ${field.disabled ? 'form-input--disabled' : ''}
    `;

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            {...register(field.name, getFieldValidation(field))}
            rows={field.rows || 3}
            placeholder={field.placeholder}
            disabled={field.disabled || loading}
            className={baseInputClasses}
          />
        );

      case 'select':
        return (
          <div className="relative">
            <select
              {...register(field.name, getFieldValidation(field))}
              disabled={field.disabled || loading || field.loading}
              className={`${baseInputClasses} ${field.loading ? 'opacity-50' : ''}`}
            >
              <option value="">{field.placeholder || `Select ${field.label}`}</option>
              {field.options?.map((option) => (
                <option 
                  key={option.value} 
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </option>
              ))}
            </select>
            {field.loading && (
              <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                <svg className="animate-spin h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
            )}
          </div>
        );

      default:
        return (
          <input
            {...register(field.name, getFieldValidation(field))}
            type={field.type}
            placeholder={field.placeholder}
            disabled={field.disabled || loading}
            className={baseInputClasses}
          />
        );
    }
  };

  const getButtonClasses = (button: FormButton) => {
    let baseClasses = 'btn';
    
    switch (button.variant) {
      case 'primary':
        baseClasses += ' btn--primary';
        break;
      case 'danger':
        baseClasses += ' btn--danger';
        break;
      case 'secondary':
      default:
        baseClasses += ' btn--secondary';
        break;
    }

    return baseClasses;
  };

  return (
    <div className={`form-container ${className}`}>
      {(title || description) && (
        <div className="form-header">
          {title && (
            <h2 className="form-title">{title}</h2>
          )}
          {description && (
            <p className="form-description">{description}</p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="form-fields">
          {fields.map((field) => (
            <div 
              key={String(field.name)}
              className={`form-field ${field.type === 'textarea' ? 'form-field--full' : ''}`}
            >
              <label 
                htmlFor={String(field.name)}
                className="form-label"
              >
                {field.label}
                {field.required && <span className="form-label__required">*</span>}
              </label>
              
              {renderField(field)}
              
              {field.helpText && !errors[field.name] && (
                <p className="form-help">{field.helpText}</p>
              )}
              
              {field.error && !errors[field.name] && (
                <p className="form-error">{field.error}</p>
              )}
              
              {errors[field.name] && (
                <p className="form-error">
                  {errors[field.name]?.message as string}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="form-actions">
          {buttons.map((button, index) => (
            <button
              key={index}
              type={button.type}
              onClick={button.onClick}
              disabled={button.disabled || button.loading || loading || isSubmitting}
              className={getButtonClasses(button)}
            >
              {button.loading || (button.type === 'submit' && isSubmitting) ? (
                <div className="btn-loading">
                  <svg
                    className="btn-spinner"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
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
                button.label
              )}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
};

export default CommonForm;