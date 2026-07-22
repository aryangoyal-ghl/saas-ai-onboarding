import { useState } from 'react';
import { LANDING_TEMPLATES } from '../data/templates.js';
import TemplateIcon from '../components/shared/TemplateIcon.jsx';
import TemplateExploreModal from '../components/shared/TemplateExploreModal.jsx';

export default function LandingPage({ onSubmitPrompt, onSelectTemplate }) {
  const [prompt, setPrompt] = useState('');
  const [exploreTemplate, setExploreTemplate] = useState(null);

  function handleSubmit() {
    const trimmed = prompt.trim();
    if (!trimmed) return;
    onSubmitPrompt(trimmed);
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  }

  // Split into featured (first 4) and the rest
  const featured = LANDING_TEMPLATES.slice(0, 4);
  const others = LANDING_TEMPLATES.slice(4);

  return (
    <div className="landing-bg min-h-screen flex flex-col view-enter">
      {/* Top nav */}
      <nav className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-white font-bold text-sm tracking-wide">HighLevel SaaS</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-xs">Powered by AI</span>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        </div>
      </nav>

      {/* Hero */}
      <div className="flex flex-col items-center px-6 pt-8 pb-4">
        <div className="text-center mb-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-5 border border-white/20">
            <span className="text-xs text-indigo-300 font-medium">AI-Powered SaaS Builder</span>
            <span className="bg-indigo-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">NEW</span>
          </div>
          <h1 className="text-5xl font-black text-white leading-tight tracking-tight mb-3">
            Let's build something
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
              amazing
            </span>
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto">
            Describe your SaaS idea and we'll generate AI-optimized pricing, a sales funnel, and launch everything — in minutes.
          </p>
        </div>

        {/* Prompt Input */}
        <div className="w-full max-w-2xl mb-6">
          <div className="bg-white rounded-2xl shadow-2xl shadow-black/40 overflow-hidden border border-white/20">
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Describe your SaaS business idea... e.g. 'I want to build a booking platform for salons in the UK'"
              rows={3}
              className="w-full px-5 py-4 text-gray-800 text-base resize-none outline-none placeholder-gray-400 leading-relaxed"
            />
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-gray-500 font-mono">Enter</kbd>
                <span>to submit</span>
              </div>
              <button
                onClick={handleSubmit}
                disabled={!prompt.trim()}
                className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-xl font-semibold text-sm hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Build it
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 w-full max-w-5xl mb-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-gray-400 text-sm font-medium whitespace-nowrap">Or start with a proven business model</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Featured Templates — prominent 2×2 grid */}
        <div className="w-full max-w-5xl mb-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {featured.map(tpl => (
              <TemplateCard
                key={tpl.key}
                tpl={tpl}
                featured
                onSelect={onSelectTemplate}
                onExplore={setExploreTemplate}
              />
            ))}
          </div>
        </div>

        {/* More templates — compact row */}
        <div className="w-full max-w-5xl mb-10">
          <p className="text-gray-500 text-xs font-medium uppercase tracking-widest mb-3 text-center">More options</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {others.map(tpl => (
              <TemplateCard
                key={tpl.key}
                tpl={tpl}
                featured={false}
                onSelect={onSelectTemplate}
                onExplore={setExploreTemplate}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Explore Modal */}
      {exploreTemplate && (
        <TemplateExploreModal
          template={exploreTemplate}
          onClose={() => setExploreTemplate(null)}
          onSelect={onSelectTemplate}
        />
      )}
    </div>
  );
}

function TemplateCard({ tpl, featured, onSelect, onExplore }) {
  return (
    <div className={`template-card bg-white/8 border border-white/12 rounded-2xl overflow-hidden backdrop-blur-sm group ${featured ? '' : ''}`}>
      {/* Gradient header */}
      <div className={`bg-gradient-to-br ${tpl.gradient} ${featured ? 'p-5' : 'p-3'} relative`}>
        <div className="flex items-start justify-between">
          <div className={`${tpl.iconBg} bg-opacity-30 rounded-xl ${featured ? 'p-2.5' : 'p-2'}`}>
            <TemplateIcon icon={tpl.icon} className={`text-white ${featured ? 'w-5 h-5' : 'w-4 h-4'}`} />
          </div>
          {tpl.badge && (
            <span className={`text-xs bg-white/25 text-white font-bold px-2 py-0.5 rounded-full ${featured ? '' : 'text-[10px]'}`}>
              {tpl.badge}
            </span>
          )}
        </div>
        {featured && (
          <p className="text-white/70 text-xs mt-3 font-medium leading-tight">{tpl.tagline}</p>
        )}
      </div>

      {/* Body */}
      <div className={`${featured ? 'p-4' : 'p-3'}`}>
        <h3 className={`text-white font-bold leading-tight mb-1 ${featured ? 'text-base' : 'text-sm'}`}>{tpl.name}</h3>
        <p className={`text-gray-400 leading-relaxed mb-3 ${featured ? 'text-sm' : 'text-xs'}`}>{tpl.description}</p>

        <div className="flex gap-2">
          <button
            onClick={() => onSelect(tpl)}
            className={`flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-colors text-center ${featured ? 'py-2 text-sm' : 'py-1.5 text-xs'}`}
          >
            Start building
          </button>
          <button
            onClick={e => { e.stopPropagation(); onExplore(tpl); }}
            className={`bg-white/5 hover:bg-white/15 text-white/70 hover:text-white font-medium rounded-xl transition-colors border border-white/10 ${featured ? 'px-3 py-2 text-sm' : 'px-2.5 py-1.5 text-xs'}`}
            title="Learn more about this business model"
          >
            Explore
          </button>
        </div>
      </div>
    </div>
  );
}
