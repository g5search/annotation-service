import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {}
  },
  computed: {
    ...mapState({
      alertProps: state => state.alert
    })
  },
  methods: {
    ...mapMutations({
      set: 'alert/SET'
    }),
    countDownChanged(sec, prop) {
      this.set({ [prop]: sec })
    },
    showAlert(msg, variant) {
      this.set({
        dismissCountDown: this.alertProps.dismissSecs,
        alertMsg: msg,
        alertVariant: variant
      })
    },
    showGlobalAlert(msg, variant) {
      this.set({
        globalDismissCountDown: this.alertProps.globalDismissSecs,
        globalAlertMsg: msg,
        globalAlertVariant: variant
      })
    }
  }
}
