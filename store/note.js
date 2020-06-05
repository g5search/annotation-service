export const state = () => {
  return {
    clients: [],
    selectedClient: null,
    locations: [],
    selectedLocations: [],
    cateogry: null,
    actionType: null,
    annotation: {
      html: '',
      json: null
    }
  }
}
export const actions = {
  updateField({ commit }, data) {
    commit(data.key, data.value)
  }
}
export const mutations = {}
export const getters = {}
