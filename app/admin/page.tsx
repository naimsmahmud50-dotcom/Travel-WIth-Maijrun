'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Phone, Mail, MapPin, Users, Calendar, Download, RefreshCw, CheckCircle } from 'lucide-react';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  destination: string;
  guests: string;
  preferences: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/inquiries');
      const data = await res.json();
      if (data.success) {
        setInquiries(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const exportCSV = () => {
    if (inquiries.length === 0) return;
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Destination', 'Guests', 'Preferences', 'Date'];
    const rows = inquiries.map((i) => [
      i.id,
      `"${i.name}"`,
      `"${i.email}"`,
      `"${i.phone}"`,
      `"${i.destination}"`,
      `"${i.guests}"`,
      `"${i.preferences.replace(/"/g, '""')}"`,
      i.createdAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `maijrun-leads-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 p-6 sm:p-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-800 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-brand-gold text-xs uppercase tracking-widest font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>VIP Executive CRM</span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-white tracking-tight">Travel With Maijrun — Lead Management</h1>
            <p className="text-neutral-400 text-xs">Real-time incoming luxury travel booking consultations and VIP requests.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchInquiries}
              className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold uppercase tracking-wider text-neutral-200 flex items-center gap-2 transition-colors border border-neutral-700"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={exportCSV}
              className="px-5 py-2.5 rounded-xl bg-brand-gold hover:bg-white text-brand-emeraldDeep text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-neutral-800/60 p-6 rounded-2xl border border-neutral-700/60 space-y-2">
            <span className="text-xs text-neutral-400 uppercase tracking-widest font-semibold">Total VIP Inquiries</span>
            <div className="text-3xl font-serif font-bold text-white">{inquiries.length}</div>
          </div>
          <div className="bg-neutral-800/60 p-6 rounded-2xl border border-neutral-700/60 space-y-2">
            <span className="text-xs text-neutral-400 uppercase tracking-widest font-semibold">Pending Concierge Action</span>
            <div className="text-3xl font-serif font-bold text-brand-gold">{inquiries.filter((i) => i.status === 'NEW').length}</div>
          </div>
          <div className="bg-neutral-800/60 p-6 rounded-2xl border border-neutral-700/60 space-y-2">
            <span className="text-xs text-neutral-400 uppercase tracking-widest font-semibold">Average Lead Value</span>
            <div className="text-3xl font-serif font-bold text-emerald-400">৳780,000+</div>
          </div>
        </div>

        {/* Inquiries Table */}
        <div className="bg-neutral-800/40 rounded-2xl border border-neutral-700/60 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-neutral-700/60 flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-white">Recent Consultation Requests</h3>
            <span className="text-xs text-neutral-400">{inquiries.length} Record(s)</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-neutral-400 text-sm">Loading confidential leads...</div>
          ) : inquiries.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <CheckCircle className="w-8 h-8 text-neutral-500 mx-auto" />
              <p className="text-neutral-400 text-sm">No new inquiries yet. Submissions from the website booking modal will appear here instantly.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-900/60 text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-700">
                  <tr>
                    <th className="py-4 px-6">Client Name</th>
                    <th className="py-4 px-6">Contact Channels</th>
                    <th className="py-4 px-6">Destination & Guests</th>
                    <th className="py-4 px-6">Halal Preferences</th>
                    <th className="py-4 px-6">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-700/50">
                  {inquiries.map((inq) => (
                    <tr key={inq.id} className="hover:bg-neutral-700/20 transition-colors">
                      <td className="py-4 px-6 font-semibold text-white">
                        {inq.name}
                        <span className="block text-[10px] text-brand-gold font-mono font-normal mt-0.5">{inq.id}</span>
                      </td>
                      <td className="py-4 px-6 space-y-1">
                        <div className="flex items-center gap-1.5 text-neutral-300">
                          <Phone className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{inq.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-neutral-400">
                          <Mail className="w-3.5 h-3.5 text-blue-400" />
                          <span>{inq.email}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 space-y-1">
                        <div className="flex items-center gap-1.5 text-white font-medium">
                          <MapPin className="w-3.5 h-3.5 text-brand-gold" />
                          <span>{inq.destination}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-neutral-400 text-[11px]">
                          <Users className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{inq.guests}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-neutral-300 max-w-xs font-light leading-relaxed">
                        {inq.preferences}
                      </td>
                      <td className="py-4 px-6 text-neutral-400 font-mono text-[11px] whitespace-nowrap">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
