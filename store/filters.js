export const state = () => ({
  categories: [
    { text: 'Select Option', value: 'None' },
    { text: 'Account Changes', value: 'Account Changes' },
    { text: 'Account Audit', value: 'Account Audit' },
    { text: 'Customer Contact', value: 'Customer Contact' },
    { text: 'General Note', value: 'General Note' },
    { text: 'Optimizations', value: 'Optimizations' },
    { text: 'Other', value: 'Other' },
    { text: 'Technical Issue', value: 'Technical Issue' }
  ],
  actionTypes: {
    None: [
      { text: 'Select a Category First', value: 'None' }
    ],
    'Account Audit': [
      { text: 'Select Option', value: 'None' },
      'Site Health Check',
      'SEO Audit',
      'Performance Analysis',
      'Client Recommendation'
    ],
    'Account Changes': [
      { text: 'Select Option', value: 'None' },
      'Smart Bidding Strategy Change',
      'Specials/Promotions',
      'Spend Optimizer Version Change',
      'URL Change',
      'Service Upgrade',
      'Service Downgrade',
      'Business Information'
    ],
    'General Note': [{ text: 'None', value: 'None' }],
    'Customer Contact': [
      { text: 'Select Option', value: 'None' },
      'Action Items',
      'Analysis/Notes',
      'User Access'
    ],
    Optimizations: [
      { text: 'Select Option', value: 'None' },
      'Added Negative Keywords',
      'Added Keywords',
      'Changed Location Strategy',
      'Updated Geographic Targeting',
      'Paused Campaign',
      'Enabled Campaign',
      'Refreshed Ad Copy',
      'Testing',
      'T&O Added',
      'Manual Spend Adjustments',
      'Manual Bid Adjustments',
      'Keyword Strategy Update',
      'Website - Content',
      'Website - Technical',
      'GMB'
    ],
    Other: [
      { text: 'Select Option', value: 'None' },
      'Uncontrollable Circumstances'
    ],
    'Technical Issue': [
      { text: 'Select Option', value: 'None' },
      'DA WoW',
      'Dynamic Pricing',
      'Dynamic Availability',
      'Reporting Issue',
      'Website',
      'GMB',
      'Business Listings',
      'Reporting Issue'
    ]
  }
})
