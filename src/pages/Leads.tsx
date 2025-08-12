import React, { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useLeads } from '../hooks/useLeads';
import { useUsers } from '../hooks/useUsers';
import { Lead } from '../services/leadService';
import FormModal from '../components/FormModal';
import { FormField, FormButton } from '../components/CommonForm';
import StatusBadge from '../components/StatusBadge';
import ConfirmationModal from '../components/ConfirmationModal';
import { BUTTON_LABELS } from '../utils/ButtonLabels';
import { MESSAGES } from '../utils/Messages';
import { useNavigate } from 'react-router-dom';

interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  status_id: number;
  source_id: number;
  assigned_to: number;
  notes: string;
}

const Leads: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const navigate = useNavigate();

  // Hooks
  const { 
    leads, 
    leadStatuses,
    sources,
    loading: leadsLoading, 
    statusesLoading,
    sourcesLoading,
    error: leadsError,
    statusesError,
    sourcesError,
    actionLoading,
    createLead,
    updateLead,
    deleteLead,
    convertLead,
    refetch
  } = useLeads();

  const { users, loading: usersLoading, error: usersError } = useUsers();

  const getFormFields = (): FormField<LeadFormData>[] => [
    { name: 'name', label: 'Lead Name', type: 'text', required: true, placeholder: 'Enter lead name', validation: { required: MESSAGES.VALIDATION_REQUIRED, minLength: { value: 2, message: MESSAGES.VALIDATION_NAME_MIN } } },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter email address', helpText: 'Primary contact email for this lead' },
    { name: 'phone', label: 'Phone', type: 'tel', placeholder: 'Enter phone number', helpText: 'Contact phone number' },
    { name: 'status_id', label: 'Status', type: 'select', required: true, loading: statusesLoading, error: statusesError || undefined, options: leadStatuses.map(status => ({ value: status.id, label: status.name, disabled: !status.is_active })), helpText: 'Current status of the lead' },
    { name: 'source_id', label: 'Source', type: 'select', required: true, loading: sourcesLoading, error: sourcesError || undefined, options: sources.map(source => ({ value: source.id, label: source.name, disabled: !source.is_active })), helpText: 'How did this lead find us?' },
    { name: 'assigned_to', label: 'Assigned To', type: 'select', loading: usersLoading, error: usersError || undefined, options: users.map(user => ({ value: user.id, label: `${user.name} (${user.role.name})`, disabled: false })), helpText: 'Assign this lead to a team member' },
    { name: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Enter any additional notes about this lead', helpText: 'Internal notes about the lead' }
  ];

  const getFormButtons = (isEdit: boolean = false): FormButton[] => [
    { label: BUTTON_LABELS.CANCEL, type: 'button', variant: 'secondary', onClick: () => { setIsCreateModalOpen(false); setIsEditModalOpen(false); setSelectedLead(null); } },
    { label: isEdit ? BUTTON_LABELS.UPDATE : BUTTON_LABELS.CREATE, type: 'submit', variant: 'primary', loading: actionLoading }
  ];

  const handleCreateLead = async (data: LeadFormData) => {
    try {
      await createLead({ name: data.name, email: data.email || undefined, phone: data.phone || undefined, status_id: data.status_id, source_id: data.source_id, assigned_to: data.assigned_to || undefined, notes: data.notes || undefined });
      setIsCreateModalOpen(false);
    } catch (error) { console.error('Error creating lead:', error); }
  };

  const handleUpdateLead = async (data: LeadFormData) => {
    if (!selectedLead) return;
    try {
      await updateLead(selectedLead.id, { name: data.name, email: data.email || undefined, phone: data.phone || undefined, status_id: data.status_id, source_id: data.source_id, assigned_to: data.assigned_to || undefined, notes: data.notes || undefined });
      setIsEditModalOpen(false);
      setSelectedLead(null);
    } catch (error) { console.error('Error updating lead:', error); }
  };

  const handleDeleteLead = async () => {
    if (!selectedLead) return;
    try {
      await deleteLead(selectedLead.id);
      setIsDeleteModalOpen(false);
      setSelectedLead(null);
    } catch (error) { console.error('Error deleting lead:', error); }
  };

  const handleConvertLead = async (leadId: number) => {
    try { setIsConverting(true); await convertLead(leadId); } catch (error) { console.error('Error converting lead:', error); } finally { setIsConverting(false); }
  };

  const openEditModal = (lead: Lead) => { setSelectedLead(lead); setIsEditModalOpen(true); };
  const openDeleteModal = (lead: Lead) => { setSelectedLead(lead); setIsDeleteModalOpen(true); };

  const getDefaultValues = (): Partial<LeadFormData> => !selectedLead ? {} : ({ name: selectedLead.name, email: selectedLead.email || '', phone: selectedLead.phone || '', status_id: selectedLead.status?.id || 0, source_id: selectedLead.source?.id || 0, assigned_to: selectedLead.assigned_to || 0, notes: selectedLead.notes || '' });

  if (leadsLoading) {
    return (
      <div className="page-content">
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Loading leads...</p>
        </div>
      </div>
    );
  }

  if (leadsError) {
    return (
      <div className="page-content">
        <div className="error-state">
          <h3>Error Loading Leads</h3>
          <p>{leadsError}</p>
          <button onClick={refetch} className="btn btn--primary">
            <ArrowPathIcon className="icon--sm" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="leads">
      <div className="leads__header">
        <h1>Leads</h1>
        <button onClick={() => setIsCreateModalOpen(true)} className="btn btn--primary add-btn">
          <PlusIcon className="icon--sm" />
          {BUTTON_LABELS.ADD_LEAD}
        </button>
      </div>

      <div className="leads__list">
        {leads.length === 0 ? (
          <div className="empty-state">
            <h3>No leads found</h3>
            <p>Start by creating your first lead.</p>
            <button onClick={() => setIsCreateModalOpen(true)} className="btn btn--primary">
              <PlusIcon className="icon--sm" />
              {BUTTON_LABELS.ADD_LEAD}
            </button>
          </div>
        ) : (
          <ul>
            {leads.map((lead) => (
              <li key={lead.id}>
                <div className="lead-item">
                  <div className="lead-info">
                    <div className="lead-avatar"><span>{lead.name.split(' ').map(n => n[0]).join('')}</span></div>
                    <div className="lead-details">
                      <div className="lead-name">{lead.name}</div>
                      <div className="lead-email">{lead.email || lead.phone || 'No contact info'}</div>
                      {lead.notes && (<div className="text-xs text-gray-600 mt-1">{lead.notes.length > 50 ? `${lead.notes.substring(0, 50)}...` : lead.notes}</div>)}
                      {lead.assigned_user && (<div className="text-xs text-gray-500 mt-1">Assigned to: {lead.assigned_user.name}</div>)}
                    </div>
                  </div>
                  <div className="lead-actions">
                    <div className="lead-source">{lead.source?.name || 'Unknown'}</div>
                    <StatusBadge status={lead.status?.name || 'Unknown'} size="sm" />
                    <div className="flex items-center gap-2">
                      <button className="btn btn--ghost btn--sm" onClick={(e) => { e.stopPropagation(); navigate(`/leads/${lead.id}`); }}>View</button>
                      <button className="btn btn--ghost btn--sm" onClick={(e) => { e.stopPropagation(); openEditModal(lead); }} title="Edit lead"><PencilIcon className="icon--sm" /></button>
                      <button className="btn btn--ghost btn--sm text-red-600" onClick={(e) => { e.stopPropagation(); openDeleteModal(lead); }} title="Delete lead"><TrashIcon className="icon--sm" /></button>
                      {!lead.is_converted && (
                        <button className="btn btn--primary btn--sm convert-btn" onClick={(e) => { e.stopPropagation(); handleConvertLead(lead.id); }} disabled={isConverting || actionLoading}>
                          {isConverting ? (<div className="btn-spinner icon--sm" />) : (BUTTON_LABELS.CONVERT_LEAD)}
                        </button>
                      )}
                      {lead.is_converted && (<span className="text-green-600 font-medium text-sm">✓ Converted</span>)}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <FormModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Lead" description="Add a new lead to your CRM system" fields={getFormFields()} buttons={getFormButtons(false)} onSubmit={handleCreateLead} loading={actionLoading} />

      <FormModal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setSelectedLead(null); }} title="Edit Lead" description="Update lead information" fields={getFormFields()} buttons={getFormButtons(true)} onSubmit={handleUpdateLead} defaultValues={getDefaultValues()} loading={actionLoading} />

      <ConfirmationModal isOpen={isDeleteModalOpen} onClose={() => { setIsDeleteModalOpen(false); setSelectedLead(null); }} onConfirm={handleDeleteLead} title="Delete Lead" message={MESSAGES.CONFIRM_DELETE_LEAD} confirmText={BUTTON_LABELS.DELETE} cancelText={BUTTON_LABELS.CANCEL} loading={actionLoading} type="danger" />
    </div>
  );
};

export default Leads; 