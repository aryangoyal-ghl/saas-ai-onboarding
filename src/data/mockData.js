export function initDashData(plans, provider, domain) {
  // Map plan names to actual prices from generated plans
  const planPriceMap = {};
  plans.forEach(p => { planPriceMap[p.name] = p.basePrice; });

  const rawSubscribers = [
    { id: 1, name: 'Jake Martinez',   email: 'jake@growthco.io',    planName: plans[1]?.name || 'Growth',   status: 'active',  joined: 'Mar 12, 2025' },
    { id: 2, name: 'Sarah Kim',       email: 'sarah@courselab.com', planName: plans[0]?.name || 'Starter',  status: 'trial',   joined: 'Apr 1, 2025'  },
    { id: 3, name: 'Priya Nair',      email: 'priya@agencyX.com',   planName: plans[2]?.name || 'Pro',      status: 'active',  joined: 'Jan 5, 2025'  },
    { id: 4, name: 'Carlos Ruiz',     email: 'carlos@crm360.io',    planName: plans[0]?.name || 'Starter',  status: 'active',  joined: 'Feb 28, 2025' },
    { id: 5, name: 'Emily Chen',      email: 'emily@studiofit.com', planName: plans[1]?.name || 'Growth',   status: 'active',  joined: 'Mar 30, 2025' },
    { id: 6, name: 'Michael Torres',  email: 'mike@realtyhub.net',  planName: plans[1]?.name || 'Growth',   status: 'churned', joined: 'Dec 10, 2024' },
    { id: 7, name: 'Lisa Park',       email: 'lisa@mindsetco.com',  planName: plans[2]?.name || 'Pro',      status: 'active',  joined: 'Mar 2, 2025'  },
  ];

  const subscribers = rawSubscribers.map(s => ({
    ...s,
    mrr: s.status === 'churned' ? 0 : (planPriceMap[s.planName] || 97),
  }));

  const totalMRR = subscribers.filter(s => s.status !== 'churned').reduce((sum, s) => sum + s.mrr, 0);
  const activeCount = subscribers.filter(s => s.status === 'active').length;
  const trialCount = subscribers.filter(s => s.status === 'trial').length;
  const churnedCount = subscribers.filter(s => s.status === 'churned').length;
  const churnRate = ((churnedCount / subscribers.length) * 100).toFixed(1);
  const arpu = Math.round(totalMRR / ((activeCount + trialCount) || 1));

  return {
    mrr: totalMRR,
    activeSubscribers: activeCount,
    trialSubscribers: trialCount,
    churnRate,
    arpu,
    subscribers,
    provider,
    domain,
    plans,
    funnelStats: { views: 1247, conversions: 89, conversionRate: 7.1, avgTime: '2m 14s' },
    activity: [
      { time: '2h ago',  text: `Jake M. upgraded ${plans[0]?.name || 'Starter'} → ${plans[1]?.name || 'Growth'}` },
      { time: '5h ago',  text: 'New signup: Emily Chen — ' + (plans[1]?.name || 'Growth') + ' plan' },
      { time: '1d ago',  text: 'Churn alert: Michael Torres cancelled' },
      { time: '2d ago',  text: `Priya N. renewed — ${plans[2]?.name || 'Pro'} plan ($${planPriceMap[plans[2]?.name] || 485}/mo)` },
      { time: '3d ago',  text: 'Sarah K. started 14-day trial' },
    ],
  };
}
