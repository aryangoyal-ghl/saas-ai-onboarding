import { useState } from 'react';
import './index.css';

import LandingPage from './views/LandingPage.jsx';
import BrandSetupView from './views/BrandSetupView.jsx';
import PlanBuilderView from './views/PlanBuilderView.jsx';
import PublishFunnelView from './views/PublishFunnelView.jsx';
import DashboardView from './views/DashboardView.jsx';

import { detectIndustry, detectRegion } from './engine/aiEngine.js';
import { initDashData } from './data/mockData.js';

export default function App() {
  // ── View Router ──
  // landing | brand-setup | plan-builder | funnel-builder | dashboard
  const [appView, setAppView] = useState('landing');

  // ── Landing context ──
  const [landingContext, setLandingContext] = useState({
    prompt: '',
    templateKey: null,
    templateName: '',
    templateIndustry: '',
  });

  // ── Brand state ──
  const [brandConfig, setBrandConfig] = useState({
    name: '',
    brandColor: '#6366f1',
    logoUrl: null,
    tagline: '',
  });

  // ── Plan state ──
  const [plans, setPlans] = useState([]);
  const [planOverrides, setPlanOverrides] = useState({});

  // ── Funnel config ──
  const [funnelConfig, setFunnelConfig] = useState(null);

  // ── Dashboard state ──
  const [dashData, setDashData] = useState(null);

  // ── Merged plans helper ──
  function getMergedPlans() {
    return plans.map(plan => {
      const ov = planOverrides[plan.id] || {};
      let features = [...plan.features];
      if (ov.disabledFeatureIdxs?.length) features = features.filter((_, i) => !ov.disabledFeatureIdxs.includes(i));
      if (ov.customFeatures?.length) features = [...features, ...ov.customFeatures];
      const limits = { ...plan.usageLimits, ...(ov.usageLimits || {}) };
      return {
        ...plan,
        basePrice:   ov.price       !== undefined ? ov.price       : plan.basePrice,
        annualPrice: ov.price       !== undefined ? ov.price * 10  : plan.annualPrice,
        trialDays:   ov.trialEnabled === false     ? 0             : (ov.trialDays !== undefined ? ov.trialDays : plan.trialDays),
        credits:     ov.credits     !== undefined ? ov.credits     : plan.credits,
        popular:     ov.popular     !== undefined ? ov.popular     : plan.popular,
        features,
        usageLimits: limits,
      };
    });
  }

  // ── Handlers ──

  // landing → brand-setup
  function handleLandingPrompt(prompt) {
    const industry = detectIndustry(prompt);
    const region   = detectRegion(prompt);
    setLandingContext({ prompt, templateKey: null, templateName: industry?.name || '', templateIndustry: industry?.key || '', preRegion: region?.key || null });
    setPlans([]);
    setPlanOverrides({});
    setAppView('brand-setup');
  }

  function handleSelectTemplate(template) {
    setLandingContext({ prompt: '', templateKey: template.key, templateName: template.name, templateIndustry: template.industryKey, preRegion: null });
    setPlans([]);
    setPlanOverrides({});
    setAppView('brand-setup');
  }

  // brand-setup → plan-builder
  function handleBrandContinue(brand) {
    setBrandConfig(brand);
    setAppView('plan-builder');
  }

  // plan-builder → funnel-builder
  function handleFinalize(mergedPlans) {
    setPlans(mergedPlans);
    setAppView('funnel-builder');
  }

  // funnel-builder → dashboard
  function handleFunnelPublish(config) {
    const resolvedConfig = { ...config, logoUrl: config.logoUrl ?? brandConfig.logoUrl };
    setFunnelConfig(resolvedConfig);
    const merged     = getMergedPlans();
    const plansToUse = merged.length > 0 ? merged : plans;
    const data       = initDashData(plansToUse, null, resolvedConfig.domain);
    setDashData({ ...data, funnelConfig: resolvedConfig });
    setAppView('dashboard');
  }

  // ── View Router ──
  if (appView === 'landing') {
    return (
      <LandingPage
        onSubmitPrompt={handleLandingPrompt}
        onSelectTemplate={handleSelectTemplate}
      />
    );
  }

  if (appView === 'brand-setup') {
    return (
      <BrandSetupView
        initialContext={landingContext}
        onBack={() => setAppView('landing')}
        onContinue={handleBrandContinue}
      />
    );
  }

  if (appView === 'plan-builder') {
    return (
      <PlanBuilderView
        initialContext={landingContext}
        brandConfig={brandConfig}
        plans={plans}
        planOverrides={planOverrides}
        onPlansUpdate={setPlans}
        onOverridesUpdate={setPlanOverrides}
        onFinalize={handleFinalize}
        onBack={() => setAppView('brand-setup')}
      />
    );
  }

  if (appView === 'funnel-builder') {
    return (
      <PublishFunnelView
        plans={getMergedPlans()}
        brandConfig={brandConfig}
        onBack={() => setAppView('plan-builder')}
        onPublish={handleFunnelPublish}
      />
    );
  }

  if (appView === 'dashboard') {
    return (
      <DashboardView
        data={dashData}
        brandConfig={brandConfig}
        onEditPlans={() => setAppView('plan-builder')}
        onEditFunnel={() => setAppView('funnel-builder')}
      />
    );
  }

  return null;
}
