import TemplateIcon from './TemplateIcon.jsx';

export default function TemplateExploreModal({ template, onClose, onSelect }) {
  if (!template) return null;
  const e = template.explore;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overlay-in"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scroll modal-in shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header gradient */}
        <div className={`bg-gradient-to-br ${template.gradient} p-6 rounded-t-3xl relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <TemplateIcon icon={template.icon} className="text-white w-5 h-5" />
            </div>
            {template.badge && (
              <span className="text-xs bg-white/25 text-white font-bold px-2.5 py-1 rounded-full">
                {template.badge}
              </span>
            )}
          </div>
          <h2 className="text-2xl font-black text-white mb-1">{template.name}</h2>
          <p className="text-white/80 text-sm font-medium">{template.tagline}</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Headline insight */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-sm font-bold text-gray-900 mb-1">💡 {e.headline}</p>
            <p className="text-sm text-gray-600 leading-relaxed">{e.whyItWorks}</p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-indigo-50 rounded-2xl p-3 text-center">
              <p className="text-xs font-semibold text-indigo-600 mb-1">Market Size</p>
              <p className="text-sm font-bold text-gray-900 leading-tight">{e.marketSize.split('.')[0]}</p>
            </div>
            <div className="bg-green-50 rounded-2xl p-3 text-center">
              <p className="text-xs font-semibold text-green-600 mb-1">Revenue Potential</p>
              <p className="text-sm font-bold text-gray-900 leading-tight">{e.monthlyRevenuePotential}</p>
            </div>
            <div className="bg-amber-50 rounded-2xl p-3 text-center">
              <p className="text-xs font-semibold text-amber-600 mb-1">Pricing Edge</p>
              <p className="text-sm font-bold text-gray-900 leading-tight">
                {e.pricingInsight.split('.')[0].replace(/^.*?at /, 'From ').split('You can')[0]}
              </p>
            </div>
          </div>

          {/* Target customer */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Target Customer</p>
            <p className="text-sm text-gray-700 leading-relaxed">{e.targetCustomer}</p>
          </div>

          {/* Competitors vs differentiators */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">You compete with</p>
              <div className="space-y-1.5">
                {e.competitors.map(c => (
                  <div key={c} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0" />
                    {c}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Your advantages</p>
              <div className="space-y-1.5">
                {e.keyDifferentiators.map(d => (
                  <div key={d} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />
                    {d}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing insight */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
            <p className="text-xs font-semibold text-indigo-600 mb-1">Pricing Intelligence</p>
            <p className="text-sm text-indigo-900 leading-relaxed">{e.pricingInsight}</p>
          </div>

          {/* CTA */}
          <button
            onClick={() => { onSelect(template); onClose(); }}
            className={`w-full py-3.5 rounded-2xl font-bold text-white text-base bg-gradient-to-r ${template.gradient} hover:opacity-90 transition-opacity shadow-md`}
          >
            Build {template.name} →
          </button>
        </div>
      </div>
    </div>
  );
}
