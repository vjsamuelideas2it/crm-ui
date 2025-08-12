import React, { useMemo, useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import useRoles from '../hooks/useRoles';
import { useNavigate } from 'react-router-dom';
import FormModal from '../components/FormModal';
import ConfirmationModal from '../components/ConfirmationModal';
import { MESSAGES } from '../utils/Messages';
import { BUTTON_LABELS as ButtonLabels } from '../utils/ButtonLabels';
import toast from 'react-hot-toast';

const Users: React.FC = () => {
  const navigate = useNavigate();
  const { users, loading, error, createUser, updateUser, deleteUser } = useUsers();
  const { roles } = useRoles();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const initialValues = useMemo(() => {
    if (editingId) {
      const u = users.find(x => x.id === editingId);
      if (u) return { name: u.name, email: u.email ?? '', password: '', role_id: u.role?.id } as any;
    }
    return { name: '', email: '', password: '', role_id: '' } as any;
  }, [editingId, users]);

  const formFields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'password', label: 'Password', type: 'password', required: !editingId },
    { name: 'role_id', label: 'Role', type: 'select', required: true, options: roles.map(r => ({ value: r.id, label: r.name })) },
  ];

  const openCreate = () => { setEditingId(null); setIsFormOpen(true); };
  const openEdit = (id: number) => { setEditingId(id); setIsFormOpen(true); };
  const openDelete = (id: number) => { setPendingDeleteId(id); setIsConfirmOpen(true); };

  const handleSubmit = async (values: any) => {
    try {
      if (editingId) {
        await updateUser(editingId, { name: values.name, email: values.email, password: values.password || undefined, role_id: values.role_id ? Number(values.role_id) : undefined });
        toast.success(MESSAGES.USER_UPDATE_SUCCESS);
      } else {
        await createUser({ name: values.name, email: values.email, password: values.password, role_id: Number(values.role_id) });
        toast.success(MESSAGES.USER_CREATE_SUCCESS);
      }
      setIsFormOpen(false);
    } catch (e) {
      toast.error(editingId ? MESSAGES.USER_UPDATE_ERROR : MESSAGES.USER_CREATE_ERROR);
    }
  };

  const handleConfirmDelete = async () => {
    if (pendingDeleteId) {
      try {
        await deleteUser(pendingDeleteId);
        toast.success(MESSAGES.USER_DELETE_SUCCESS);
      } catch (e) {
        toast.error(MESSAGES.USER_DELETE_ERROR);
      }
      setIsConfirmOpen(false);
      setPendingDeleteId(null);
    }
  };

  return (
    <div className="leads">
      <div className="leads__header">
        <h1>Users</h1>
        <button className="btn btn--primary add-btn" onClick={openCreate}>{ButtonLabels.ADD_USER}</button>
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Loading users...</p>
        </div>
      )}
      {error && <div className="form-error">{error}</div>}

      <div className="leads__list">
        {users.length === 0 ? (
          <div className="empty-state">
            <h3>No users found</h3>
            <p>Create your first user to get started.</p>
            <button className="btn btn--primary" onClick={openCreate}>{ButtonLabels.ADD_USER}</button>
          </div>
        ) : (
          <ul>
            {users.map(u => (
              <li key={u.id}>
                <div className="lead-item" onClick={() => navigate(`/users/${u.id}`)}>
                  <div className="lead-info">
                    <div className="lead-avatar"><span>{(u.name || 'U').split(' ').map(n => n[0]).join('')}</span></div>
                    <div className="lead-details">
                      <div className="lead-name">{u.name}</div>
                      <div className="lead-email">{u.email || 'No email'}</div>
                    </div>
                  </div>
                  <div className="lead-actions">
                    <div className="lead-source">{u.role?.name || 'Role'}</div>
                    <div className="flex items-center gap-2">
                      <button className="btn btn--ghost btn--sm" onClick={(e) => { e.stopPropagation(); navigate(`/users/${u.id}`); }}>{ButtonLabels.VIEW_USER}</button>
                      <button className="btn btn--ghost btn--sm" onClick={(e) => { e.stopPropagation(); openEdit(u.id); }}>{ButtonLabels.EDIT_USER}</button>
                      <button className="btn btn--ghost btn--sm text-red-600" onClick={(e) => { e.stopPropagation(); openDelete(u.id); }}>{ButtonLabels.DELETE_USER}</button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <FormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingId ? 'Edit User' : 'Create User'}
        fields={formFields as any}
        buttons={[
          { label: ButtonLabels.CANCEL, type: 'button', variant: 'secondary', onClick: () => setIsFormOpen(false) },
          { label: editingId ? ButtonLabels.UPDATE_USER : ButtonLabels.CREATE_USER, type: 'submit', variant: 'primary' },
        ]}
        onSubmit={handleSubmit as any}
        defaultValues={initialValues}
      />

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        message={MESSAGES.CONFIRM_DELETE}
        confirmText={ButtonLabels.DELETE_USER}
        cancelText={ButtonLabels.CANCEL}
        type="danger"
      />
    </div>
  );
};

export default Users;


