import { useState } from 'react';

export default function PlansTab({ plans, onEditPlans }) {
  const [billing, setBilling] = useState('monthly');
  const [expandedPlan, setExpandedPlan] = useState(null);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Plans & Pricing</h2>
          <p className="text-sm text-gray-500">You can either offer our recommended plans or build your own packages.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Billing toggle */}
          <div className="flex items-center bg-gray-100 rounded-xl p-1">
            {['monthly', 'annual'].map(b => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  billing === b ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {b === 'annual' ? 'Annual · Save 17%' : 'Monthly'}
              </button>
            ))}
          </div>
          <button
            onClick={onEditPlans}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add your plan
          </button>
        </div>
      </div>

      {/* Plans */}
      <div className="space-y-4">
        {(plans || []).map((plan, idx) => (
          <div key={plan.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="flex items-start gap-4 p-5">
              {/* Plan info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                  {plan.popular && (
                    <span className="text-xs bg-indigo-100 text-indigo-700 font-semibold px-2 py-0.5 rounded-full">popular</span>
                  )}
                  {idx === 0 && (
                    <span className="text-xs bg-gray-100 text-gray-600 font-semibold px-2 py-0.5 rounded-full">default</span>
                  )}
                </div>
                <p className="text-xs text-indigo-600 font-mono mb-3">{plan.id}</p>

                {/* Features grid */}
                <div className="flex items-center gap-1 flex-wrap">
                  {plan.features.slice(0, 8).map((f, i) => (
                    <span key={i} className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center text-sm" title={f}>
                      {['🤖','📊','👥','💬','📅','🔗','📱','⚡','🎯','📧','🔒','✨'][i % 12]}
                    </span>
                  ))}
                  {plan.features.length > 8 && (
                    <span className="text-xs text-gray-400 ml-1">+{plan.features.length - 8} more</span>
                  )}
                </div>

                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                  <span>🕐 {plan.trialDays || 0} Days trial period</span>
                  {plan.credits > 0 && <span>💳 {plan.currency}{plan.credits} Complimentary credits</span>}
                </div>
              </div>

              {/* Pricing columns */}
              <div className="flex items-start gap-4 flex-shrink-0">
                {/* Monthly */}
                <div className="text-center min-w-[120px]">
                  <p className="text-xs text-indigo-600 font-semibold mb-1 flex items-center justify-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                    </svg>
                    Monthly
                  </p>
                  <p className="text-3xl font-black text-gray-900">
                    {billing === 'monthly'
                      ? `${plan.currency}${plan.basePrice}`
                      : `${plan.currency}${plan.annualPrice}`}
                  </p>
                  <button className="text-xs text-gray-500 hover:text-gray-700 mt-1 flex items-center justify-center gap-1 mx-auto">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy sale link
                  </button>
                </div>

                {/* Annual */}
                <div className="text-center min-w-[120px]">
                  <p className="text-xs text-indigo-600 font-semibold mb-1 flex items-center justify-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                    </svg>
                    Annual
                  </p>
                  <p className="text-3xl font-black text-gray-900">
                    {billing === 'monthly'
                      ? `${plan.currency}${plan.annualPrice}`
                      : `${plan.currency}${plan.basePrice}`}
                  </p>
                  <button className="text-xs text-gray-500 hover:text-gray-700 mt-1 flex items-center justify-center gap-1 mx-auto">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy sale link
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  No snapshot attached
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={onEditPlans}
                    className="flex items-center gap-1 text-xs text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit details
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg transition-colors">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
