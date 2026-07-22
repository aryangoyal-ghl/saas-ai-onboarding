import { useState } from 'react';
import FunnelPreview from '../components/funnel/FunnelPreview.jsx';
import { FUNNEL_TEMPLATES, DOMAINS } from '../data/templates.js';

const PRESET_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];

export default function PublishFunnelView({ plans, brandConfig, onBack, onPublish }) {
  const [selectedTemplate, setSelectedTemplate] = useState('conversion');
  const [brandColor, setBrandColor] = useState(brandConfig?.brandColor || '#6366f1');
  const [domain, setDomain] = useState(DOMAINS[0]);
  const [businessName, setBusinessName] = useState(brandConfig?.name || 'Your Platform');
  const [countdown, setCountdown] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const currentTemplate = FUNNEL_TEMPLATES.find(t => t.key === selectedTemplate);

  async function handlePublish() {
    setPublishing(true);
    await new Promise(r => setTimeout(r, 1500));
    onPublish({ domain, businessName, brandColor, theme: currentTemplate?.theme || 'light', countdown, funnelStyle: selectedTemplate, logoUrl: brandConfig?.logoUrl ?? null });
  }

  return (
    <div className="min-h-screen bg-white flex flex-col view-enter">
      {/* Top Bar */}
      <div className="border-b border-gray-200 px-6 py-3 flex items-center gap-4">
        <button
          onClick={onBack}
          disabled={publishing}
          className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 text-sm transition-colors disabled:opacity-40"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>

        {/* 3-step indicator */}
        <div className="flex items-center gap-1.5 flex-1 mx-4">
          {[1, 2, 3].map(n => (
            <div key={n} className="flex items-center gap-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                n <= 2 ? 'bg-green-500 text-white' :
                n === 3 ? 'bg-indigo-600 text-white' :
                'bg-gray-200 text-gray-400'
              }`}>
                {n <= 2 ? (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : n}
              </div>
              {n < 3 && <div className={`w-10 h-px ${n <= 2 ? 'bg-green-300' : 'bg-gray-200'}`} />}
            </div>
          ))}
          <span className="ml-2 text-xs font-medium text-gray-600">Funnel</span>
        </div>

        <button
          onClick={handlePublish}
          disabled={publishing}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-70"
        >
          {publishing ? (
            <>
              <span className="spinner w-4 h-4" />
              Publishing…
            </>
          ) : (
            <>
              Publish & Go to Dashboard
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>
      </div>

      {/* Config + Preview */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Config Panel */}
        <div className="w-[30%] flex-shrink-0 border-r border-gray-200 overflow-y-auto custom-scroll">
          <div className="p-5 space-y-6">
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-1">Build your sales funnel</h2>
              <p className="text-xs text-gray-500">Customize your sales page — it will go live with your SaaS.</p>
            </div>

            {/* Business Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Platform Name</label>
              <input
                type="text"
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
                placeholder="Your Platform"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
              />
            </div>

            {/* Template Selector */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">Funnel Style</label>
              <div className="grid grid-cols-2 gap-2">
                {FUNNEL_TEMPLATES.map(tpl => (
                  <button
                    key={tpl.key}
                    onClick={() => setSelectedTemplate(tpl.key)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      selectedTemplate === tpl.key
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-full h-8 rounded-lg mb-2 ${
                      tpl.theme === 'dark' ? 'bg-gray-900' :
                      tpl.theme === 'premium' ? 'bg-purple-950' : 'bg-gray-100'
                    }`} />
                    <p className="text-xs font-semibold text-gray-800">{tpl.name}</p>
                    <p className="text-xs text-gray-500 leading-tight mt-0.5">{tpl.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Color */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">Brand Color</label>
              <div className="flex items-center gap-2 flex-wrap">
                {PRESET_COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => setBrandColor(c)}
                    style={{ background: c }}
                    className={`w-7 h-7 rounded-full transition-transform ${
                      brandColor === c ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-105'
                    }`}
                  />
                ))}
                <input
                  type="color"
                  value={brandColor}
                  onChange={e => setBrandColor(e.target.value)}
                  className="w-7 h-7 rounded-full border-0 cursor-pointer"
                  title="Custom color"
                />
              </div>
            </div>

            {/* Countdown Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-600">Urgency Timer</p>
                <p className="text-xs text-gray-400">Add countdown to increase conversions</p>
              </div>
              <button
                onClick={() => setCountdown(!countdown)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  countdown ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                  countdown ? 'translate-x-5' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Domain */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Domain</label>
              <select
                value={domain}
                onChange={e => setDomain(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-400 bg-white"
              >
                {DOMAINS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">Your funnel will be live at https://{domain}</p>
            </div>

            {/* Publish CTA */}
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="w-full py-3 bg-indigo-600 text-white rounded-2xl font-semibold text-sm hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-70"
            >
              {publishing ? (
                <>
                  <span className="spinner w-4 h-4" />
                  Publishing…
                </>
              ) : (
                'Publish & Go to Dashboard →'
              )}
            </button>
          </div>
        </div>

        {/* Right Preview */}
        <div className="flex-1 bg-gray-100 p-6 overflow-hidden">
          <div className="text-xs text-gray-500 font-medium mb-2 text-center">Live Preview</div>
          <div className="h-full rounded-2xl overflow-hidden shadow-xl border border-gray-300">
            <FunnelPreview
              plans={plans}
              brandColor={brandColor}
              theme={currentTemplate?.theme || 'light'}
              countdown={countdown}
              businessName={businessName}
              logoUrl={brandConfig?.logoUrl}
              compact={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
