import PlanCard from '../components/plans/PlanCard.jsx';

export default function PlanReviewView({ plans, onBack, onPublish }) {
  const gridCols = plans.length === 1 ? 'grid-cols-1 max-w-sm' :
                   plans.length === 2 ? 'grid-cols-2 max-w-3xl' :
                   plans.length === 3 ? 'grid-cols-3 max-w-5xl' : 'grid-cols-4';

  const totalMRR = plans.reduce((sum, p) => sum + p.basePrice, 0);

  return (
    <div className="min-h-screen bg-white flex flex-col view-enter">
      {/* Top Bar */}
      <div className="border-b border-gray-200 px-6 py-3 flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 text-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Edit Plans
        </button>

        <div className="flex items-center gap-1.5 flex-1 mx-4">
          {[1,2,3,4].map(n => (
            <div key={n} className="flex items-center gap-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                n <= 2 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                {n <= 2 ? (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : n}
              </div>
              {n < 4 && <div className={`w-10 h-px ${n <= 2 ? 'bg-green-300' : 'bg-gray-200'}`} />}
            </div>
          ))}
          <span className="ml-1 text-xs text-gray-500 hidden sm:block">Plans done</span>
        </div>

        <button
          onClick={onPublish}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
        >
          Create a Sales Funnel
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Hero */}
      <div className="text-center py-12 px-6 bg-gradient-to-b from-indigo-50/50 to-white">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 rounded-full px-4 py-1.5 mb-4">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm font-semibold">Plans are ready to publish</span>
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-3">Review your pricing</h1>
        <p className="text-gray-500 text-base max-w-md mx-auto">
          This is exactly what your subscribers will see. Review carefully, then connect your payment provider to go live.
        </p>

        <div className="flex items-center justify-center gap-6 mt-6">
          <div className="text-center">
            <div className="text-2xl font-black text-indigo-700">{plans.length}</div>
            <div className="text-xs text-gray-500">pricing tiers</div>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div className="text-center">
            <div className="text-2xl font-black text-indigo-700">{plans[0]?.currency}{totalMRR}</div>
            <div className="text-xs text-gray-500">potential MRR/subscriber set</div>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div className="text-center">
            <div className="text-2xl font-black text-indigo-700">{plans.filter(p => p.trialDays > 0).length}</div>
            <div className="text-xs text-gray-500">plans with free trial</div>
          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="flex-1 px-6 pb-12">
        <div className={`grid ${gridCols} gap-6 mx-auto`}>
          {plans.map(plan => (
            <PlanCard
              key={plan.id}
              plan={plan}
              variant="review"
              showReasoning={true}
            />
          ))}
        </div>

        {/* Owner note */}
        <div className="max-w-2xl mx-auto mt-8 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-amber-800">Owner's note</p>
              <p className="text-sm text-amber-700 mt-0.5">
                The "Why this pricing works" callouts are <strong>visible only to you</strong>. Your subscribers will see a clean pricing page without these notes.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto mt-4 text-center">
          <button
            onClick={onPublish}
            className="w-full py-3.5 bg-indigo-600 text-white rounded-2xl font-semibold text-base hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Create a Sales Funnel →
          </button>
          <p className="text-xs text-gray-400 mt-2">You can always edit plans later from the dashboard.</p>
        </div>
      </div>
    </div>
  );
}
