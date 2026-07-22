import { useState } from 'react';

const TESTIMONIALS = [
  { name: 'Sarah K.', role: 'Founder', company: 'GrowthLab', text: 'We switched from three separate tools to this platform and our team productivity went up 40%. The all-in-one approach just works.', avatar: 'SK' },
  { name: 'Marcus T.', role: 'CEO', company: 'NexaTech', text: "Best decision we made this year. Setup took under an hour and we had our first paying subscriber the same day. Incredible.", avatar: 'MT' },
  { name: 'Priya M.', role: 'Operations Lead', company: 'ScaleUp Co.', text: 'The automation features alone saved us 12 hours a week. I wish we had found this sooner. The support team is also fantastic.', avatar: 'PM' },
];

const FAQ_ITEMS = [
  { q: 'Can I cancel anytime?', a: 'Yes, absolutely. Cancel anytime with no questions asked. Your data remains accessible for 30 days after cancellation.' },
  { q: 'Is there a free trial?', a: 'Most of our plans include a free trial period. No credit card required to start.' },
  { q: 'Do you offer annual billing?', a: 'Yes! Switch to annual billing and save up to 17% compared to monthly. You can switch anytime from your dashboard.' },
  { q: 'What kind of support do you offer?', a: 'All plans include email support. Growth and above plans include priority support with faster response times and live chat.' },
  { q: 'Can I upgrade or downgrade my plan?', a: 'Of course. You can upgrade or downgrade at any time. Changes take effect immediately and billing is prorated.' },
];

