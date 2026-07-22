import { useState } from 'react';
import OverviewTab from '../components/dashboard/OverviewTab.jsx';
import PlansTab from '../components/dashboard/PlansTab.jsx';
import FunnelTab from '../components/dashboard/FunnelTab.jsx';
import SubscribersTab from '../components/dashboard/SubscribersTab.jsx';
import AdvancedSettingsTab from '../components/dashboard/AdvancedSettingsTab.jsx';
import { PAYMENT_PROVIDERS } from '../data/providers.js';
import { DOMAINS } from '../data/templates.js';

const SIDEBAR_NAV = [
  { label: 'Agency Dashboard',    icon: 'grid' },
  { label: 'SaaS Configurator',   icon: 'saas', active: true },
  { label: 'Sub-Accounts',        icon: 'users' },
  { label: 'Reselling',           icon: 'tag' },
  { label: 'Template Library',    icon: 'layers' },
  { label: 'Add-Ons',             icon: 'plus-circle' },
  { label: 'Settings',            icon: 'settings' },
];

function NavIcon({ type }) {
  const cls = 'w-4 h-4';
  const icons = {
    grid:        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
    saas:        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    users:       <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    tag:         <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>,
    layers:      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
    'plus-circle':<svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    settings:    <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  };
  return icons[type] || icons.grid;
}

const DASH_TABS = [
  { key: 'overview',    label: 'Overview' },
  { key: 'plans',       label: 'Plans & Pricing' },
  { key: 'funnel',      label: 'Sales Funnel' },
  { key: 'subscribers', label: 'Subscribers' },
  { key: 'advanced',    label: 'Advanced Settings' },
];

const sleep = ms => new Promise(r => setTimeout(r, ms));

