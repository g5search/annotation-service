export const state = () => ({
  alertMsg: '',
  alertVariant: '',
  dismissSecs: 5,
  dismissCountDown: 0,
  globalAlertMsg: '',
  globalAlertVariant: '',
  globalDismissSecs: 5,
  globalDismissCountDown: 0
})
export const mutations = {
  SET(state, form) {
    const keys = Object.keys(form)
    // eslint-disable-next-line no-return-assign
    keys.forEach(key => state[key] = form[key])
  }
}
