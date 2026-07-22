export const INDUSTRY_MAP = {
  course:      { name: 'Course Creator',      base: 47,  key: 'course' },
  agency:      { name: 'Digital Agency',      base: 97,  key: 'agency' },
  'real estate':{ name: 'Real Estate',        base: 79,  key: 'real estate' },
  saas:        { name: 'SaaS',                base: 67,  key: 'saas' },
  coaching:    { name: 'Coaching',            base: 97,  key: 'coaching' },
  ecommerce:   { name: 'E-Commerce',          base: 57,  key: 'ecommerce' },
  fitness:     { name: 'Fitness / Gym',       base: 37,  key: 'fitness' },
  restaurant:  { name: 'Restaurant',          base: 29,  key: 'restaurant' },
  healthcare:  { name: 'Healthcare / Booking',base: 89,  key: 'healthcare' },
  reputation:  { name: 'Reputation Mgmt',     base: 77,  key: 'reputation' },
};

export const INDUSTRY_KEYWORDS = {
  course:      ['course', 'learn', 'lms', 'education', 'teach', 'training', 'kajabi', 'skool', 'udemy'],
  agency:      ['agency', 'marketing', 'freelance', 'client', 'white label', 'resell', 'lovable'],
  'real estate':['real estate', 'realtor', 'property', 'housing', 'homes', 'mortgage', 'crm'],
  saas:        ['saas', 'software', 'tool', 'platform', 'builder', 'vibe', 'app', 'productivity'],
  coaching:    ['coach', 'mentor', 'consulting', 'therapy', 'life coach', 'program'],
  ecommerce:   ['ecommerce', 'shop', 'store', 'product', 'retail', 'shopify'],
  fitness:     ['fitness', 'gym', 'workout', 'studio', 'health club', 'crossfit'],
  restaurant:  ['restaurant', 'food', 'cafe', 'dining', 'menu'],
  healthcare:  ['healthcare', 'clinic', 'doctor', 'medical', 'appointment', 'booking', 'salon', 'spa', 'beauty'],
  reputation:  ['reputation', 'review', 'rating', 'feedback', 'monitor'],
};

export const REGION_MAP = {
  us:        { name: 'United States', currency: '$',  multiplier: 1.0,  flag: '🇺🇸' },
  uk:        { name: 'United Kingdom',currency: '£',  multiplier: 0.9,  flag: '🇬🇧' },
  india:     { name: 'India',         currency: '₹',  multiplier: 0.3,  flag: '🇮🇳' },
  canada:    { name: 'Canada',        currency: 'C$', multiplier: 1.1,  flag: '🇨🇦' },
  australia: { name: 'Australia',     currency: 'A$', multiplier: 1.15, flag: '🇦🇺' },
  europe:    { name: 'Europe',        currency: '€',  multiplier: 0.95, flag: '🇪🇺' },
};

export const REGION_KEYWORDS = {
  us:        ['us', 'usa', 'united states', 'america', 'american'],
  uk:        ['uk', 'britain', 'england', 'british', 'london'],
  india:     ['india', 'indian', 'rupee', 'inr'],
  canada:    ['canada', 'canadian'],
  australia: ['australia', 'australian', 'sydney', 'melbourne'],
  europe:    ['europe', 'european', 'eu', 'euro', 'germany', 'france', 'spain'],
};

export const FEATURES = {
  course:     ['Course Builder', 'Video Hosting', 'Student CRM', 'Quiz & Assessments', 'Drip Content', 'Affiliate Module', 'Live Events', 'Community Access', 'Analytics Dashboard', 'Email Sequences'],
  agency:     ['Sub-Account Management', 'White-Label Dashboard', 'Client Reporting', 'Automation Builder', 'CRM & Pipeline', 'Website Builder', 'Reputation Management', 'API Access', 'SaaS Mode', 'Snapshot Library'],
  'real estate':['Lead Pipeline', 'Contact CRM', 'Task Manager', 'SMS Drip Campaigns', 'Listing Pages', 'Calendar & Booking', 'Analytics', 'Document Templates', 'Team Collaboration', 'Mobile App'],
  saas:       ['Core Platform Access', 'API & Webhooks', 'Custom Domain', 'Team Seats', 'Usage Analytics', 'Zapier Integration', 'Priority Support', 'White-Label Option', 'SSO / Auth', 'SLA Guarantee'],
  coaching:   ['Client Portal', 'Session Booking', 'Invoicing', 'Goal Tracker', 'Private Community', 'Video Calls', 'Program Templates', 'Email Sequences', 'Content Library', 'Mobile App'],
  ecommerce:  ['Product Catalog', 'Shopping Cart', 'Checkout Funnels', 'Abandoned Cart Recovery', 'Discount & Coupons', 'Email Marketing', 'Upsell / Downsell', 'Analytics', 'Inventory Alerts', 'Affiliate Tracking'],
  fitness:    ['Member Management', 'Class Scheduling', 'Billing & Payments', 'Check-In App', 'Progress Tracking', 'Nutrition Planner', 'Automated Reminders', 'Staff Management', 'Reporting', 'Mobile App'],
  restaurant: ['Online Ordering', 'Table Reservations', 'Menu Management', 'QR Code Menus', 'Loyalty Program', 'Delivery Integration', 'Analytics', 'Staff Scheduling', 'SMS Marketing', 'Customer CRM'],
  healthcare: ['Online Booking', 'Calendar Management', 'Client Reminders', 'Intake Forms', 'Billing & Invoicing', 'HIPAA-Ready Storage', 'Staff Scheduling', 'Analytics', 'CRM', 'Reputation Management'],
  reputation: ['Review Monitoring', 'Auto-Request Campaigns', 'AI Response Drafts', 'Multi-Platform Sync', 'Sentiment Analysis', 'Competitor Tracking', 'Reporting Dashboard', 'SMS & Email Alerts', 'API Access', 'White-Label Reports'],
};

export const INDUSTRY_CHIPS = [
  { label: '🎓 Course Creator', key: 'course' },
  { label: '🏢 Digital Agency',  key: 'agency' },
  { label: '🏠 Real Estate',     key: 'real estate' },
  { label: '💻 SaaS / Software', key: 'saas' },
  { label: '🎯 Coaching',        key: 'coaching' },
  { label: '🛒 E-Commerce',      key: 'ecommerce' },
  { label: '💪 Fitness / Gym',   key: 'fitness' },
  { label: '⭐ Reputation Mgmt', key: 'reputation' },
];

export const REGION_CHIPS = [
  { label: '🇺🇸 United States', key: 'us' },
  { label: '🇬🇧 United Kingdom', key: 'uk' },
  { label: '🇮🇳 India',         key: 'india' },
  { label: '🇨🇦 Canada',        key: 'canada' },
  { label: '🇦🇺 Australia',     key: 'australia' },
  { label: '🇪🇺 Europe',        key: 'europe' },
];
