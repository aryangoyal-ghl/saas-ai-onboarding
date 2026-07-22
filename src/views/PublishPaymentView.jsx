import { useState } from 'react';
import { PAYMENT_PROVIDERS } from '../data/providers.js';

const sleep = ms => new Promise(r => setTimeout(r, ms));

export default function PublishPaymentView({ onBack, onConnected }) {
  const [selected, setSelected] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [connectingKey, setConnectingKey] = useState(null);

  async function handleConnect(provider) {
    setSelected(provider.key);
    setConnectingKey(provider.key);
    setConnecting(true);
    await sleep(1800);
    setConnecting(false);
    setConnected(true);
  }

  return (
    <div className="min-h-screen bg-white flex flex-col view-enter">
      {/* Top Bar */}
      <div className="border-b border-gray-200 px-6 py-3 flex items-center gap-4">
        <button
          onClick={onBack}
          disabled={connecting || connected}
          className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 text-sm transition-colors disabled:opacity-40"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>

        <div className="flex items-center gap-1.5 flex-1 mx-4">
          {[1,2,3].map(n => (
            <div key={n} className="flex items-center gap-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                n === 1 ? 'bg-green-500 text-white' : n === 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {n === 1 ? (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : n}
              </div>
              {n < 3 && <div className={`w-16 h-px ${n < 2 ? 'bg-indigo-300' : 'bg-gray-200'}`} />}
            </div>
          ))}
          <span className="ml-3 text-xs font-medium text-gray-600">Step 1 of 2: Connect Payment</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {!connected ? (
          <>
            <div className="text-center mb-10">
              <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h1 className="text-2xl font-black text-gray-900 mb-2">Connect your payment provider</h1>
              <p className="text-gray-500 text-sm max-w-md">
                Choose how you'd like to accept subscription payments. You can change this later from Advanced Settings.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-3xl">
              {PAYMENT_PROVIDERS.map(provider => (
                <div
                  key={provider.key}
                  className={`relative rounded-2xl border-2 p-5 transition-all ${
                    selected === provider.key
                      ? 'border-indigo-500 shadow-lg shadow-indigo-100'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`${provider.logoColor} w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}>
                      {provider.logo}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{provider.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{provider.desc}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleConnect(provider)}
                    disabled={connecting}
                    className={`w-full py-2 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                      connectingKey === provider.key && connecting
                        ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                        : 'bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50'
                    }`}
                  >
                    {connectingKey === provider.key && connecting ? (
                      <>
                        <span className="spinner w-3.5 h-3.5" />
                        Connecting...
                      </>
                    ) : 'Connect'}
                  </button>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-400 mt-6 text-center max-w-md">
              🔒 Your credentials are encrypted and never stored on our servers. You can disconnect at any time.
            </p>
          </>
        ) : (
          /* Connected success state */
          <div className="text-center modal-in max-w-md">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Payment Connected!</h2>
            <p className="text-gray-500 text-sm mb-2">
              <strong>{PAYMENT_PROVIDERS.find(p => p.key === selected)?.name}</strong> is now connected and ready to accept subscriptions.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-8">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Subscription payments are enabled for all your plans.
            </div>
            <button
              onClick={() => onConnected(selected)}
              className="w-full py-3.5 bg-indigo-600 text-white rounded-2xl font-semibold text-base hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              Continue to Funnel Builder
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
