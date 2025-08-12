import React, { useMemo, useState } from 'react';
import { PlusIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useCustomers } from '../hooks/useCustomers';
import { useLeads } from '../hooks/useLeads';
import { useUsers } from '../hooks/useUsers';
import FormModal from '../components/FormModal';
import { FormButton, FormField } from '../components/CommonForm';
import { BUTTON_LABELS } from '../utils/ButtonLabels';
import { MESSAGES } from '../utils/Messages';
import { useNavigate } from 'react-router-dom';
import { Lead } from '../services/leadService';

interface CustomerFormData {
  name: string;
  email: string;
  phone?: string;
  status_id: number;
  source_id: number;
  assigned_to?: number;
  notes?: string;
}

const Customers: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Lead | null>(null);
  const navigate = useNavigate();

  // Customers list (backed by leads with is_converted=true)
  const { customers, loading, error, addCustomer, isAddingCustomer, refetch } = useCustomers();

  // Meta data and update from leads hook
  const { leadStatuses, sources, statusesLoading, sourcesLoading, statusesError, sourcesError, updateLead, actionLoading } = useLeads();
  const { users, loading: usersLoading, error: usersError } = useUsers();

  const fields: FormField<CustomerFormData>[] = useMemo(() => ([
    { name: 'name', label: 'Customer Name', type: 'text', required: true, placeholder: 'Enter customer name', validation: { required: MESSAGES.VALIDATION_REQUIRED, minLength: { value: 2, message: MESSAGES.VALIDATION_NAME_MIN } } },
    { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'Enter email address', validation: { required: MESSAGES.VALIDATION_REQUIRED } },
    { name: 'phone', label: 'Phone', type: 'tel', placeholder: 'Enter phone number' },
    { name: 'status_id', label: 'Status', type: 'select', required: true, loading: statusesLoading, error: statusesError || undefined, options: leadStatuses.map(s => ({ value: s.id, label: s.name, disabled: !s.is_active })), helpText: 'Select customer status' },
    { name: 'source_id', label: 'Source', type: 'select', required: true, loading: sourcesLoading, error: sourcesError || undefined, options: sources.map(src => ({ value: src.id, label: src.name, disabled: !src.is_active })), helpText: 'How did this customer find us?' },
    { name: 'assigned_to', label: 'Account Owner', type: 'select', loading: usersLoading, error: usersError || undefined, options: users.map(u => ({ value: u.id, label: `${u.name} (${u.role.name})` })), helpText: 'Assign this customer to a team member (optional)' },
    { name: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Additional notes about this customer' },
  ]), [leadStatuses, sources, statusesLoading, sourcesLoading, statusesError, sourcesError, users, usersLoading, usersError]);

  const buttonsCreate: FormButton[] = [
    { label: BUTTON_LABELS.CANCEL, type: 'button', variant: 'secondary', onClick: () => setIsCreateModalOpen(false) },
    { label: BUTTON_LABELS.CREATE, type: 'submit', variant: 'primary', loading: isAddingCustomer },
  ];

  const buttonsEdit: FormButton[] = [
    { label: BUTTON_LABELS.CANCEL, type: 'button', variant: 'secondary', onClick: () => { setIsEditModalOpen(false); setSelectedCustomer(null); } },
    { label: BUTTON_LABELS.UPDATE, type: 'submit', variant: 'primary', loading: actionLoading },
  ];

  const handleCreate = async (data: CustomerFormData) => {
    await addCustomer({ name: data.name, email: data.email, phone: data.phone || undefined, status_id: data.status_id, source_id: data.source_id, assigned_to: data.assigned_to || undefined, notes: data.notes || undefined });
    setIsCreateModalOpen(false);
    refetch();
  };

  const openEdit = (c: Lead) => { setSelectedCustomer(c); setIsEditModalOpen(true); };

  const handleUpdate = async (data: CustomerFormData) => {
    if (!selectedCustomer) return;
    await updateLead(selectedCustomer.id, {
      name: data.name,
      email: data.email || undefined,
      phone: data.phone || undefined,
      status_id: data.status_id,
      source_id: data.source_id,
      assigned_to: data.assigned_to || undefined,
      notes: data.notes || undefined,
      is_converted: true,
    });
    setIsEditModalOpen(false);
    setSelectedCustomer(null);
  };

  const getDefaultValues = (): Partial<CustomerFormData> => !selectedCustomer ? {} : ({
    name: selectedCustomer.name,
    email: selectedCustomer.email || '',
    phone: selectedCustomer.phone || '',
    status_id: selectedCustomer.status?.id || 0,
    source_id: selectedCustomer.source?.id || 0,
    assigned_to: selectedCustomer.assigned_to || undefined,
    notes: selectedCustomer.notes || '',
  });

  if (loading) {
    return (
      <div className="customers">
        <div className="customers__header"><h1>Customers</h1></div>
        <div className="customers__list"><p>Loading customers...</p></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="customers">
        <div className="customers__header"><h1>Customers</h1></div>
        <div className="customers__list"><p className="text-red-600">{error}</p></div>
      </div>
    );
  }

  return (
    <div className="customers">
      <div className="customers__header">
        <h1>Customers</h1>
        <button className="btn btn--primary add-btn" onClick={() => setIsCreateModalOpen(true)}>
          <PlusIcon className="icon--sm" /> {BUTTON_LABELS.ADD_CUSTOMER ?? 'Add Customer'}
        </button>
      </div>

      <div className="customers__list">
        {customers.length === 0 ? (
          <div className="empty-state">
            <h3>No customers found</h3>
            <p>Create your first customer to get started.</p>
            <button className="btn btn--primary" onClick={() => setIsCreateModalOpen(true)}>
              <PlusIcon className="icon--sm" /> {BUTTON_LABELS.ADD_CUSTOMER ?? 'Add Customer'}
            </button>
          </div>
        ) : (
          <ul>
            {customers.map((c) => (
              <li key={c.id}>
                <div className="customer-item">
                  <div className="customer-info">
                    <div className="customer-avatar"><span>{c.name.split(' ').map(n => n[0]).join('')}</span></div>
                    <div className="customer-details">
                      <div className="customer-name">{c.name}</div>
                      <div className="customer-email">{c.email || c.phone || 'No contact info'}</div>
                      {c.notes && (<div className="text-xs text-gray-600 mt-1">{c.notes.length > 60 ? `${c.notes.substring(0, 60)}...` : c.notes}</div>)}
                      {c.assigned_user && (<div className="text-xs text-gray-500 mt-1">Assigned to: {c.assigned_user.name}</div>)}
                    </div>
                  </div>
                  <div className="customer-actions">
                    <div className="customer-company">{c.source?.name ?? 'Unknown source'}</div>
                    <span className={`customer-status customer-status--active`}>Active</span>
                    <div className="flex items-center gap-2">
                      <button className="btn btn--ghost btn--sm" onClick={(e) => { e.stopPropagation(); navigate(`/leads/${c.id}`); }}>View</button>
                      <button className="btn btn--ghost btn--sm" onClick={(e) => { e.stopPropagation(); openEdit(c); }} title="Edit customer"><PencilIcon className="icon--sm" /></button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <FormModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create Customer" description="Create a new customer (stored as a converted lead)" fields={fields} buttons={buttonsCreate} onSubmit={handleCreate} loading={isAddingCustomer} />

      <FormModal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setSelectedCustomer(null); }} title="Edit Customer" description="Update customer information" fields={fields} buttons={buttonsEdit} onSubmit={handleUpdate} defaultValues={getDefaultValues()} loading={actionLoading} />
    </div>
  );
};

export default Customers; 