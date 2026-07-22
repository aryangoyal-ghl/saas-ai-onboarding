import { useState, useEffect, useRef } from 'react';
import ChatBubble from '../components/chat/ChatBubble.jsx';
import TypingIndicator from '../components/chat/TypingIndicator.jsx';
import ChatInput from '../components/chat/ChatInput.jsx';
import PlanCard from '../components/plans/PlanCard.jsx';
import PlanEditPanel from '../components/plans/PlanEditPanel.jsx';
import { detectIndustry, detectRegion, detectPlanCount, buildPlans, applyModification, getPlanReasoning } from '../engine/aiEngine.js';
import { INDUSTRY_MAP, REGION_MAP } from '../data/industry.js';

const sleep = ms => new Promise(r => setTimeout(r, ms));

function PricingRationale({ plans }) {
  if (!plans.length) return null;
  const starter = plans[0];
  const growth = plans.find(p => p.popular);
  return (
    <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-800 leading-relaxed">
      <p className="font-semibold mb-1">💡 Pricing Psychology</p>
      {growth && (
        <p>• {growth.name} ({starter?.currency}{growth.basePrice}/mo) is the anchor — most customers choose it.</p>
      )}
      <p>• {plans.length}-tier structure drives upsells naturally — each tier justifies the next.</p>
      {starter?.trialDays > 0 && (
        <p>• {starter.trialDays}-day trial on {starter.name} reduces friction for first-time buyers.</p>
      )}
    </div>
  );
}

