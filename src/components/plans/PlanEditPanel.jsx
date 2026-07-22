import { useState } from 'react';

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
        checked ? 'bg-indigo-600' : 'bg-gray-200'
      }`}
    >
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
        checked ? 'translate-x-5' : 'translate-x-1'
      }`} />
    </button>
  );
}

export default function PlanEditPanel({ plans, overrides, onChange, onClose, activePlanId }) {
  const [selectedId, setSelectedId] = useState(activePlanId || plans[0]?.id);
  const plan = plans.find(p => p.id === selectedId) || plans[0];
  const ov = overrides[plan?.id] || {};
  const [newFeature, setNewFeature] = useState('');

  if (!plan) return null;

  function update(field, value) {
    onChange(plan.id, { ...ov, [field]: value });
  }

  function updateLimit(limField, val) {
    const cur = ov.usageLimits || plan.usageLimits || {};
    onChange(plan.id, { ...ov, usageLimits: { ...cur, [limField]: Number(val) } });
  }

  function toggleFeature(idx) {
    const dis = ov.disabledFeatureIdxs || [];
    const next = dis.includes(idx) ? dis.filter(i => i !== idx) : [...dis, idx];
    onChange(plan.id, { ...ov, disabledFeatureIdxs: next });
  }

  function addCustomFeature() {
    if (!newFeature.trim()) return;
    const cur = ov.customFeatures || [];
    onChange(plan.id, { ...ov, customFeatures: [...cur, newFeature.trim()] });
    setNewFeature('');
  }

  function removeCustomFeature(idx) {
    const cur = ov.customFeatures || [];
    onChange(plan.id, { ...ov, customFeatures: cur.filter((_, i) => i !== idx) });
  }

  const price = ov.price !== undefined ? ov.price : plan.basePrice;
  const trialEnabled = ov.trialEnabled !== undefined ? ov.trialEnabled : plan.trialDays > 0;
  const trialDays = ov.trialDays !== undefined ? ov.trialDays : plan.trialDays;
  const credits = ov.credits !== undefined ? ov.credits : plan.credits;
  const popular = ov.popular !== undefined ? ov.popular : plan.popular;
  const limits = { ...plan.usageLimits, ...(ov.usageLimits || {}) };

  return (
    <div className="slide-in-right w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900 text-sm">Edit Plan</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Plan Selector Tabs */}
      <div className="flex gap-1 p-2 bg-gray-50 border-b border-gray-100 overflow-x-auto">
        {plans.map(p => (
          <button
            key={p.id}
            onClick={() => setSelectedId(p.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              selectedId === p.id ? 'bg-white text-indigo-700 shadow-sm border border-indigo-100' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto custom-scroll px-4 py-4 space-y-5">

        {/* Price */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Monthly Price</label>
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-50">
            <span className="px-3 py-2 bg-gray-50 text-gray-500 text-sm border-r border-gray-200">{plan.currency}</span>
            <input
              type="number"
              value={price}
              onChange={e => update('price', Number(e.target.value))}
              className="flex-1 px-3 py-2 text-sm outline-none bg-white"
              min={0}
            />
          </div>
          {price !== plan.basePrice && (
            <p className="text-xs text-amber-600 mt-1">AI suggested: {plan.currency}{plan.basePrice}</p>
          )}
        </div>

        {/* Trial */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-gray-600">Free Trial</label>
            <Toggle checked={trialEnabled} onChange={v => update('trialEnabled', v)} />
          </div>
          {trialEnabled && (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={trialDays || 14}
                onChange={e => update('trialDays', Number(e.target.value))}
                className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:border-indigo-400"
                min={1}
                max={90}
              />
              <span className="text-sm text-gray-500">days</span>
            </div>
          )}
        </div>

        {/* Welcome Credits */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
            Welcome Credits <span className="text-gray-400 font-normal">(monthly)</span>
          </label>
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-50">
            <span className="px-3 py-2 bg-gray-50 text-gray-500 text-sm border-r border-gray-200">{plan.currency}</span>
            <input
              type="number"
              value={credits}
              onChange={e => update('credits', Number(e.target.value))}
              className="flex-1 px-3 py-2 text-sm outline-none bg-white"
              min={0}
            />
          </div>
        </div>

        {/* Usage Limits */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2">Usage Limits <span className="text-gray-400 font-normal">(-1 = unlimited)</span></label>
          <div className="space-y-2">
            {[
              { field: 'contacts', label: 'Contacts' },
              { field: 'subAccounts', label: 'Sub-Accounts' },
              { field: 'apiCalls', label: 'API Calls / mo' },
            ].map(({ field, label }) => (
              <div key={field} className="flex items-center gap-2">
                <label className="text-xs text-gray-500 w-28 flex-shrink-0">{label}</label>
                <input
                  type="number"
                  value={limits[field] ?? -1}
                  onChange={e => updateLimit(field, e.target.value)}
                  className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:border-indigo-400"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2">Features</label>
          <div className="space-y-1.5 max-h-44 overflow-y-auto custom-scroll">
            {plan.features.map((f, i) => {
              const disabled = (ov.disabledFeatureIdxs || []).includes(i);
              return (
                <label key={i} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={!disabled}
                    onChange={() => toggleFeature(i)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className={`text-sm ${disabled ? 'line-through text-gray-400' : 'text-gray-700'}`}>{f}</span>
                </label>
              );
            })}
            {(ov.customFeatures || []).map((f, i) => (
              <div key={`custom-${i}`} className="flex items-center gap-2 group">
                <input type="checkbox" checked readOnly className="rounded border-gray-300 text-indigo-600" />
                <span className="text-sm text-indigo-700 flex-1">{f}</span>
                <button onClick={() => removeCustomFeature(i)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-1 mt-2">
            <input
              type="text"
              value={newFeature}
              onChange={e => setNewFeature(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addCustomFeature()}
              placeholder="Add custom feature..."
              className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-indigo-400"
            />
            <button
              onClick={addCustomFeature}
              disabled={!newFeature.trim()}
              className="px-2 py-1.5 bg-indigo-600 text-white rounded-lg text-xs hover:bg-indigo-700 disabled:opacity-40 transition-colors"
            >
              + Add
            </button>
          </div>
        </div>

        {/* Popular Badge */}
        <div className="flex items-center justify-between py-2 border-t border-gray-100">
          <div>
            <p className="text-xs font-semibold text-gray-600">Most Popular</p>
            <p className="text-xs text-gray-400">Highlights this plan for buyers</p>
          </div>
          <Toggle checked={popular} onChange={v => update('popular', v)} />
        </div>

      </div>
    </div>
  );
}