function OnboardingOverlay({ funnelConfig, onComplete, onSkip }) {
  const [step, setStep] = useState(0); // 0=payment, 1=domain, 2=done
  const [connectingKey, setConnectingKey] = useState(null);
  const [connectedProvider, setConnectedProvider] = useState(null);
  const [domain, setDomain] = useState(funnelConfig?.domain || DOMAINS[0]);
  const [customDomain, setCustomDomain] = useState('');
  const [useCustom, setUseCustom] = useState(false);

  async function handleConnect(provider) {
    setConnectingKey(provider.key);
    await sleep(1600);
    setConnectingKey(null);
    setConnectedProvider(provider);
    await sleep(400);
    setStep(1);
  }

  function handleDomainConfirm() {
    const finalDomain = useCustom && customDomain.trim() ? customDomain.trim() : domain;
    setStep(2);
    setTimeout(() => onComplete({ provider: connectedProvider, domain: finalDomain }), 2000);
  }

  if (step === 2) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center overlay-in" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}>
        <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-2xl modal-in">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Onboarding complete! 🎉</h2>
          <p className="text-gray-500 text-sm">Your SaaS platform is fully set up and ready to accept subscribers.</p>
          <div className="spinner w-5 h-5 mx-auto mt-6 border-indigo-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overlay-in" style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}>
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl modal-in overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-6">
          <div className="flex items-center gap-3 mb-4">
            {[0, 1].map(i => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  i < step ? 'bg-white text-indigo-600' : i === step ? 'bg-white text-indigo-600' : 'bg-white/30 text-white'
                }`}>
                  {i < step ? (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : i + 1}
                </div>
                {i < 1 && <div className={`w-16 h-px ${i < step ? 'bg-white' : 'bg-white/30'}`} />}
              </div>
            ))}
          </div>
          <h2 className="text-xl font-black text-white mb-1">
            {step === 0 ? 'Connect your payment provider' : 'Confirm your domain'}
          </h2>
          <p className="text-indigo-200 text-sm">
            {step === 0 ? 'Accept subscription payments from your subscribers.' : 'Where your funnel and subscriber portal will live.'}
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          {step === 0 && (
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PAYMENT_PROVIDERS.map(provider => (
                  <div key={provider.key} className="rounded-2xl border-2 border-gray-200 hover:border-gray-300 p-4 transition-all">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`${provider.logoColor} w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}>
                        {provider.logo}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 leading-tight">{provider.name}</p>
                        <p className="text-xs text-gray-400 leading-tight">{provider.desc}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleConnect(provider)}
                      disabled={!!connectingKey}
                      className="w-full py-2 rounded-xl text-xs font-semibold bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5"
                    >
                      {connectingKey === provider.key ? (
                        <><span className="spinner w-3 h-3" />Connecting…</>
                      ) : 'Connect'}
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={onSkip} className="w-full text-center text-xs text-gray-400 hover:text-gray-600 transition-colors mt-4">
                Skip for now →
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl p-4 mb-2">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-green-800">{connectedProvider?.name} connected</p>
                  <p className="text-xs text-green-600">Subscription payments are enabled.</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Choose your subdomain</label>
                <div className="space-y-2">
                  {DOMAINS.map(d => (
                    <label key={d} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-indigo-300 transition-colors">
                      <input type="radio" name="domain" value={d} checked={!useCustom && domain === d} onChange={() => { setDomain(d); setUseCustom(false); }} className="text-indigo-600" />
                      <span className="text-sm font-mono text-gray-700">{d}</span>
                    </label>
                  ))}
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-indigo-300 transition-colors">
                    <input type="radio" name="domain" checked={useCustom} onChange={() => setUseCustom(true)} className="text-indigo-600" />
                    <span className="text-sm text-gray-500">Custom domain…</span>
                  </label>
                  {useCustom && (
                    <input
                      autoFocus
                      type="text"
                      value={customDomain}
                      onChange={e => setCustomDomain(e.target.value)}
                      placeholder="e.g. app.mybusiness.com"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 font-mono"
                    />
                  )}
                </div>
              </div>

              <button
                onClick={handleDomainConfirm}
                className="w-full py-3 bg-indigo-600 text-white rounded-2xl font-semibold text-sm hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                Complete Setup
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <p className="text-xs text-gray-400 text-center">You can change these settings anytime in Advanced Settings.</p>
              <button onClick={onSkip} className="w-full text-center text-xs text-gray-400 hover:text-gray-600 transition-colors mt-1">
                Skip for now →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardView({ data, onEditPlans, onEditFunnel }) {
  const [dashTab, setDashTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [connectedData, setConnectedData] = useState(null);

  function handleOnboardingComplete({ provider, domain, skipped }) {
    setConnectedData({ provider, domain, skipped: !!skipped });
    setOnboardingDone(true);
  }

  function handleSkip() {
    setConnectedData({ provider: null, domain: null, skipped: true });
    setOnboardingDone(true);
  }

  function handleOpenSetup() {
    setOnboardingDone(false);
  }

  const effectiveData = {
    ...data,
    provider: connectedData?.provider?.key || data?.provider,
  };

  return (
    <div className="flex h-screen bg-gray-50 view-enter overflow-hidden">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="w-56 bg-gray-900 flex flex-col flex-shrink-0">
          <div className="px-4 py-4 border-b border-gray-700/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-white text-xs font-bold">HighLevel</p>
                <p className="text-gray-400 text-xs">SaaS Mode</p>
              </div>
            </div>
          </div>

          <div className="px-3 py-2 border-b border-gray-700/50">
            <button className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-gray-800 transition-colors">
              <span className="text-gray-300 text-xs">Click here to switch</span>
              <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 px-2 py-3 space-y-0.5">
            {SIDEBAR_NAV.map(item => (
              <button
                key={item.label}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  item.active
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                }`}
              >
                <NavIcon type={item.icon} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="px-3 py-3 border-t border-gray-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">AG</div>
                <span className="text-gray-300 text-xs">Aryan G.</span>
              </div>
              <div className="w-2 h-2 bg-green-400 rounded-full" />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <h1 className="text-base font-bold text-gray-900">SaaS Dashboard</h1>

          {/* Onboarding checklist badge */}
          {(onboardingDone && connectedData?.skipped) && (
            <button
              onClick={handleOpenSetup}
              className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-full px-3 py-1 text-xs font-semibold hover:bg-amber-100 transition-colors"
            >
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
              2 setup steps remaining
            </button>
          )}
          {!onboardingDone && (
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-full px-3 py-1 text-xs font-semibold">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
              2 setup steps remaining
            </div>
          )}

          <div className="ml-auto flex items-center gap-2">
            <button className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">&lt;/&gt;</button>
            <button className="flex items-center gap-1.5 bg-indigo-500 rounded-full px-3 py-1.5 text-white text-xs font-bold">✦ Ask AI</button>
            <button className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">📢</button>
            <button className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs">🔔</button>
            <button className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">?</button>
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">AG</div>
          </div>
        </div>

        {/* Tab Nav */}
        <div className="bg-white border-b border-gray-200 px-6">
          <div className="flex">
            {DASH_TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setDashTab(tab.key)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  dashTab === tab.key
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto custom-scroll bg-gray-50">
          {dashTab === 'overview'    && <OverviewTab data={effectiveData} onNavigate={setDashTab} connectedData={connectedData} onOpenSetup={handleOpenSetup} />}
          {dashTab === 'plans'       && <PlansTab plans={effectiveData?.plans} onEditPlans={onEditPlans} />}
          {dashTab === 'funnel'      && <FunnelTab data={effectiveData} plans={effectiveData?.plans} onEdit={onEditFunnel} />}
          {dashTab === 'subscribers' && <SubscribersTab subscribers={effectiveData?.subscribers} />}
          {dashTab === 'advanced'    && <AdvancedSettingsTab provider={effectiveData?.provider} />}
        </div>
      </div>

      {/* Onboarding overlay */}
      {!onboardingDone && (
        <OnboardingOverlay
          funnelConfig={data?.funnelConfig}
          onComplete={handleOnboardingComplete}
          onSkip={handleSkip}
        />
      )}
    </div>
  );
}
