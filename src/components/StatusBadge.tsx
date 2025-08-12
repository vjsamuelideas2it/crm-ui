import React from 'react';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  variant = 'default', 
  size = 'md' 
}) => {
  // Define status color mappings
  const getStatusColors = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    
    switch (normalizedStatus) {
      case 'new':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          border: 'border-blue-200',
          dot: 'bg-blue-500'
        };
      case 'contacted':
        return {
          bg: 'bg-purple-100',
          text: 'text-purple-800',
          border: 'border-purple-200',
          dot: 'bg-purple-500'
        };
      case 'qualified':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          border: 'border-yellow-200',
          dot: 'bg-yellow-500'
        };
      case 'proposal':
        return {
          bg: 'bg-orange-100',
          text: 'text-orange-800',
          border: 'border-orange-200',
          dot: 'bg-orange-500'
        };
      case 'won':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          border: 'border-green-200',
          dot: 'bg-green-500'
        };
      case 'lost':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          border: 'border-red-200',
          dot: 'bg-red-500'
        };
      case 'active':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          border: 'border-green-200',
          dot: 'bg-green-500'
        };
      case 'inactive':
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          border: 'border-gray-200',
          dot: 'bg-gray-500'
        };
      case 'pending':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          border: 'border-yellow-200',
          dot: 'bg-yellow-500'
        };
      case 'completed':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          border: 'border-green-200',
          dot: 'bg-green-500'
        };
      case 'cancelled':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          border: 'border-red-200',
          dot: 'bg-red-500'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          border: 'border-gray-200',
          dot: 'bg-gray-500'
        };
    }
  };

  // Get size classes
  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return {
          badge: 'px-2 py-1 text-xs',
          dot: 'w-1.5 h-1.5'
        };
      case 'lg':
        return {
          badge: 'px-4 py-2 text-base',
          dot: 'w-3 h-3'
        };
      default: // md
        return {
          badge: 'px-3 py-1 text-sm',
          dot: 'w-2 h-2'
        };
    }
  };

  const colors = getStatusColors(status);
  const sizes = getSizeClasses(size);

  // Base classes
  const baseClasses = `
    inline-flex items-center gap-1.5 font-medium rounded-full
    transition-colors duration-200
    ${sizes.badge}
  `;

  // Variant classes
  const variantClasses = variant === 'outline' 
    ? `border ${colors.border} ${colors.text} bg-transparent`
    : `${colors.bg} ${colors.text}`;

  return (
    <span className={`${baseClasses} ${variantClasses}`}>
      <span className={`rounded-full ${colors.dot} ${sizes.dot}`} />
      {status}
    </span>
  );
};

export default StatusBadge; 