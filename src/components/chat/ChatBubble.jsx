import { INDUSTRY_CHIPS, REGION_CHIPS } from '../../data/industry.js';

function IndustrySelectUI({ onSelect }) {
  return (
    <div className="mt-2 grid grid-cols-2 gap-2">
      {INDUSTRY_CHIPS.map(c => (
        <button
          key={c.key}
          onClick={() => onSelect(c.key, c.label)}
          className="text-left px-3 py-2 rounded-lg border border-gray-200 bg-white hover:border-indigo-400 hover:bg-indigo-50 text-sm transition-colors"
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}

function RegionSelectUI({ onSelect }) {
  return (
    <div className="mt-2 grid grid-cols-2 gap-2">
      {REGION_CHIPS.map(c => (
        <button
          key={c.key}
          onClick={() => onSelect(c.key, c.label)}
          className="text-left px-3 py-2 rounded-lg border border-gray-200 bg-white hover:border-indigo-400 hover:bg-indigo-50 text-sm transition-colors"
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}

function PlanReasoningUI({ text }) {
  return (
    <div className="mt-2 p-3 rounded-lg bg-indigo-50 border border-indigo-100 text-sm text-indigo-900 leading-relaxed">
      {text.split('\n').map((line, i) => {
        if (!line.trim()) return null;
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={i} className={i > 0 ? 'mt-1' : ''}>
            {parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}
          </p>
        );
      })}
    </div>
  );
}

const TRIAL_OPTIONS = [
  { key: '7',  label: '7 days' },
  { key: '14', label: '14 days' },
  { key: '30', label: '30 days' },
  { key: '0',  label: 'No trial' },
];

function TrialOptionsUI({ onSelect }) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {TRIAL_OPTIONS.map(o => (
        <button
          key={o.key}
          onClick={() => onSelect(o.key, o.label)}
          className="px-4 py-2 rounded-xl border border-gray-200 bg-white hover:border-indigo-400 hover:bg-indigo-50 text-sm font-medium transition-colors"
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

const USAGE_OPTIONS = [
  {
    key: 'included',
    title: 'All-included',
    desc: 'Unlimited usage bundled in every plan',
    icon: '∞',
    color: 'border-green-200 hover:border-green-400 hover:bg-green-50',
  },
  {
    key: 'bundle',
    title: 'Bundle credits',
    desc: 'Set monthly credit limits per tier',
    icon: '📦',
    color: 'border-blue-200 hover:border-blue-400 hover:bg-blue-50',
  },
  {
    key: 'pay-per-use',
    title: 'Pay-per-use',
    desc: 'Subscribers pay for what they use',
    icon: '⚡',
    color: 'border-amber-200 hover:border-amber-400 hover:bg-amber-50',
  },
];

function UsageOptionsUI({ onSelect }) {
  return (
    <div className="mt-2 space-y-2">
      {USAGE_OPTIONS.map(o => (
        <button
          key={o.key}
          onClick={() => onSelect(o.key, o.title)}
          className={`w-full text-left p-3 rounded-xl border-2 transition-all ${o.color}`}
        >
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-base">{o.icon}</span>
            <p className="text-sm font-semibold text-gray-800">{o.title}</p>
          </div>
          <p className="text-xs text-gray-500 leading-tight ml-6">{o.desc}</p>
        </button>
      ))}
    </div>
  );
}

const MARKUP_OPTIONS = [
  { key: '1',    label: '1× (cost)' },
  { key: '1.5',  label: '1.5×' },
  { key: '2',    label: '2×' },
  { key: '3',    label: '3×' },
];

function MarkupOptionsUI({ onSelect }) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {MARKUP_OPTIONS.map(o => (
        <button
          key={o.key}
          onClick={() => onSelect(o.key, o.label)}
          className="px-4 py-2 rounded-xl border border-gray-200 bg-white hover:border-indigo-400 hover:bg-indigo-50 text-sm font-medium transition-colors"
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function ChatBubble({
  msg,
  onIndustrySelect,
  onRegionSelect,
  onTrialSelect,
  onUsageSelect,
  onMarkupSelect,
}) {
  const isUser = msg.role === 'user';

  return (
    <div className={`fade-in flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold mr-2 mt-0.5 flex-shrink-0">
          AI
        </div>
      )}
      <div className={`max-w-[85%] ${isUser ? '' : 'flex-1'}`}>
        <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-indigo-600 text-white rounded-tr-sm'
            : 'bg-gray-100 text-gray-800 rounded-tl-sm'
        }`}>
          {msg.text}
        </div>
        {msg.ui === 'industry' && (
          <IndustrySelectUI onSelect={onIndustrySelect} />
        )}
        {msg.ui === 'region' && (
          <RegionSelectUI onSelect={onRegionSelect} />
        )}
        {msg.ui === 'reasoning' && msg.reasoning && (
          <PlanReasoningUI text={msg.reasoning} />
        )}
        {msg.ui === 'trial-options' && (
          <TrialOptionsUI onSelect={onTrialSelect} />
        )}
        {msg.ui === 'usage-options' && (
          <UsageOptionsUI onSelect={onUsageSelect} />
        )}
        {msg.ui === 'markup-options' && (
          <MarkupOptionsUI onSelect={onMarkupSelect} />
        )}
      </div>
    </div>
  );
}
