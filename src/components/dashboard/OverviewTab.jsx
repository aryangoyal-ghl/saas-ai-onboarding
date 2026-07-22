export default function OverviewTab({ data = {}, onNavigate, connectedData, onOpenSetup }) {
  if (!data?.mrr && data?.mrr !== 0) return null;
  const setupIncomplete = !connectedData?.provider;
  const metrics = [
    {
      label: 'Monthly Recurring Revenue',
      value: `$${data.mrr.toLocaleString()}`,
      sub: '+12% vs last month',
      trend: 'up',
      icon: (
        <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bg: 'bg-indigo-50',
    },
    {
      label: 'Active Subscribers',
      value: data.activeSubscribers,
      sub: `${data.trialSubscribers} in trial`,
      trend: 'up',
      icon: (
        <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      bg: 'bg-green-50',
    },
    {
      label: 'Monthly Churn Rate',
      value: `${data.churnRate}%`,
      sub: '↓ 0.3% this month',
      trend: 'down',
      icon: (
        <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
      ),
      bg: 'bg-amber-50',
    },
    {
      label: 'Avg. Revenue per User',
      value: `$${data.arpu}`,
      sub: 'per active subscriber',
      trend: 'neutral',
      icon: (
        <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      bg: 'bg-purple-50',
    },
  ];

  const quickActions = [
    { label: 'Edit Plans', desc: 'Modify pricing & features', tab: 'plans', color: 'border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50' },
    { label: 'View Funnel', desc: 'Check performance stats', tab: 'funnel', color: 'border-green-200 hover:border-green-400 hover:bg-green-50' },
    { label: 'View Subscribers', desc: 'Manage your customers', tab: 'subscribers', color: 'border-amber-200 hover:border-amber-400 hover:bg-amber-50' },
    { label: 'Advanced Settings', desc: 'Payment, security, flows', tab: 'advanced', color: 'border-gray-200 hover:border-gray-400 hover:bg-gray-50' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Setup Checklist — shown when onboarding was skipped */}
      {setupIncomplete && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-sm font-bold text-amber-800">Complete your setup <span className="font-normal text-amber-600">(2 steps remaining)</span></h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-white rounded-xl p-3 border border-amber-100">
              <div className="w-5 h-5 rounded border-2 border-amber-300 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800">Connect a payment provider</p>
                <p className="text-xs text-gray-500 mt-0.5">Accept subscription payments from your subscribers</p>
              </div>
              <button
                onClick={onOpenSetup}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 whitespace-nowrap flex-shrink-0"
              >
                Connect now →
              </button>
            </div>
            <div className="flex items-start gap-3 bg-white rounded-xl p-3 border border-amber-100">
              <div className="w-5 h-5 rounded border-2 border-amber-300 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800">Set up your domain</p>
                <p className="text-xs text-gray-500 mt-0.5">Go live at your custom URL</p>
              </div>
              <button
                onClick={onOpenSetup}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 whitespace-nowrap flex-shrink-0"
              >
                Set up →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className={`${m.bg} p-2 rounded-xl`}>{m.icon}</div>
              <span className="text-xs text-gray-500 font-medium leading-tight">{m.label}</span>
            </div>
            <div className="text-2xl font-black text-gray-900 mb-1">{m.value}</div>
            <div className={`text-xs font-medium ${
              m.trend === 'up' ? 'text-green-600' :
              m.trend === 'down' ? 'text-red-500' : 'text-gray-400'
            }`}>{m.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="col-span-1">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h3>
          <div className="space-y-2">
            {quickActions.map((a, i) => (
              <button
                key={i}
                onClick={() => onNavigate(a.tab)}
                className={`w-full text-left p-3 rounded-xl border-2 transition-all ${a.color}`}
              >
                <p className="text-sm font-semibold text-gray-800">{a.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{a.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="col-span-2">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Activity</h3>
          <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
            {data.activity.map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <div className="w-2 h-2 rounded-full bg-indigo-400 flex-shrink-0" />
                <p className="text-sm text-gray-700 flex-1">{item.text}</p>
                <span className="text-xs text-gray-400 flex-shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
