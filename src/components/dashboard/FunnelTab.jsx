import FunnelPreview from '../funnel/FunnelPreview.jsx';

export default function FunnelTab({ data = {}, plans, onEdit }) {
  if (!data?.funnelStats) return null;
  const stats = [
    { label: 'Total Views', value: data.funnelStats.views.toLocaleString(), icon: '👁️', sub: 'last 30 days' },
    { label: 'Conversions', value: `${data.funnelStats.conversions} (${data.funnelStats.conversionRate}%)`, icon: '🎯', sub: 'sign-ups' },
    { label: 'Avg. Time on Page', value: data.funnelStats.avgTime, icon: '⏱️', sub: 'engagement' },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Sales Funnel</h2>
          <p className="text-sm text-gray-500">Your live checkout page performance.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Funnel
          </button>
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Republish
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-xl font-black text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label} · {s.sub}</div>
          </div>
        ))}
      </div>

      {/* Live URL */}
      <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3 mb-6 flex items-center gap-3">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0" />
        <span className="text-sm text-green-800 font-medium">Live at:</span>
        <span className="text-sm font-mono text-green-700">https://{data.domain}</span>
        <button className="ml-auto text-xs text-green-700 hover:text-green-900 border border-green-300 rounded-lg px-2 py-1">
          Open ↗
        </button>
      </div>

      {/* Funnel Preview */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden" style={{ height: 480 }}>
        <FunnelPreview plans={plans} businessName="Your Platform" />
      </div>
    </div>
  );
}
