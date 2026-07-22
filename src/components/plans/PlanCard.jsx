export default function PlanCard({ plan, onEdit, variant = 'default', showReasoning = false }) {
  const isReview = variant === 'review';
  const featuresToShow = isReview ? plan.features : plan.features.slice(0, 5);

  return (
    <div className={`relative bg-white rounded-2xl border-2 transition-all flex flex-col ${
      plan.popular
        ? 'border-indigo-500 shadow-lg shadow-indigo-100'
        : 'border-gray-200 hover:border-gray-300'
    } ${isReview ? 'p-6' : 'p-5'}`}>
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
            Most Popular
          </span>
        </div>
      )}

      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className={`font-bold text-gray-900 ${isReview ? 'text-xl' : 'text-lg'}`}>{plan.name}</h3>
          {isReview && (
            <p className="text-sm text-gray-500 mt-0.5">{plan.description}</p>
          )}
        </div>
        {onEdit && (
          <button
            onClick={() => onEdit(plan.id)}
            className="text-xs text-indigo-600 border border-indigo-200 rounded-lg px-2 py-1 hover:bg-indigo-50 transition-colors ml-2 flex-shrink-0"
          >
            Edit
          </button>
        )}
      </div>

      <div className="mb-4">
        <div className="flex items-baseline gap-1">
          <span className={`font-black text-gray-900 ${isReview ? 'text-4xl' : 'text-3xl'}`}>
            {plan.currency}{plan.basePrice === 0 ? '0' : plan.basePrice.toLocaleString()}
          </span>
          <span className="text-gray-400 text-sm">/mo</span>
        </div>
        {plan.annualPrice > 0 && (
          <p className="text-xs text-gray-400 mt-0.5">{plan.currency}{plan.annualPrice.toLocaleString()}/yr · Save 2 months</p>
        )}
      </div>

      {plan.trialDays > 0 && (
        <div className="mb-3">
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
            {plan.trialDays}-day free trial
          </span>
        </div>
      )}

      <ul className="space-y-1.5 mb-4 flex-1">
        {featuresToShow.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
            <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {f}
          </li>
        ))}
        {!isReview && plan.features.length > 5 && (
          <li className="text-xs text-gray-400 mt-1">+{plan.features.length - 5} more features</li>
        )}
      </ul>

      {plan.onboardingFee > 0 && (
        <p className="text-xs text-gray-400 mb-3">+{plan.currency}{plan.onboardingFee.toLocaleString()} onboarding fee</p>
      )}

      {plan.credits > 0 && (
        <p className="text-xs text-amber-600 mb-3 font-medium">🎁 {plan.currency}{plan.credits} complimentary credits/mo</p>
      )}

      <button
        className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-colors ${
          plan.popular
            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        } ${isReview ? 'opacity-60 cursor-default' : ''}`}
        disabled={isReview}
      >
        {isReview ? 'Preview Only' : (plan.basePrice === 0 ? 'Start Free' : `Get ${plan.name}`)}
      </button>

      {isReview && showReasoning && (
        <details className="mt-4 text-xs text-gray-500 border-t border-gray-100 pt-3">
          <summary className="cursor-pointer font-medium text-gray-600 hover:text-gray-800">
            Why this pricing works
          </summary>
          <p className="mt-2 leading-relaxed">{plan.upgradeDriver}</p>
          {plan.usageLimits && (
            <div className="mt-2 grid grid-cols-3 gap-1 text-center">
              {[
                ['Contacts', plan.usageLimits.contacts],
                ['Sub-accts', plan.usageLimits.subAccounts],
                ['API calls', plan.usageLimits.apiCalls],
              ].map(([label, val]) => (
                <div key={label} className="bg-gray-50 rounded p-1.5">
                  <div className="font-semibold text-gray-700">{val === -1 ? '∞' : val?.toLocaleString()}</div>
                  <div className="text-gray-400">{label}</div>
                </div>
              ))}
            </div>
          )}
        </details>
      )}
    </div>
  );
}
