import { differenceInHours } from 'date-fns/differenceInHours';
import { parseISO } from 'date-fns/parseISO';
import { Lead } from '../services/leadService';
import { WorkItem, Task, WorkStatus } from '../services/workItemService';

export interface LeadByStatusPoint { name: string; value: number }
export interface ConversionSeriesPoint { date: string; converted: number }
export interface TurnaroundPoint { name: string; hours: number }

const toDate = (d: string | Date) => (typeof d === 'string' ? parseISO(d) : d);

export function getLeadCountsByStatus(leads: Lead[], statuses: string[]): LeadByStatusPoint[] {
  const map: Record<string, number> = {};
  for (const s of statuses) map[s] = 0;
  for (const l of leads) {
    const name = l.status?.name || 'UNKNOWN';
    map[name] = (map[name] ?? 0) + 1;
  }
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

export function getConversionRatio(leads: Lead[]) {
  const total = leads.length || 1;
  const converted = leads.filter(l => l.is_converted).length;
  return Math.round((converted / total) * 1000) / 10; // 1 decimal
}

export function getAverageTasksPerWorkItem(tasks: Task[], workItems: WorkItem[]) {
  const count = workItems.length || 1;
  const avg = tasks.length / count;
  return Math.round(avg * 10) / 10;
}

export function getLeadConversionSeries(leads: Lead[]): ConversionSeriesPoint[] {
  // Group by day of updated_at for converted leads
  const map: Record<string, number> = {};
  leads.filter(l => l.is_converted).forEach(l => {
    const d = toDate(l.updated_at);
    const key = d.toISOString().substring(0, 10);
    map[key] = (map[key] ?? 0) + 1;
  });
  return Object.entries(map).sort(([a], [b]) => a.localeCompare(b)).map(([date, converted]) => ({ date, converted }));
}

export function getAverageTaskTurnaroundHours(tasks: Task[]): number {
  if (tasks.length === 0) return 0;
  let total = 0;
  let n = 0;
  tasks.forEach(t => {
    const created = toDate(t.created_at);
    const updated = toDate(t.updated_at);
    const hours = Math.max(0, differenceInHours(updated, created));
    total += hours; n += 1;
  });
  return Math.round((total / (n || 1)) * 10) / 10;
}

export function getTaskTurnaroundBuckets(tasks: Task[]): TurnaroundPoint[] {
  const buckets = [
    { label: '< 24h', test: (h: number) => h < 24 },
    { label: '1-3d', test: (h: number) => h >= 24 && h < 72 },
    { label: '3-7d', test: (h: number) => h >= 72 && h < 168 },
    { label: '7d+', test: (h: number) => h >= 168 },
  ];
  const counts: Record<string, number> = {};
  buckets.forEach(b => counts[b.label] = 0);
  tasks.forEach(t => {
    const h = Math.max(0, differenceInHours(toDate(t.updated_at), toDate(t.created_at)));
    const b = buckets.find(x => x.test(h));
    if (b) counts[b.label] += 1;
  });
  return buckets.map(b => ({ name: b.label, hours: counts[b.label] }));
}

export function getTasksByStatus(tasks: Task[], statuses: WorkStatus[]): LeadByStatusPoint[] {
  const map: Record<number, number> = {};
  tasks.forEach(t => {
    const k = t.status_id ?? t.status?.id;
    if (typeof k === 'number') map[k] = (map[k] ?? 0) + 1;
  });
  return statuses.map(s => ({ name: s.name, value: map[s.id] ?? 0 }));
}