export default function PlanBuilderView({
  initialContext,
  plans,
  planOverrides,
  onPlansUpdate,
  onOverridesUpdate,
  onFinalize,
  onBack,
}) {
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ctx, setCtx] = useState({
    industry: null,
    region: null,
    planCount: 3,
    trialDays: null,
    usageBilling: null,
    conversationPhase: 'setup', // 'setup' | 'trial' | 'usage' | 'markup' | 'done'
  });
  const [editingPlanId, setEditingPlanId] = useState(null);
  const chatScrollRef = useRef(null);
  const initialized = useRef(false);

  function pushMsg(msg) {
    setChat(prev => [...prev, { id: Date.now() + Math.random(), ...msg }]);
  }

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chat, loading]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    initConversation();
  }, []);

  async function initConversation() {
    const { prompt, templateKey, templateName, templateIndustry } = initialContext || {};

    if (templateKey && templateIndustry) {
      const industry = detectIndustry(templateIndustry) || Object.values(INDUSTRY_MAP).find(i => i.key === templateIndustry) || INDUSTRY_MAP['saas'];
      setCtx(c => ({ ...c, industry }));

      pushMsg({ role: 'assistant', text: `Great choice! 🚀 Let's build your **${templateName}** SaaS.\n\nI'll create AI-optimized pricing plans tailored to your business model. First — where are your primary customers located?` });
      await sleep(600);
      pushMsg({ role: 'assistant', text: 'Select your target market:', ui: 'region' });
    } else if (prompt) {
      pushMsg({ role: 'user', text: prompt });
      setLoading(true);
      await sleep(1200);
      setLoading(false);

      const industry = detectIndustry(prompt);
      const region = detectRegion(prompt);
      const count = detectPlanCount(prompt) || 3;

      if (industry && region) {
        setCtx(c => ({ ...c, industry, region, planCount: count }));
        pushMsg({ role: 'assistant', text: `Understood! I can see you're building a **${industry.name}** business targeting **${region.name}**. Let me generate your optimized pricing plans...` });
        await sleep(400);
        await generatePlans(industry, region, count);
      } else if (industry) {
        setCtx(c => ({ ...c, industry, planCount: count }));
        pushMsg({ role: 'assistant', text: `Building a **${industry.name}** SaaS — great space! Where are your primary customers located?` });
        await sleep(400);
        pushMsg({ role: 'assistant', text: 'Select your target market:', ui: 'region' });
      } else {
        pushMsg({ role: 'assistant', text: "I'd love to help you build this! What type of business is this? For example: online courses, digital agency, real estate, fitness, coaching..." });
        await sleep(400);
        pushMsg({ role: 'assistant', text: 'Or pick an industry:', ui: 'industry' });
      }
    } else {
      pushMsg({ role: 'assistant', text: "Welcome to the SaaS Plan Builder! 🎉\n\nTell me about your business idea, or pick an industry to get started." });
      await sleep(600);
      pushMsg({ role: 'assistant', text: 'What type of SaaS are you building?', ui: 'industry' });
    }
  }

  async function generatePlans(industry, region, count = 3) {
    setLoading(true);
    await sleep(1400);
    setLoading(false);

    const generated = buildPlans(industry, region, count);
    onPlansUpdate(generated);

    const reasoning = getPlanReasoning(industry, region, count);
    pushMsg({
      role: 'assistant',
      text: `Here are your ${count} AI-optimized pricing plans for **${industry.name}** in **${region.name}**:`,
      ui: 'reasoning',
      reasoning,
    });

    // Continue conversation: trial question
    await sleep(800);
    setCtx(c => ({ ...c, conversationPhase: 'trial' }));
    pushMsg({ role: 'assistant', text: 'Would you like to offer a free trial? A trial lowers the barrier for new signups and can significantly boost conversions.' });
    await sleep(400);
    pushMsg({ role: 'assistant', text: 'Choose a trial length:', ui: 'trial-options' });
  }

  async function handleTrialSelect(key, label) {
    pushMsg({ role: 'user', text: label });
    const days = parseInt(key, 10);

    // Apply trial to plans
    let updatedPlans;
    if (days > 0) {
      const result = applyModification(plans.length > 0 ? plans : [], `${days}-day trial`);
      updatedPlans = result.plans;
      if (result.changed) onPlansUpdate(updatedPlans);
    }

    setCtx(c => ({ ...c, trialDays: days, conversationPhase: 'usage' }));

    setLoading(true);
    await sleep(700);
    setLoading(false);

    const ack = days > 0
      ? `${days}-day trial added to your Starter plan. ✅`
      : 'No trial — subscribers pay from day one. Bold move!';

    pushMsg({ role: 'assistant', text: ack });
    await sleep(400);
    pushMsg({ role: 'assistant', text: 'How should usage (SMS, calls, AI features) be billed?' });
    await sleep(300);
    pushMsg({ role: 'assistant', text: 'Choose a billing model:', ui: 'usage-options' });
  }

  async function handleUsageSelect(key, label) {
    pushMsg({ role: 'user', text: label });
    setCtx(c => ({ ...c, usageBilling: { model: key, markup: null } }));

    setLoading(true);
    await sleep(700);
    setLoading(false);

    if (key === 'included') {
      // Add unlimited usage feature to all plans
      const updated = plans.map(p => ({
        ...p,
        features: p.features.some(f => f.toLowerCase().includes('unlimited'))
          ? p.features
          : [...p.features, 'Unlimited usage (SMS, Calls & AI)'],
      }));
      onPlansUpdate(updated);
      setCtx(c => ({ ...c, conversationPhase: 'done' }));
      pushMsg({ role: 'assistant', text: 'All plans now include unlimited usage. Your subscribers will love the simplicity! ✅' });
      await sleep(400);
      pushMsg({ role: 'assistant', text: 'Your plans are ready! You can still refine them by typing commands like:\n• "increase price by $20"\n• "add enterprise tier"\n• "mark growth as popular"\n\nOr use the **Edit** button on any plan card. When you\'re happy, click **Save & Continue →** above.' });
    } else if (key === 'bundle') {
      // Add tiered credit features
      const updated = plans.map((p, i) => {
        const sms = [200, 500, 1500, 5000][Math.min(i, 3)];
        const calls = [50, 150, 500, 2000][Math.min(i, 3)];
        return {
          ...p,
          features: [...p.features, `${sms} SMS + ${calls} min calls/mo included`],
        };
      });
      onPlansUpdate(updated);
      setCtx(c => ({ ...c, conversationPhase: 'markup' }));
      pushMsg({ role: 'assistant', text: 'Bundle credits added — each tier gets more capacity. ✅\n\nWhat markup do you want to apply on usage beyond the bundle?' });
      await sleep(400);
      pushMsg({ role: 'assistant', text: 'Select your markup:', ui: 'markup-options' });
    } else {
      // pay-per-use → ask markup
      setCtx(c => ({ ...c, conversationPhase: 'markup' }));
      pushMsg({ role: 'assistant', text: 'Pay-per-use — subscribers only pay for what they consume. What markup should we apply on top of our base costs?' });
      await sleep(400);
      pushMsg({ role: 'assistant', text: 'Select your markup:', ui: 'markup-options' });
    }
  }

  async function handleMarkupSelect(key, label) {
    pushMsg({ role: 'user', text: label });
    const markup = parseFloat(key);
    const model = ctx.usageBilling?.model || 'pay-per-use';

    setCtx(c => ({ ...c, usageBilling: { ...c.usageBilling, markup }, conversationPhase: 'done' }));

    // Add markup feature string to all plans
    const featureStr = model === 'bundle'
      ? `Overage at ${markup}× cost`
      : `Usage billed at ${markup}× cost`;

    const updated = plans.map(p => ({
      ...p,
      features: [...p.features, featureStr],
    }));
    onPlansUpdate(updated);

    setLoading(true);
    await sleep(600);
    setLoading(false);

    pushMsg({ role: 'assistant', text: `${label} markup set — you'll earn a healthy margin on every usage event. ✅` });
    await sleep(400);
    pushMsg({ role: 'assistant', text: 'Your plans are ready! You can still refine them by typing commands like:\n• "increase price by $20"\n• "add enterprise tier"\n• "mark growth as popular"\n\nOr use the **Edit** button on any plan card. When you\'re happy, click **Save & Continue →** above.' });
  }

  async function handleIndustrySelect(key, label) {
    pushMsg({ role: 'user', text: label });
    const industry = detectIndustry(key) || INDUSTRY_MAP[key];
    if (!industry) return;
    setCtx(c => ({ ...c, industry }));

    setLoading(true);
    await sleep(600);
    setLoading(false);

    pushMsg({ role: 'assistant', text: `${industry.name} — excellent choice! Now, where are your target customers located?` });
    await sleep(400);
    pushMsg({ role: 'assistant', text: 'Select your target market:', ui: 'region' });
  }

  async function handleRegionSelect(key, label) {
    pushMsg({ role: 'user', text: label });
    const region = REGION_MAP[key];
    if (!region) return;

    const newCtx = { ...ctx, region, planCount: ctx.planCount || 3 };
    setCtx(newCtx);

    if (!newCtx.industry) {
      setLoading(true);
      await sleep(600);
      setLoading(false);
      pushMsg({ role: 'assistant', text: 'What type of SaaS are you building?', ui: 'industry' });
      return;
    }

    await generatePlans(newCtx.industry, region, newCtx.planCount);
  }

  async function handleChat(text) {
    pushMsg({ role: 'user', text });
    setLoading(true);
    await sleep(900);
    setLoading(false);

    const lower = text.toLowerCase();

    if (lower.includes('go back') || lower.includes('step 1') || lower.includes('start over')) {
      pushMsg({ role: 'assistant', text: 'Going back to the start. See you shortly!' });
      await sleep(600);
      onBack();
      return;
    }

    if (!plans.length) {
      const industry = detectIndustry(text);
      const region = detectRegion(text);
      const count = detectPlanCount(text);

      if (industry) setCtx(c => ({ ...c, industry }));
      if (region) setCtx(c => ({ ...c, region }));
      if (count) setCtx(c => ({ ...c, planCount: count }));

      const updated = { ...ctx };
      if (industry) updated.industry = industry;
      if (region) updated.region = region;
      if (count) updated.planCount = count;

      if (updated.industry && updated.region) {
        await generatePlans(updated.industry, updated.region, updated.planCount || 3);
      } else if (updated.industry && !updated.region) {
        pushMsg({ role: 'assistant', text: `Got it — ${updated.industry.name}! Now, which region are your customers in?` });
        await sleep(300);
        pushMsg({ role: 'assistant', text: 'Select your market:', ui: 'region' });
      } else {
        pushMsg({ role: 'assistant', text: "What type of SaaS are you building?", ui: 'industry' });
      }
      return;
    }

    const { plans: updated, note, changed } = applyModification(plans, text);
    if (changed) {
      onPlansUpdate(updated);
      pushMsg({ role: 'assistant', text: note });
    } else {
      pushMsg({ role: 'assistant', text: note });
    }
  }

  const mergedPlans = plans.map(plan => {
    const ov = planOverrides[plan.id] || {};
    let features = [...plan.features];
    if (ov.disabledFeatureIdxs?.length) features = features.filter((_, i) => !ov.disabledFeatureIdxs.includes(i));
    if (ov.customFeatures?.length) features = [...features, ...ov.customFeatures];
    const limits = { ...plan.usageLimits, ...(ov.usageLimits || {}) };
    return {
      ...plan,
      basePrice:   ov.price     !== undefined ? ov.price     : plan.basePrice,
      trialDays:   ov.trialEnabled === false   ? 0           : (ov.trialDays !== undefined ? ov.trialDays : plan.trialDays),
      credits:     ov.credits   !== undefined ? ov.credits   : plan.credits,
      popular:     ov.popular   !== undefined ? ov.popular   : plan.popular,
      features,
      usageLimits: limits,
    };
  });

  const gridCols = mergedPlans.length === 1 ? 'grid-cols-1 max-w-sm' :
                   mergedPlans.length === 2 ? 'grid-cols-2 max-w-2xl' :
                   mergedPlans.length === 3 ? 'grid-cols-3 max-w-4xl' : 'grid-cols-4 max-w-5xl';

  const businessLabel = ctx.industry && ctx.region
    ? `${ctx.industry.name} · ${ctx.region.name}`
    : ctx.industry ? ctx.industry.name
    : initialContext?.templateName || 'Your SaaS';

  return (
    <div className="flex flex-col h-screen bg-gray-50 view-enter">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4 z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 text-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>

        {/* 3-step indicator */}
        <div className="flex items-center gap-1.5 flex-1">
          {[1, 2, 3].map(n => (
            <div key={n} className="flex items-center gap-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                n === 1 ? 'bg-green-500 text-white' :
                n === 2 ? 'bg-indigo-600 text-white' :
                'bg-gray-200 text-gray-400'
              }`}>
                {n === 1 ? (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : n}
              </div>
              {n < 3 && <div className={`w-8 h-px ${n === 1 ? 'bg-green-300' : 'bg-gray-200'}`} />}
            </div>
          ))}
          <span className="ml-1 text-xs text-gray-500 hidden sm:block">Plans</span>
        </div>

        {ctx.industry && (
          <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1">
            <div className="w-2 h-2 bg-indigo-500 rounded-full" />
            <span className="text-xs text-indigo-700 font-medium">{businessLabel}</span>
          </div>
        )}

        {mergedPlans.length > 0 && (
          <button
            onClick={() => onFinalize(mergedPlans)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Save & Continue
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat Column */}
        <div className="w-[30%] flex-shrink-0 flex flex-col bg-white border-r border-gray-200">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 text-sm">AI Plan Builder</h2>
            <p className="text-xs text-gray-400">Chat to create and refine your plans</p>
          </div>

          <div
            ref={chatScrollRef}
            className="flex-1 overflow-y-auto custom-scroll px-4 py-4"
          >
            {chat.map(msg => (
              <ChatBubble
                key={msg.id}
                msg={msg}
                onIndustrySelect={handleIndustrySelect}
                onRegionSelect={handleRegionSelect}
                onTrialSelect={handleTrialSelect}
                onUsageSelect={handleUsageSelect}
                onMarkupSelect={handleMarkupSelect}
              />
            ))}
            {loading && <TypingIndicator />}
          </div>

          <ChatInput onSend={handleChat} disabled={loading} />
        </div>

        {/* Plan Preview Column */}
        <div className="flex-1 overflow-y-auto custom-scroll">
          {mergedPlans.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Your plans will appear here</h3>
              <p className="text-sm text-gray-400 max-w-xs">Chat with the AI to describe your business — it will generate optimized pricing plans in seconds.</p>
            </div>
          ) : (
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Your Pricing Plans</h2>
                  <p className="text-sm text-gray-500">{mergedPlans.length} tiers · AI-optimized for conversion</p>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-full font-medium">
                  ✓ Plans ready
                </span>
              </div>

              <div className={`grid ${gridCols} gap-4 mx-auto`}>
                {mergedPlans.map(plan => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    onEdit={id => setEditingPlanId(id)}
                  />
                ))}
              </div>

              <PricingRationale plans={mergedPlans} />
            </div>
          )}
        </div>

        {/* Edit Panel */}
        {editingPlanId && mergedPlans.length > 0 && (
          <PlanEditPanel
            plans={mergedPlans}
            overrides={planOverrides}
            onChange={(planId, ovData) => {
              onOverridesUpdate(prev => ({ ...prev, [planId]: ovData }));
            }}
            onClose={() => setEditingPlanId(null)}
            activePlanId={editingPlanId}
          />
        )}
      </div>
    </div>
  );
}
