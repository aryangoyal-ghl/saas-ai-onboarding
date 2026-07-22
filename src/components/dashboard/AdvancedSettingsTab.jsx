import { useState } from 'react';
import { PAYMENT_PROVIDERS } from '../../data/providers.js';

function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:opacity-50 ${
        checked ? 'bg-indigo-600' : 'bg-gray-200'
      }`}
    >
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
        checked ? 'translate-x-5' : 'translate-x-1'
      }`} />
    </button>
  );
}

function PaymentSettings({ provider }) {
  const prov = PAYMENT_PROVIDERS.find(p => p.key === provider);
  return (
    <div className="max-w-xl space-y-4">
      <h3 className="text-sm font-semibold text-gray-700">Connected Provider</h3>
      {prov ? (
        <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-200">
          <div className={`${prov.logoColor} w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold`}>
            {prov.logo}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">{prov.name}</p>
            <p className="text-sm text-gray-500">{prov.desc}</p>
            <div className="flex items-center gap-1 mt-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              <span className="text-xs text-green-700 font-medium">Connected & active</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button className="text-xs text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">
              Switch Provider
            </button>
            <button className="text-xs text-red-600 border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-50 transition-colors">
              Disconnect
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-sm text-amber-800">
          No payment provider connected. Go to Publish to connect one.
        </div>
      )}
      <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl text-sm text-blue-800">
        <p className="font-semibold mb-1">Webhook URL</p>
        <code className="text-xs bg-white px-2 py-1 rounded border border-blue-200">https://app.highlevel.com/webhooks/saas/payment</code>
      </div>
    </div>
  );
}

function SecuritySettings() {
  const [settings, setSettings] = useState({
    require2fa: false,
    ipWhitelist: false,
    sessionTimeout: true,
    apiRateLimit: true,
  });
  const rows = [
    { key: 'require2fa', label: '2FA Required', desc: 'Require two-factor auth for all subscribers on login.' },
    { key: 'ipWhitelist', label: 'IP Whitelist', desc: 'Restrict access to specific IP ranges.' },
    { key: 'sessionTimeout', label: 'Session Timeout', desc: 'Auto-logout inactive users after 24 hours.' },
    { key: 'apiRateLimit', label: 'API Rate Limiting', desc: 'Enforce per-plan API call limits automatically.' },
  ];
  return (
    <div className="max-w-xl space-y-3">
      {rows.map(r => (
        <div key={r.key} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-200">
          <div>
            <p className="text-sm font-semibold text-gray-900">{r.label}</p>
            <p className="text-xs text-gray-500 mt-0.5">{r.desc}</p>
          </div>
          <Toggle
            checked={settings[r.key]}
            onChange={v => setSettings(s => ({ ...s, [r.key]: v }))}
          />
        </div>
      ))}
    </div>
  );
}

function CancellationSettings() {
  const [settings, setSettings] = useState({
    survey: true,
    offerPause: true,
    offerDowngrade: true,
    winback: false,
  });
  const [template, setTemplate] = useState('default');

  const rows = [
    { key: 'survey', label: 'Cancellation Survey', desc: 'Ask customers why they\'re leaving before cancelling.' },
    { key: 'offerPause', label: 'Offer Pause', desc: 'Suggest pausing instead of cancelling.' },
    { key: 'offerDowngrade', label: 'Offer Downgrade', desc: 'Suggest a lower plan before they cancel.' },
    { key: 'winback', label: 'Win-Back Email', desc: 'Send an automated win-back offer after cancellation.' },
  ];

  return (
    <div className="max-w-xl space-y-3">
      {rows.map(r => (
        <div key={r.key} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-200">
          <div>
            <p className="text-sm font-semibold text-gray-900">{r.label}</p>
            <p className="text-xs text-gray-500 mt-0.5">{r.desc}</p>
          </div>
          <Toggle
            checked={settings[r.key]}
            onChange={v => setSettings(s => ({ ...s, [r.key]: v }))}
          />
        </div>
      ))}
      <div className="p-4 bg-white rounded-2xl border border-gray-200">
        <label className="block text-sm font-semibold text-gray-900 mb-2">Deflection Message Template</label>
        <select
          value={template}
          onChange={e => setTemplate(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-400 bg-white"
        >
          <option value="default">Default — "We're sorry to see you go..."</option>
          <option value="discount">Discount Offer — "Stay for 50% off next month"</option>
          <option value="pause">Pause Option — "Take a break, no pressure"</option>
          <option value="custom">Custom Message</option>
        </select>
      </div>
    </div>
  );
}

export default function AdvancedSettingsTab({ provider }) {
  const tabs = [
    { key: 'payment',      label: 'Payment Provider' },
    { key: 'security',     label: 'Security' },
    { key: 'cancellation', label: 'Cancellation Flow' },
  ];
  const [activeTab, setActiveTab] = useState('payment');

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">Advanced Settings</h2>
        <p className="text-sm text-gray-500">Configure payment, security, and cancellation flows.</p>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit mb-6">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'payment'      && <PaymentSettings provider={provider} />}
      {activeTab === 'security'     && <SecuritySettings />}
      {activeTab === 'cancellation' && <CancellationSettings />}
    </div>
  );
}
