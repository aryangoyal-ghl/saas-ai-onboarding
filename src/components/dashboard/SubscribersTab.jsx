import { useState } from 'react';

const STATUS_MAP = {
  active:  { label: 'Active',  cls: 'badge-active' },
  trial:   { label: 'Trial',   cls: 'badge-trial' },
  churned: { label: 'Churned', cls: 'badge-churned' },
  paused:  { label: 'Paused',  cls: 'badge-paused' },
};

function Avatar({ name }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const colors = ['bg-indigo-500', 'bg-green-500', 'bg-amber-500', 'bg-red-500', 'bg-purple-500', 'bg-teal-500', 'bg-pink-500'];
  const idx = name.charCodeAt(0) % colors.length;
  return (
    <div className={`w-8 h-8 rounded-full ${colors[idx]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
      {initials}
    </div>
  );
}

export default function SubscribersTab({ subscribers }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = (subscribers || []).filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                        s.email.toLowerCase().includes(search.toLowerCase()) ||
                        s.planName.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || s.status === filter;
    return matchSearch && matchFilter;
  });

  const totalMRR = filtered.filter(s => s.status !== 'churned').reduce((sum, s) => sum + s.mrr, 0);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Subscribers</h2>
          <p className="text-sm text-gray-500">{(subscribers || []).length} total · ${totalMRR.toLocaleString()} MRR</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Subscriber
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search subscribers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
          />
        </div>
        <div className="flex items-center bg-gray-100 rounded-xl p-1">
          {['all', 'active', 'trial', 'churned'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['Subscriber', 'Plan', 'Status', 'MRR', 'Joined', 'Actions'].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(s => {
              const statusInfo = STATUS_MAP[s.status] || STATUS_MAP.active;
              return (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={s.name} />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{s.name}</p>
                        <p className="text-xs text-gray-400">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-700">{s.planName}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusInfo.cls}`}>
                      {statusInfo.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-semibold ${s.status === 'churned' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                      {s.status === 'churned' ? '$0' : `$${s.mrr}/mo`}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-500">{s.joined}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="text-xs text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded-lg hover:bg-indigo-50 transition-colors font-medium">
                        View
                      </button>
                      <button className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors">
                        Change Plan
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-sm text-gray-400">No subscribers found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
