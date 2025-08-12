import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lead } from '../services/leadService';

const LeadsListItem: React.FC<{ lead: Lead }> = ({ lead }) => {
  const navigate = useNavigate();
  return (
    <li className="lead-item" onClick={() => navigate(`/leads/${lead.id}`)} role="button" tabIndex={0}>
      <div className="lead-item__main">
        <div className="lead-item__title">{lead.name}</div>
        <div className="lead-item__subtitle">{lead.email || lead.phone || '—'}</div>
      </div>
    </li>
  );
};

export default LeadsListItem;
