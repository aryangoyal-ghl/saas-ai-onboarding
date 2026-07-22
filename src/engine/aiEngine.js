import { INDUSTRY_MAP, INDUSTRY_KEYWORDS, REGION_MAP, REGION_KEYWORDS, FEATURES } from '../data/industry.js';

export function detectIndustry(text) {
  const t = text.toLowerCase();
  for (const [key, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
    if (keywords.some(kw => t.includes(kw))) {
      return { ...INDUSTRY_MAP[key], key };
    }
  }
  return null;
}

export function detectRegion(text) {
  const t = text.toLowerCase();
  for (const [key, keywords] of Object.entries(REGION_KEYWORDS)) {
    if (keywords.some(kw => t.includes(kw))) {
      return { ...REGION_MAP[key], key };
    }
  }
  return null;
}

export function detectPlanCount(text) {
  const t = text.toLowerCase();
  const m = t.match(/(\d+)\s*plan/);
  if (m) return Math.min(4, Math.max(1, parseInt(m[1])));
  if (t.includes('only one') || t.includes('1 plan') || t.includes('single')) return 1;
  if (t.includes('two plans') || t.includes('2 plans')) return 2;
  if (t.includes('four') || t.includes('4 tiers')) return 4;
  return null;
}

function getFeatures(tier, industryKey) {
  const all = FEATURES[industryKey] || FEATURES['saas'];
  if (tier === 0) return all.slice(0, 4);
  if (tier === 1) return all.slice(0, 6);
  if (tier === 2) return all.slice(0, 8);
  return [...all];
}

let planIdCounter = 1;
function nextId() { return `plan_${planIdCounter++}`; }

export function buildPlans(industry, region, count = 3) {
  const ind = typeof industry === 'string' ? INDUSTRY_MAP[industry] || INDUSTRY_MAP['saas'] : industry;
  const reg = typeof region === 'string' ? REGION_MAP[region] || REGION_MAP['us'] : region;
  const base = Math.round(ind.base * reg.multiplier);
  const cur = reg.currency;

  const TIERS = [
    {
      name: 'Starter',
      multiplier: 1,
      popular: false,
      description: 'Perfect for getting started. All the essentials to launch your first clients.',
      upgradeDriver: 'Starter users upgrade for more seats and automation depth.',
      onboardingFee: 0,
    },
    {
      name: 'Growth',
      multiplier: 2,
      popular: true,
      description: 'The sweet spot. Advanced features + higher limits for growing businesses.',
      upgradeDriver: 'Most customers choose Growth — it anchors the value of Pro.',
      onboardingFee: base * 2,
    },
    {
      name: 'Pro',
      multiplier: 5,
      popular: false,
      description: 'For power users and teams who need maximum capability and priority support.',
      upgradeDriver: 'Pro makes Growth look affordable. It also attracts high-value clients.',
      onboardingFee: base * 5,
    },
    {
      name: 'Enterprise',
      multiplier: 12,
      popular: false,
      description: 'Custom SLA, dedicated success manager, full white-label, unlimited everything.',
      upgradeDriver: 'Enterprise de-commoditises your product and signals top-tier quality.',
      onboardingFee: base * 12,
    },
  ];

  const selectedTiers = TIERS.slice(0, count);

  return selectedTiers.map((tier, i) => {
    const price = Math.round(base * tier.multiplier);
    return {
      id: nextId(),
      name: tier.name,
      basePrice: price,
      annualPrice: Math.round(price * 10),
      currency: cur,
      popular: tier.popular,
      trialDays: i === 0 ? 14 : 0,
      credits: i === 0 ? 25 : i === 1 ? 50 : i === 2 ? 150 : 500,
      onboardingFee: i === 0 ? 0 : Math.round(tier.onboardingFee),
      features: getFeatures(i, ind.key),
      description: tier.description,
      upgradeDriver: tier.upgradeDriver,
      usageLimits: {
        contacts:    i === 0 ? 500  : i === 1 ? 2500 : i === 2 ? 10000 : -1,
        subAccounts: i === 0 ? 1    : i === 1 ? 5    : i === 2 ? 20    : -1,
        apiCalls:    i === 0 ? 1000 : i === 1 ? 5000 : i === 2 ? 25000 : -1,
      },
    };
  });
}

export function applyModification(plans, instruction) {
  const text = instruction.toLowerCase();
  let changed = false;
  let note = '';

  let updated = plans.map(p => ({ ...p }));

  // Price: increase/decrease by $N
  const increaseMatch = text.match(/increase.*?(\d+)/);
  const decreaseMatch = text.match(/decrease.*?(\d+)/);
  const byMatch = text.match(/by \$?(\d+)/);
  if (increaseMatch || (text.includes('increase') && byMatch)) {
    const amt = parseInt((increaseMatch || byMatch)[1]);
    updated = updated.map(p => ({ ...p, basePrice: p.basePrice + amt, annualPrice: Math.round((p.basePrice + amt) * 10) }));
    note = `Increased all plan prices by $${amt}.`;
    changed = true;
  } else if (decreaseMatch || (text.includes('decrease') && byMatch)) {
    const amt = parseInt((decreaseMatch || byMatch)[1]);
    updated = updated.map(p => ({ ...p, basePrice: Math.max(1, p.basePrice - amt), annualPrice: Math.round(Math.max(1, p.basePrice - amt) * 10) }));
    note = `Decreased all plan prices by $${amt}.`;
    changed = true;
  }

  // "make it cheaper" / "lower prices" / "reduce price"
  if (!changed && (text.includes('cheaper') || text.includes('lower price') || text.includes('reduce price'))) {
    updated = updated.map(p => ({ ...p, basePrice: Math.round(p.basePrice * 0.85), annualPrice: Math.round(p.basePrice * 0.85 * 10) }));
    note = 'Reduced all prices by 15%.';
    changed = true;
  }

  // "more expensive" / "increase value" / "premium pricing"
  if (!changed && (text.includes('more expensive') || text.includes('premium pricing') || text.includes('increase value'))) {
    updated = updated.map(p => ({ ...p, basePrice: Math.round(p.basePrice * 1.2), annualPrice: Math.round(p.basePrice * 1.2 * 10) }));
    note = 'Increased all prices by 20% for a premium positioning.';
    changed = true;
  }

  // Set specific plan price: "set growth to $X" or "growth plan $X"
  const setPriceMatch = text.match(/(starter|growth|pro|enterprise).*?\$?(\d+)/);
  if (!changed && setPriceMatch) {
    const planName = setPriceMatch[1];
    const newPrice = parseInt(setPriceMatch[2]);
    updated = updated.map(p => p.name.toLowerCase() === planName ? { ...p, basePrice: newPrice, annualPrice: newPrice * 10 } : p);
    note = `Set ${planName} plan price to $${newPrice}.`;
    changed = true;
  }

  // Trial changes
  if (text.includes('remove trial') || text.includes('no trial')) {
    updated = updated.map(p => ({ ...p, trialDays: 0 }));
    note = 'Removed trial from all plans.';
    changed = true;
  } else if (text.match(/(\d+).?day trial/)) {
    const days = parseInt(text.match(/(\d+).?day/)[1]);
    updated = updated.map((p, i) => i === 0 ? { ...p, trialDays: days } : p);
    note = `Set ${days}-day free trial on the ${updated[0].name} plan.`;
    changed = true;
  }

  // Add enterprise tier
  if (!changed && text.includes('add enterprise') && !plans.find(p => p.name === 'Enterprise')) {
    const base = plans[0].basePrice;
    updated.push({
      id: nextId(),
      name: 'Enterprise',
      basePrice: base * 12,
      annualPrice: base * 120,
      currency: plans[0].currency,
      popular: false,
      trialDays: 0,
      credits: 500,
      onboardingFee: base * 12,
      features: [...plans[plans.length - 1].features, 'Custom SLA', 'Dedicated Success Manager'],
      description: 'Custom SLA, dedicated success manager, full white-label, unlimited everything.',
      upgradeDriver: 'Enterprise de-commoditises your product and signals top-tier quality.',
      usageLimits: { contacts: -1, subAccounts: -1, apiCalls: -1 },
    });
    note = 'Added Enterprise tier with premium pricing and unlimited usage.';
    changed = true;
  }

  // Mark as popular
  const popularMatch = text.match(/mark (starter|growth|pro|enterprise) as popular/);
  if (!changed && popularMatch) {
    const name = popularMatch[1];
    updated = updated.map(p => ({ ...p, popular: p.name.toLowerCase() === name }));
    note = `Marked ${name} as "Most Popular".`;
    changed = true;
  }

  // Remove onboarding fee
  if (!changed && (text.includes('remove onboarding') || text.includes('no setup fee') || text.includes('remove setup'))) {
    updated = updated.map(p => ({ ...p, onboardingFee: 0 }));
    note = 'Removed onboarding fees from all plans.';
    changed = true;
  }

  // Add free plan
  if (!changed && (text.includes('free plan') || text.includes('free tier') || text.includes('freemium'))) {
    if (!plans.find(p => p.basePrice === 0)) {
      updated.unshift({
        id: nextId(),
        name: 'Free',
        basePrice: 0,
        annualPrice: 0,
        currency: plans[0].currency,
        popular: false,
        trialDays: 0,
        credits: 0,
        onboardingFee: 0,
        features: plans[0].features.slice(0, 3),
        description: 'Get started for free. Upgrade when you\'re ready.',
        upgradeDriver: 'Free users convert to paid at 8-12% — great top-of-funnel.',
        usageLimits: { contacts: 100, subAccounts: 0, apiCalls: 200 },
      });
      note = 'Added a Free tier. Freemium converts 8-12% of users to paid plans.';
      changed = true;
    }
  }

  if (!changed) {
    note = "I understand — let me help with that. Could you be more specific? For example: \"increase price by $20\", \"add 14-day trial\", or \"add enterprise tier\".";
  }

  return { plans: updated, note, changed };
}

export function getPlanReasoning(industry, region, count) {
  const ind = typeof industry === 'string' ? INDUSTRY_MAP[industry] || INDUSTRY_MAP['saas'] : industry;
  const reg = typeof region === 'string' ? REGION_MAP[region] || REGION_MAP['us'] : region;

  return `Here's why this pricing structure works for **${ind.name}** in **${reg.name}**:

• **${count}-tier structure** anchors perceived value — the middle tier (Growth) looks like a bargain between Starter and Pro.
• **2× pricing on Growth** is the "Goldilocks" tier — not too cheap (signals low quality), not too expensive. Most customers choose it.
• **5× pricing on Pro** makes Growth look affordable, while capturing high-value clients willing to pay a premium.
• **Trial on Starter** reduces friction for new signups. Paid trials pre-qualify serious buyers.
• **${reg.currency} pricing** is optimized for ${reg.name} purchasing power and market expectations.`;
}