export default function FunnelPreview({ plans = [], brandColor = '#6366f1', theme = 'light', countdown = false, businessName = 'Your Platform', logoUrl = null, compact = false }) {
  const [billingAnnual, setBillingAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const isDark = theme === 'dark' || theme === 'premium';
  const isPremium = theme === 'premium';

  const bg        = isDark ? (isPremium ? '#0f0a1a' : '#0f172a') : '#ffffff';
  const heroGrad  = isDark ? (isPremium ? 'linear-gradient(135deg,#1a0f2e,#0f0a1a)' : 'linear-gradient(135deg,#0f172a,#1e293b)') : 'linear-gradient(135deg,#f8faff,#ffffff)';
  const textColor = isDark ? '#f9fafb' : '#111827';
  const subText   = isDark ? '#94a3b8' : '#6b7280';
  const mutedText = isDark ? '#64748b' : '#9ca3af';
  const cardBg    = isDark ? (isPremium ? '#1a0f2e' : '#1e293b') : '#f8fafc';
  const cardBorder= isPremium ? '#b45309' : isDark ? '#334155' : '#e2e8f0';
  const surfaceBg = isDark ? (isPremium ? '#130b22' : '#172033') : '#f1f5f9';
  const accent    = isPremium ? '#f59e0b' : brandColor;
  const accentLight = isPremium ? '#fef3c7' : `${brandColor}18`;
  const divider   = isDark ? '#1e293b' : '#f1f5f9';

  const displayPlans = plans.length > 0 ? plans.slice(0, 3) : [
    { name: 'Starter',  basePrice: 47,  annualPrice: 470,  currency: '$', popular: false, trialDays: 14, features: ['Core Features', 'Email Support', 'Basic Analytics', 'Up to 500 contacts', 'API Access'] },
    { name: 'Growth',   basePrice: 97,  annualPrice: 970,  currency: '$', popular: true,  trialDays: 0,  features: ['Everything in Starter', 'Priority Support', 'Advanced Analytics', 'Up to 2,500 contacts', 'Automations', 'Custom Branding'] },
    { name: 'Pro',      basePrice: 247, annualPrice: 2470, currency: '$', popular: false, trialDays: 0,  features: ['Everything in Growth', 'Dedicated Manager', 'Unlimited contacts', 'Custom Integrations', 'SLA Guarantee', 'White-Label'] },
  ];

  // Aggregate features for the features section
  const allFeatures = [];
  const seen = new Set();
  displayPlans.forEach(p => (p.features || []).forEach(f => {
    if (!f.toLowerCase().startsWith('everything') && !seen.has(f)) { seen.add(f); allFeatures.push(f); }
  }));
  const featureCards = allFeatures.slice(0, 6);

  const FEATURE_ICONS = ['⚡', '📊', '🔒', '🤖', '📱', '🎯'];

  const fontScale = compact ? 0.82 : 1;
  const s = (px) => `${Math.round(px * fontScale)}px`;

  return (
    <div className="w-full h-full overflow-y-auto custom-scroll" style={{ background: bg, color: textColor, fontFamily: '"Inter", system-ui, sans-serif', fontSize: s(14) }}>

      {/* ── NAV ── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: `1px solid ${cardBorder}`, padding: `${s(10)} ${s(20)}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: isDark ? `${bg}ee` : `${bg}f0`, backdropFilter: 'blur(8px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: s(8) }}>
          {logoUrl ? (
            <img src={logoUrl} alt={businessName} style={{ width: s(30), height: s(30), borderRadius: s(8), objectFit: 'contain', border: `1px solid ${cardBorder}` }} />
          ) : (
            <div style={{ width: s(30), height: s(30), borderRadius: s(8), background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: s(13) }}>
              {businessName[0]?.toUpperCase()}
            </div>
          )}
          <span style={{ fontWeight: 800, fontSize: s(14), color: textColor }}>{businessName}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: s(12) }}>
          {!compact && ['Features', 'Pricing', 'FAQ'].map(l => (
            <span key={l} style={{ fontSize: s(12), color: subText, cursor: 'pointer' }}>{l}</span>
          ))}
          <button style={{ background: accent, color: '#fff', padding: `${s(6)} ${s(14)}`, borderRadius: s(20), border: 'none', fontSize: s(12), fontWeight: 700, cursor: 'pointer' }}>
            Get Started
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{ background: heroGrad, padding: compact ? `${s(36)} ${s(20)} ${s(28)}` : `${s(72)} ${s(24)} ${s(56)}`, textAlign: 'center' }}>
        {countdown && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: s(6), background: isPremium ? '#7c2d12' : '#fee2e2', color: isPremium ? '#fcd34d' : '#b91c1c', borderRadius: s(20), padding: `${s(5)} ${s(14)}`, fontSize: s(11), fontWeight: 700, marginBottom: s(16) }}>
            ⏰ Special launch pricing ends in 23:47:12
          </div>
        )}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: s(6), background: accentLight, border: `1px solid ${accent}40`, borderRadius: s(20), padding: `${s(5)} ${s(14)}`, fontSize: s(11), fontWeight: 600, color: accent, marginBottom: s(18) }}>
          ✦ Now with AI-powered automation
        </div>
        <h1 style={{ fontSize: compact ? s(28) : s(52), fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em', margin: `0 auto ${s(18)}`, maxWidth: s(700), color: textColor }}>
          The smarter way to<br />
          <span style={{ color: accent }}>grow with {businessName}</span>
        </h1>
        <p style={{ fontSize: s(16), color: subText, maxWidth: s(480), margin: `0 auto ${s(28)}`, lineHeight: 1.6 }}>
          Everything you need to launch, automate, and scale — in one platform built for modern businesses.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: s(12), flexWrap: 'wrap' }}>
          <button style={{ background: accent, color: '#fff', padding: `${s(14)} ${s(28)}`, borderRadius: s(12), border: 'none', fontSize: s(15), fontWeight: 700, cursor: 'pointer', boxShadow: `0 4px 24px ${accent}50` }}>
            Start free trial →
          </button>
          <button style={{ background: 'transparent', color: textColor, padding: `${s(14)} ${s(24)}`, borderRadius: s(12), border: `1.5px solid ${cardBorder}`, fontSize: s(15), fontWeight: 600, cursor: 'pointer' }}>
            See how it works
          </button>
        </div>

        {/* Hero Stats */}
        {!compact && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: s(40), marginTop: s(48), flexWrap: 'wrap' }}>
            {[['10,000+', 'Active users'], ['99.9%', 'Uptime SLA'], ['4.9/5', 'Customer rating'], ['< 2min', 'Avg setup time']].map(([val, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: s(24), fontWeight: 800, color: accent, marginBottom: s(4) }}>{val}</div>
                <div style={{ fontSize: s(12), color: mutedText }}>{label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── SOCIAL PROOF ── */}
      <div style={{ borderTop: `1px solid ${divider}`, borderBottom: `1px solid ${divider}`, padding: `${s(18)} ${s(24)}`, background: surfaceBg }}>
        <p style={{ textAlign: 'center', fontSize: s(11), fontWeight: 600, color: mutedText, letterSpacing: '0.08em', marginBottom: s(14), textTransform: 'uppercase' }}>
          Trusted by 10,000+ businesses worldwide
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: s(28), flexWrap: 'wrap' }}>
          {['Acme Corp', 'Stackify', 'NexaGroup', 'Buildrite', 'CloudBase'].map(name => (
            <span key={name} style={{ fontSize: s(13), fontWeight: 700, color: mutedText, opacity: 0.7 }}>{name}</span>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      {featureCards.length > 0 && (
        <div style={{ padding: compact ? `${s(28)} ${s(20)}` : `${s(64)} ${s(24)}` }}>
          <div style={{ textAlign: 'center', marginBottom: s(36) }}>
            <h2 style={{ fontSize: compact ? s(22) : s(36), fontWeight: 800, letterSpacing: '-0.02em', marginBottom: s(10), color: textColor }}>
              Everything you need
            </h2>
            <p style={{ fontSize: s(15), color: subText, maxWidth: s(440), margin: '0 auto' }}>
              Stop juggling multiple tools. {businessName} brings it all together.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(featureCards.length, compact ? 2 : 3)}, 1fr)`, gap: s(16), maxWidth: s(860), margin: '0 auto' }}>
            {featureCards.map((feature, i) => (
              <div key={i} style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: s(16), padding: `${s(20)} ${s(18)}` }}>
                <div style={{ width: s(36), height: s(36), borderRadius: s(10), background: accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: s(18), marginBottom: s(12) }}>
                  {FEATURE_ICONS[i % FEATURE_ICONS.length]}
                </div>
                <h3 style={{ fontSize: s(14), fontWeight: 700, color: textColor, marginBottom: s(6) }}>{feature}</h3>
                <p style={{ fontSize: s(12), color: subText, lineHeight: 1.5 }}>
                  Seamlessly integrated and ready to use from day one.
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── PRICING ── */}
      <div style={{ background: surfaceBg, padding: compact ? `${s(28)} ${s(20)}` : `${s(64)} ${s(24)}` }}>
        <div style={{ textAlign: 'center', marginBottom: s(32) }}>
          <h2 style={{ fontSize: compact ? s(22) : s(36), fontWeight: 800, letterSpacing: '-0.02em', marginBottom: s(10), color: textColor }}>
            Simple, transparent pricing
          </h2>
          <p style={{ fontSize: s(14), color: subText, marginBottom: s(18) }}>
            No hidden fees. Upgrade or cancel anytime.
          </p>
          {/* Billing Toggle */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: s(6), background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: s(24), padding: `${s(4)} ${s(6)}` }}>
            <button
              onClick={() => setBillingAnnual(false)}
              style={{ padding: `${s(5)} ${s(14)}`, borderRadius: s(18), background: !billingAnnual ? accent : 'transparent', color: !billingAnnual ? '#fff' : subText, border: 'none', fontSize: s(12), fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingAnnual(true)}
              style={{ padding: `${s(5)} ${s(14)}`, borderRadius: s(18), background: billingAnnual ? accent : 'transparent', color: billingAnnual ? '#fff' : subText, border: 'none', fontSize: s(12), fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: s(4), transition: 'all 0.15s' }}
            >
              Annual
              <span style={{ background: '#10b981', color: '#fff', borderRadius: s(8), padding: `${s(1)} ${s(5)}`, fontSize: s(9), fontWeight: 700 }}>SAVE 17%</span>
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(displayPlans.length, compact ? 2 : 3)}, 1fr)`, gap: s(16), maxWidth: s(820), margin: '0 auto' }}>
          {displayPlans.map((p, i) => {
            const price = billingAnnual ? Math.round((p.annualPrice || p.basePrice * 10) / 12) : p.basePrice;
            return (
              <div
                key={i}
                style={{
                  background: p.popular ? accent : cardBg,
                  border: `2px solid ${p.popular ? accent : cardBorder}`,
                  borderRadius: s(20),
                  padding: `${s(24)} ${s(18)}`,
                  position: 'relative',
                  transform: p.popular ? 'scale(1.04)' : 'none',
                  boxShadow: p.popular ? `0 12px 40px ${accent}40` : 'none',
                }}
              >
                {p.popular && (
                  <div style={{ position: 'absolute', top: s(-10), left: '50%', transform: 'translateX(-50%)', background: '#fff', color: accent, fontSize: s(9), fontWeight: 800, padding: `${s(3)} ${s(10)}`, borderRadius: s(10), whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                    MOST POPULAR
                  </div>
                )}
                <div style={{ fontSize: s(13), fontWeight: 700, marginBottom: s(6), color: p.popular ? '#fff' : textColor }}>{p.name}</div>
                <div style={{ marginBottom: s(4) }}>
                  <span style={{ fontSize: s(30), fontWeight: 900, color: p.popular ? '#fff' : accent }}>{p.currency}{price}</span>
                  <span style={{ fontSize: s(12), color: p.popular ? 'rgba(255,255,255,0.7)' : mutedText }}>/mo</span>
                </div>
                {billingAnnual && <div style={{ fontSize: s(10), color: p.popular ? 'rgba(255,255,255,0.6)' : '#10b981', fontWeight: 600, marginBottom: s(8) }}>Billed ${p.annualPrice || p.basePrice * 10}/year</div>}
                {p.trialDays > 0 && <div style={{ fontSize: s(10), color: p.popular ? 'rgba(255,255,255,0.8)' : '#10b981', fontWeight: 600, marginBottom: s(8) }}>✓ {p.trialDays}-day free trial</div>}
                <ul style={{ listStyle: 'none', padding: 0, margin: `${s(14)} 0 ${s(16)}`, fontSize: s(11) }}>
                  {(p.features || []).slice(0, 5).map((f, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: s(6), marginBottom: s(6), color: p.popular ? 'rgba(255,255,255,0.9)' : subText }}>
                      <span style={{ color: p.popular ? '#fff' : '#10b981', fontSize: s(10), marginTop: s(1), flexShrink: 0 }}>✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button style={{
                  width: '100%', padding: `${s(10)} 0`, borderRadius: s(12), border: 'none', cursor: 'pointer',
                  background: p.popular ? '#fff' : accent,
                  color: p.popular ? accent : '#fff',
                  fontSize: s(13), fontWeight: 700,
                }}>
                  Get started →
                </button>
              </div>
            );
          })}
        </div>

        {/* Money-back */}
        <p style={{ textAlign: 'center', marginTop: s(24), fontSize: s(12), color: mutedText }}>
          🔒 30-day money-back guarantee · No credit card required to start · Cancel anytime
        </p>
      </div>

      {/* ── TESTIMONIALS ── */}
      {!compact && (
        <div style={{ padding: `${s(64)} ${s(24)}` }}>
          <div style={{ textAlign: 'center', marginBottom: s(40) }}>
            <h2 style={{ fontSize: s(34), fontWeight: 800, letterSpacing: '-0.02em', marginBottom: s(10), color: textColor }}>
              Loved by thousands
            </h2>
            <p style={{ fontSize: s(15), color: subText }}>Don't just take our word for it.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: s(20), maxWidth: s(900), margin: '0 auto' }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: s(20), padding: s(24) }}>
                <div style={{ fontSize: s(16), color: '#f59e0b', marginBottom: s(12) }}>★★★★★</div>
                <p style={{ fontSize: s(13), color: subText, lineHeight: 1.6, marginBottom: s(16) }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: s(10) }}>
                  <div style={{ width: s(36), height: s(36), borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: s(12), fontWeight: 700 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontSize: s(13), fontWeight: 700, color: textColor }}>{t.name}</div>
                    <div style={{ fontSize: s(11), color: mutedText }}>{t.role}, {t.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── FAQ ── */}
      {!compact && (
        <div style={{ background: surfaceBg, padding: `${s(64)} ${s(24)}` }}>
          <div style={{ textAlign: 'center', marginBottom: s(40) }}>
            <h2 style={{ fontSize: s(34), fontWeight: 800, letterSpacing: '-0.02em', marginBottom: s(10), color: textColor }}>
              Frequently asked questions
            </h2>
            <p style={{ fontSize: s(15), color: subText }}>Everything you need to know to get started.</p>
          </div>
          <div style={{ maxWidth: s(640), margin: '0 auto' }}>
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} style={{ borderBottom: `1px solid ${cardBorder}`, overflow: 'hidden' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `${s(18)} 0`, background: 'transparent', border: 'none', cursor: 'pointer', color: textColor, fontSize: s(14), fontWeight: 600, textAlign: 'left', gap: s(12) }}
                >
                  <span>{item.q}</span>
                  <span style={{ color: accent, fontSize: s(18), lineHeight: 1, flexShrink: 0, transform: openFaq === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>+</span>
                </button>
                {openFaq === i && (
                  <div style={{ paddingBottom: s(16), fontSize: s(13), color: subText, lineHeight: 1.6 }}>
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── BOTTOM CTA ── */}
      <div style={{ padding: compact ? `${s(32)} ${s(24)}` : `${s(72)} ${s(24)}`, textAlign: 'center', background: isDark ? `linear-gradient(135deg, ${accent}20, transparent)` : `linear-gradient(135deg, ${accent}0d, #f8faff)` }}>
        <h2 style={{ fontSize: compact ? s(22) : s(36), fontWeight: 800, letterSpacing: '-0.02em', marginBottom: s(12), color: textColor }}>
          Ready to get started?
        </h2>
        <p style={{ fontSize: s(15), color: subText, maxWidth: s(400), margin: `0 auto ${s(24)}` }}>
          Join thousands of businesses already growing with {businessName}. No credit card required.
        </p>
        <button style={{ background: accent, color: '#fff', padding: `${s(14)} ${s(32)}`, borderRadius: s(14), border: 'none', fontSize: s(15), fontWeight: 700, cursor: 'pointer', boxShadow: `0 8px 32px ${accent}50` }}>
          Start your free trial →
        </button>
        <div style={{ display: 'flex', justifyContent: 'center', gap: s(20), marginTop: s(20), flexWrap: 'wrap' }}>
          {['🔒 Secure Payment', '✓ Cancel Anytime', '⭐ 4.9/5 Stars', '🚀 Setup in Minutes'].map(t => (
            <span key={t} style={{ fontSize: s(11), color: mutedText }}>{t}</span>
          ))}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{ borderTop: `1px solid ${cardBorder}`, padding: `${s(28)} ${s(24)}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: s(12) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: s(8) }}>
          <div style={{ width: s(24), height: s(24), borderRadius: s(6), background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: s(11), fontWeight: 800 }}>
            {businessName[0]?.toUpperCase()}
          </div>
          <span style={{ fontSize: s(13), fontWeight: 700, color: textColor }}>{businessName}</span>
        </div>
        <div style={{ display: 'flex', gap: s(20) }}>
          {['Privacy', 'Terms', 'Support'].map(l => (
            <span key={l} style={{ fontSize: s(11), color: mutedText, cursor: 'pointer' }}>{l}</span>
          ))}
        </div>
        <span style={{ fontSize: s(11), color: mutedText }}>© 2025 {businessName}. All rights reserved.</span>
      </div>
    </div>
  );
}
