export const state = () => ({
  client: null,
  clients: [],
  location: [],
  locations: [],
  vertical: null,
  verticals: [
    { text: 'Select Option', value: null },
    'Multi Family',
    'Self Storage',
    'Senior Living'
  ],
  user: null,
  users: [],
  category: null,
  categories: [
    { text: 'Select option', value: null },
    { text: 'Account Changes', value: 'Account Changes' },
    { text: 'Customer Contact', value: 'Customer Contact' },
    { text: 'General Note', value: 'General Note' },
    { text: 'Optimizations', value: 'Optimizations' },
    { text: 'Other', value: 'Other' },
    { text: 'Technical Issue', value: 'Technical Issue' }
  ],
  actionType: null,
  actionTypes: {
    'Account Changes': [
      'Smart Bidding Strategy Change',
      'Specials/Promotions',
      'Spend Optimizer Version Change',
      'URL Change',
      'Whitelisting Events Change'
    ],
    'General Note': [
      'NA'
    ],
    'Customer Contact': [
      'Action Items',
      'Analysis/Notes'
    ],
    Optimizations: [
      'Added Negative Keywords',
      'Added Keywords',
      'Changed Location Strategy',
      'Paused Campaign',
      'Enabled Campaign',
      'Refreshed Ad Copy',
      'Testing',
      'T & O Added',
      'Manual Spend Adjustments',
      'Manual Bid Adjustments'
    ],
    Other: [
      'Uncontrollable Circumstances'
    ],
    'Technical Issue': [
      'DA WoW',
      'Dynamic Pricing',
      'Dynamic Availability',
      'Reporting Issue'
    ],
    'Implementation Dates': [
      'Dynamic Pricing Start',
      'Dynamic Pricing End',
      'Dynamic Availability Start',
      'Dynamic Availability End',
      'Spend Optimizer Start',
      'Spend Optimizer End',
      'Call Scoring Start',
      'Call Scoring End',
      'First Impressions',
      'First Spend'
    ]
  },
  isInternal: null,
  isInternals: [
    { text: 'Both', value: null },
    { text: 'Internal Only', value: true },
    { text: 'Customer-Facing', value: false }
  ],
  startDate: null,
  endDate: null,
  isCreatedAt: true,
  fromDate: null,
  toDate: null,
  salesforceSync: {}
})

export const actions = {
  async onUpdate({ commit }, payload) {
    await commit('ON_UPDATE', payload)
  },
  async fillClients({ commit }) {
    await this.$axios
      .$get('api/hub/clients')
      .then(clients => commit('FILL_CLIENTS', clients))
  },
  async fillUsers({ commit }) {
    await this.$axios
      .$get('api/v1/strategists')
      .then(user => user.map(u => ({
        text: `${u.first_name} ${u.last_name}`,
        value: u.email
      })))
      .then(users => commit('FILL_USERS', users))
  }
}

export const mutations = {
  ON_UPDATE(state, payload) {
    state[payload.key] = payload.value
  },
  FILL_CLIENTS(state, payload) {
    state.clients = payload
  },
  FILL_USERS(state, payload) {
    state.users = payload
  }
}
