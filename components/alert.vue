<template>
  <b-alert
    :id="specs.id"
    :show="alertProps[specs.dismissCountDown]"
    :variant="alertProps[specs.alertVariant]"
    dismissible
    :class="specs.width"
    :style="alertProps[specs.alertVariant] === 'success'
      ? 'border: 2px solid #69ca8a;'
      : 'border: 2px solid #red;'"
    @dismissed="set({[specs.alertMsg]: '',[specs.alertVariant]: '', [specs.dismissCountDown]: 0})"
    @dismiss-count-down="countDownChanged($event, specs.dismissCountDown)"
  >
    <b-icon-check-circle scale="1.25" />
    {{ alertProps[specs.alertMsg] }}
  </b-alert>
</template>

<script>
import Alert from '~/mixins/alert-mixin'
export default {
  mixins: [Alert],
  props: {
    specs: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>

<style>

</style>
