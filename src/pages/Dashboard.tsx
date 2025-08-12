import React, { useMemo } from 'react';
import { useLeads } from '../hooks/useLeads';
import { useWorkItems, useTasks } from '../hooks/useWorkItems';
import { useUsers } from '../hooks/useUsers';
import { getLeadCountsByStatus, getConversionRatio, getAverageTasksPerWorkItem, getLeadConversionSeries, getAverageTaskTurnaroundHours, getTaskTurnaroundBuckets, getTasksByStatus } from '../utils/dashboard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, Legend } from 'recharts';

const Dashboard: React.FC = () => {
  const { leads, leadStatuses } = useLeads();
  const { workItems, statuses } = useWorkItems();
  const { tasks } = useTasks();
  const { users } = useUsers();

  const leadByStatusData = useMemo(() => getLeadCountsByStatus(leads, leadStatuses.map(s => s.name)), [leads, leadStatuses]);
  const conversionRate = useMemo(() => getConversionRatio(leads), [leads]);
  const avgTasksPerWorkItem = useMemo(() => getAverageTasksPerWorkItem(tasks, workItems), [tasks, workItems]);
  const conversionSeries = useMemo(() => getLeadConversionSeries(leads), [leads]);
  const avgTaskTurnaround = useMemo(() => getAverageTaskTurnaroundHours(tasks), [tasks]);
  const taskTurnaroundBuckets = useMemo(() => getTaskTurnaroundBuckets(tasks), [tasks]);
  const tasksByStatus = useMemo(() => getTasksByStatus(tasks, statuses), [tasks, statuses]);

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h1>Dashboard</h1>
      </div>

      {/* Top metrics */}
      <div className="dashboard__metrics">
        <div className="dashboard__metric-card">
          <div className="metric-content">
            <div className="metric-header">
              <div className="metric-icon metric-icon--primary">👤</div>
              <div className="metric-info">
                <div className="metric-label">Users</div>
                <div className="metric-value">{users.length}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="dashboard__metric-card">
          <div className="metric-content">
            <div className="metric-header">
              <div className="metric-icon metric-icon--success">🧲</div>
              <div className="metric-info">
                <div className="metric-label">Leads</div>
                <div className="metric-value">{leads.length}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="dashboard__metric-card">
          <div className="metric-content">
            <div className="metric-header">
              <div className="metric-icon metric-icon--warning">📦</div>
              <div className="metric-info">
                <div className="metric-label">Work Items</div>
                <div className="metric-value">{workItems.length}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="dashboard__metric-card">
          <div className="metric-content">
            <div className="metric-header">
              <div className="metric-icon metric-icon--danger">🗒️</div>
              <div className="metric-info">
                <div className="metric-label">Tasks</div>
                <div className="metric-value">{tasks.length}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="dashboard__metric-card">
          <div className="metric-content">
            <div className="metric-header">
              <div className="metric-icon metric-icon--info">🎯</div>
              <div className="metric-info">
                <div className="metric-label">Conversion Rate</div>
                <div className="metric-value">{conversionRate}%</div>
              </div>
            </div>
          </div>
        </div>
        <div className="dashboard__metric-card">
          <div className="metric-content">
            <div className="metric-header">
              <div className="metric-icon metric-icon--primary">⚙️</div>
              <div className="metric-info">
                <div className="metric-label">Avg Tasks per Work Item</div>
                <div className="metric-value">{avgTasksPerWorkItem}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="dashboard__metric-card">
          <div className="metric-content">
            <div className="metric-header">
              <div className="metric-icon metric-icon--success">⏱️</div>
              <div className="metric-info">
                <div className="metric-label">Avg Task Turnaround (hrs)</div>
                <div className="metric-value">{avgTaskTurnaround}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="dashboard__charts">
        <div className="card">
          <div className="card__header"><h3>Leads by Status</h3></div>
          <div className="card__body" style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadByStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#2563eb" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card__header"><h3>Lead Conversions Over Time</h3></div>
          <div className="card__body" style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={conversionSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="converted" name="Converted" stroke="#22c55e" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card__header"><h3>Tasks Turnaround Buckets</h3></div>
          <div className="card__body" style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taskTurnaroundBuckets}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="hours" name="Tasks" fill="#f59e0b" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card__header"><h3>Tasks by Status</h3></div>
          <div className="card__body" style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tasksByStatus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" name="Tasks" fill="#14b8a6" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 