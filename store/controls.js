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
    { text: 'Select Option', value: null },
    { text: 'Account Changes', value: 'Account Changes' },
    { text: 'Customer Contact', value: 'Customer Contact' },
    { text: 'General Note', value: 'General Note' },
    { text: 'Optimizations', value: 'Optimizations' },
    { text: 'Other', value: 'Other' },
    { text: 'Technical Issue', value: 'Technical Issue' }
  ],
  actionType: null,
  actionTypes: {
    null: [
      { text: 'Select a Category First', value: null }
    ],
    'Account Changes': [
      { text: 'Select Option', value: 'None' },
      'Smart Bidding Strategy Change',
      'Specials/Promotions',
      'Spend Optimizer Version Change',
      'URL Change',
      'Whitelisting Events Change'
    ],
    'General Note': [
      { text: 'Select Option', value: 'None' },
      'None'
    ],
    'Customer Contact': [
      { text: 'Select Option', value: 'None' },
      'Action Items',
      'Analysis/Notes'
    ],
    // eslint-disable-next-line
    'Optimizations': [
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
      'Manual Bid Adjustments'
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
      'Reporting Issue'
    ],
    'Implementation Dates': [
      { text: 'Select Option', value: 'None' },
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
  async onRemove({ commit }, payload) {
    await commit('ON_REMOVE', payload)
  },
  async onReset({ commit }) {
    await commit('ON_RESET')
  },
  async fillClients({ commit }) {
    await this.$axios
      .$get('api/hub/clients')
      .then(clients => commit('FILL_CLIENTS', clients))
  },
  async fillUsers({ commit }) {
    await this.$axios
      .$get('api/v1/strategists')
      .then(user => [...user.map(u => ({
        text: `${u.first_name} ${u.last_name}`,
        value: u.email
      })), { text: 'Select a User', value: null }])
      .then(users => commit('FILL_USERS', users))
  }
}

export const getters = {
  showDates(state) {
    const matches = [
      'Specials/Promotions',
      'Testing',
      'Uncontrollable Circumstance',
      'DA WoW',
      'Other',
      'Dynamic Pricing',
      'Dynamic Availability'
    ]
    return matches.includes(state.actionType)
  }
}

export const mutations = {
  ON_UPDATE(state, payload) {
    state[payload.key] = payload.value
  },
  ON_REMOVE(state, payload) {
    const newState = state[payload.key].filter(k => k.urn !== payload.value.urn)
    state[payload.key] = newState
  },
  ON_RESET(state) {
    state.client = null
    state.location = []
    state.locations = []
    state.category = null
    state.actionType = null
    state.user = null
    state.isInternal = null
    state.startDate = null
    state.endDate = null
    state.isCreatedAt = true
    state.fromDate = null
    state.toDate = ''
  },
  FILL_CLIENTS(state, payload) {
    state.clients = payload
  },
  FILL_USERS(state, payload) {
    state.users = payload
  }
}
