import { useState, useRef } from 'react';

const PRESET_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
  '#f97316', '#f59e0b', '#10b981', '#06b6d4',
  '#3b82f6', '#0f172a',
];

function StepDot({ n, state }) {
  // state: 'done' | 'active' | 'pending'
  const base = 'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors';
  const cls = state === 'done'   ? `${base} bg-green-500 text-white`
            : state === 'active' ? `${base} bg-indigo-600 text-white`
            :                      `${base} bg-gray-200 text-gray-400`;
  return (
    <div className={cls}>
      {state === 'done' ? (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : n}
    </div>
  );
}

function Steps({ current }) {
  // current: 1=brand, 2=plans, 3=funnel
  const labels = ['Brand', 'Plans', 'Funnel'];
  return (
    <div className="flex items-center gap-1">
      {labels.map((label, i) => {
        const n = i + 1;
        const state = n < current ? 'done' : n === current ? 'active' : 'pending';
        return (
          <div key={n} className="flex items-center gap-1">
            <StepDot n={n} state={state} />
            {n < 3 && <div className={`w-8 h-px ${n < current ? 'bg-green-300' : 'bg-gray-200'}`} />}
          </div>
        );
      })}
      <span className="ml-2 text-xs text-gray-500 hidden sm:block">{labels[current - 1]}</span>
    </div>
  );
}

export default function BrandSetupView({ initialContext, onBack, onContinue }) {
  const [name, setName]           = useState(initialContext?.templateName?.replace(' SaaS', '').replace(' Suite', '') || '');
  const [tagline, setTagline]     = useState('');
  const [brandColor, setBrandColor] = useState('#6366f1');
  const [logoUrl, setLogoUrl]     = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef(null);

  const displayName = name.trim() || 'Your Brand';
  const initials    = displayName.slice(0, 2).toUpperCase();

  // ── Logo handling ──
  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => setLogoUrl(e.target.result);
    reader.readAsDataURL(file);
  }

  function onFilePick(e) { handleFile(e.target.files[0]); }

  function onDragOver(e)  { e.preventDefault(); setIsDragging(true); }
  function onDragLeave()  { setIsDragging(false); }
  function onDrop(e)      { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); }

  function handleContinue() {
    onContinue({ name: displayName, brandColor, logoUrl, tagline: tagline.trim() });
  }

  const canContinue = name.trim().length >= 1;

  return (
    <div className="min-h-screen bg-white flex flex-col view-enter">

      {/* ── Top Bar ── */}
      <div className="border-b border-gray-200 px-6 py-3 flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 text-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>

        <div className="flex-1"><Steps current={1} /></div>

        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          Continue to Plans
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left: Form ── */}
        <div className="w-[420px] flex-shrink-0 overflow-y-auto custom-scroll border-r border-gray-100 bg-white">
          <div className="px-8 py-8 space-y-7">

            {/* Title */}
            <div>
              <h1 className="text-2xl font-black text-gray-900 mb-1">Set up your brand</h1>
              <p className="text-sm text-gray-500">This powers your funnel and subscriber-facing pages.</p>
            </div>

            {/* Brand Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Brand name <span className="text-red-400">*</span>
              </label>
              <input
                autoFocus
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Acme, GrowthLab, Nexus…"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base font-medium outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all placeholder:text-gray-300"
              />
            </div>

            {/* Tagline */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Tagline <span className="text-gray-400 font-normal normal-case tracking-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                maxLength={80}
                placeholder={'e.g. "The all-in-one platform for agencies"'}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all placeholder:text-gray-300"
              />
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Logo
              </label>

              {logoUrl ? (
                /* Logo preview */
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl border-2 border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50">
                    <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Logo uploaded</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => fileRef.current?.click()}
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        Replace
                      </button>
                      <span className="text-gray-300">·</span>
                      <button
                        onClick={() => setLogoUrl(null)}
                        className="text-xs text-red-500 hover:text-red-600 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Drop zone */
                <div
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  onClick={() => fileRef.current?.click()}
                  className={`relative flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-2xl py-8 cursor-pointer transition-all ${
                    isDragging
                      ? 'border-indigo-400 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">Drop your logo here</p>
                    <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, SVG · or <span className="text-indigo-600 underline">click to browse</span></p>
                  </div>
                </div>
              )}

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={onFilePick}
                className="hidden"
              />

              {!logoUrl && (
                <p className="text-xs text-gray-400 mt-2">
                  No logo? We'll use your brand initials — looks great too.
                </p>
              )}
            </div>

            {/* Brand Color */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
                Brand color
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {PRESET_COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => setBrandColor(c)}
                    style={{ background: c }}
                    className={`w-8 h-8 rounded-full transition-all ${
                      brandColor === c
                        ? 'ring-2 ring-offset-2 ring-gray-500 scale-110'
                        : 'hover:scale-105 hover:ring-2 hover:ring-offset-1 hover:ring-gray-300'
                    }`}
                  />
                ))}
                {/* custom swatch from color picker value (if not in presets) */}
                {!PRESET_COLORS.includes(brandColor) && (
                  <div
                    style={{ background: brandColor }}
                    className="w-8 h-8 rounded-full ring-2 ring-offset-2 ring-gray-500 scale-110"
                  />
                )}
              </div>

              <div className="flex items-center gap-3 mt-3">
                <input
                  type="color"
                  value={brandColor}
                  onChange={e => setBrandColor(e.target.value)}
                  className="w-9 h-9 rounded-xl border border-gray-200 cursor-pointer p-0.5 bg-white"
                  title="Custom color"
                />
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
                  <span className="text-xs text-gray-400 font-mono">#</span>
                  <input
                    type="text"
                    value={brandColor.replace('#', '')}
                    onChange={e => {
                      const val = e.target.value.replace(/[^0-9a-fA-F]/g, '').slice(0, 6);
                      if (val.length === 6) setBrandColor('#' + val);
                    }}
                    className="text-xs font-mono text-gray-700 bg-transparent outline-none w-16"
                    maxLength={6}
                  />
                </div>
              </div>
            </div>

            {/* Continue button (mobile / secondary) */}
            <button
              onClick={handleContinue}
              disabled={!canContinue}
              className="w-full py-3 bg-indigo-600 text-white rounded-2xl font-semibold text-sm hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              Continue to Plans →
            </button>
            <p className="text-xs text-gray-400 text-center -mt-3">You can always update your brand later from the dashboard.</p>
          </div>
        </div>

        {/* ── Right: Live Preview ── */}
        <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-10 overflow-y-auto custom-scroll">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">Live Preview</p>

          {/* Mock browser card */}
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">

            {/* Browser chrome */}
            <div className="bg-gray-100 border-b border-gray-200 px-4 py-2.5 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-gray-400 font-mono max-w-xs mx-auto">
                app.{displayName.toLowerCase().replace(/\s+/g, '')}.com
              </div>
            </div>

            {/* Nav */}
            <div
              className="flex items-center justify-between px-6 py-4 border-b"
              style={{ borderColor: `${brandColor}20` }}
            >
              <div className="flex items-center gap-3">
                {logoUrl ? (
                  <img src={logoUrl} alt="logo" className="w-8 h-8 rounded-xl object-contain" style={{ border: `2px solid ${brandColor}30` }} />
                ) : (
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: brandColor }}
                  >
                    {initials}
                  </div>
                )}
                <span className="font-bold text-gray-900 text-sm">{displayName}</span>
              </div>
              <div className="flex items-center gap-5">
                {['Features', 'Pricing', 'FAQ'].map(l => (
                  <span key={l} className="text-xs text-gray-400 hidden sm:block">{l}</span>
                ))}
                <button
                  className="text-white text-xs font-bold px-4 py-1.5 rounded-full"
                  style={{ background: brandColor }}
                >
                  Get Started
                </button>
              </div>
            </div>

            {/* Hero */}
            <div
              className="px-10 py-12 text-center"
              style={{ background: `linear-gradient(135deg, ${brandColor}0a 0%, transparent 60%)` }}
            >
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold mb-5"
                style={{ background: `${brandColor}15`, color: brandColor }}
              >
                ✦ Now with AI-powered automation
              </div>

              <h1 className="text-3xl font-black text-gray-900 mb-3 leading-tight">
                The smarter way to{' '}
                <span style={{ color: brandColor }}>grow with {displayName}</span>
              </h1>

              {tagline ? (
                <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">{tagline}</p>
              ) : (
                <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
                  Everything you need to launch, automate, and scale — in one platform built for modern businesses.
                </p>
              )}

              <div className="flex items-center justify-center gap-3">
                <button
                  className="text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-lg"
                  style={{ background: brandColor, boxShadow: `0 6px 20px ${brandColor}50` }}
                >
                  Start free trial →
                </button>
                <button className="text-sm text-gray-600 border border-gray-200 px-5 py-2.5 rounded-xl hover:bg-gray-50">
                  See how it works
                </button>
              </div>

              {/* Stats row */}
              <div className="flex justify-center gap-8 mt-10">
                {[['10,000+', 'Active users'], ['99.9%', 'Uptime'], ['4.9/5', 'Rating']].map(([val, label]) => (
                  <div key={label} className="text-center">
                    <div className="text-xl font-black" style={{ color: brandColor }}>{val}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature chips */}
            <div
              className="px-8 py-5 border-t flex items-center gap-2 flex-wrap"
              style={{ borderColor: `${brandColor}15`, background: `${brandColor}06` }}
            >
              {['Core Platform', 'Automations', 'Analytics', 'API Access', 'Priority Support'].map(f => (
                <span
                  key={f}
                  className="text-xs font-medium px-3 py-1 rounded-full"
                  style={{ background: `${brandColor}15`, color: brandColor }}
                >
                  ✓ {f}
                </span>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-5 text-center">
            Your full website, pricing pages, and subscriber portal will use these brand settings.
          </p>
        </div>
      </div>
    </div>
  );
}
