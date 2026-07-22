import { useState } from 'react';
import FunnelPreview from '../components/funnel/FunnelPreview.jsx';

const sleep = ms => new Promise(r => setTimeout(r, ms));

export default function FunnelPreviewFullView({ plans, funnelConfig, onBack, onLaunch }) {
  const [launching, setLaunching] = useState(false);
  const [launched, setLaunched] = useState(false);

  const { domain = 'app.yourcompany.com', businessName = 'Your Platform', brandColor = '#6366f1', theme = 'light', countdown = false, logoUrl = null } = funnelConfig || {};

  async function handleLaunch() {
    setLaunching(true);
    await sleep(1800);
    setLaunching(false);
    setLaunched(true);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 view-enter">
      {/* Top bar */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center gap-4 flex-shrink-0">
        <button
          onClick={onBack}
          disabled={launching || launched}
          className="flex items-center gap-1.5 text-gray-400 hover:text-gray-200 text-sm transition-colors disabled:opacity-40"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Editor
        </button>

        {/* URL bar mock */}
        <div className="flex-1 flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-xl px-4 py-1.5 max-w-lg mx-auto">
          <svg className="w-3.5 h-3.5 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="text-gray-300 text-xs font-mono flex-1 truncate">https://{domain}</span>
          <span className="text-xs text-gray-500 flex-shrink-0 bg-gray-700 px-2 py-0.5 rounded-md">Preview</span>
        </div>

        {!launched ? (
          <button
            onClick={handleLaunch}
            disabled={launching}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            {launching ? (
              <>
                <span className="spinner w-4 h-4" />
                Publishing…
              </>
            ) : (
              <>
                🚀 Go to Dashboard
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        ) : (
          <button
            onClick={() => onLaunch(domain)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm modal-in"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Open SaaS Dashboard
          </button>
        )}
      </div>

      {/* Published banner */}
      {launched && (
        <div className="bg-green-600 text-white text-sm font-semibold text-center py-2.5 flex items-center justify-center gap-2 modal-in flex-shrink-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Your funnel is live at https://{domain} — click "Open SaaS Dashboard" to continue
        </div>
      )}

      {/* Browser chrome */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-2 flex items-center gap-2 flex-shrink-0">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-green-500/60" />
        </div>
        <div className="flex-1 bg-gray-800 rounded-md px-3 py-1 text-xs text-gray-400 font-mono max-w-md mx-auto truncate">
          https://{domain}
        </div>
      </div>

      {/* Full funnel website */}
      <div className="flex-1 overflow-hidden bg-white">
        <FunnelPreview
          plans={plans}
          brandColor={brandColor}
          theme={theme}
          countdown={countdown}
          businessName={businessName}
          logoUrl={logoUrl}
          compact={false}
        />
      </div>
    </div>
  );
}
