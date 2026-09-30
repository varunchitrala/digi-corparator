import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Table } from '../components/Table';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { LoadingState } from '../components/LoadingState';
import { Calendar, MapPin, Plus } from 'lucide-react';

export const MeetingsPage = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    meeting_title: '',
    meeting_type: 'WARD_MEETING',
    meeting_date: '2026-08-30T11:00',
    venue: 'Ward 24 Sub-Office Hall',
    agenda_summary: ''
  });

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/meetings');
      setMeetings(res.data);
    } catch (err) {
      console.error('Failed to fetch meetings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMeeting = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/meetings', formData);
      setIsModalOpen(false);
      fetchMeetings();
    } catch (err) {
      alert(err.message || 'Failed to schedule meeting');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
            MEETINGS & GENERAL BODY
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Committee Meetings & Agendas</h2>
          <p className="text-xs text-slate-500">General Body, Standing Committee, and Ward Redressal schedule.</p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" /> Schedule Meeting
        </Button>
      </div>

      {loading ? (
        <LoadingState message="Fetching meeting schedules..." />
      ) : (
        <Table headers={['Meeting Title', 'Type', 'Date & Time', 'Venue', 'Agenda Summary', 'Status']}>
          {meetings.map((m) => (
            <tr key={m.meeting_id} className="hover:bg-slate-50">
              <td className="px-6 py-4 font-bold text-slate-900 text-xs">{m.meeting_title}</td>
              <td className="px-6 py-4 font-bold text-blue-600 text-xs">{m.meeting_type}</td>
              <td className="px-6 py-4 text-xs text-slate-600 font-semibold">{new Date(m.meeting_date).toLocaleString('en-IN')}</td>
              <td className="px-6 py-4 text-xs text-slate-600">{m.venue}</td>
              <td className="px-6 py-4 text-xs text-slate-500">{m.agenda_summary || 'Standard Agenda'}</td>
              <td className="px-6 py-4"><StatusBadge status={m.status} /></td>
            </tr>
          ))}
        </Table>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule New Ward Meeting">
        <form onSubmit={handleCreateMeeting} className="space-y-4">
          <Input label="Meeting Title" placeholder="e.g. Ward 24 Monsoon Drain Review" value={formData.meeting_title} onChange={(e) => setFormData({...formData, meeting_title: e.target.value})} required />
          <Input label="Date & Time" type="datetime-local" value={formData.meeting_date} onChange={(e) => setFormData({...formData, meeting_date: e.target.value})} required />
          <Input label="Venue" value={formData.venue} onChange={(e) => setFormData({...formData, venue: e.target.value})} required />
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Agenda Summary</label>
            <textarea rows={3} className="w-full rounded-lg border border-slate-300 p-3 text-sm" value={formData.agenda_summary} onChange={(e) => setFormData({...formData, agenda_summary: e.target.value})} placeholder="Agenda topics..." />
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submitting}>Schedule Meeting</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
