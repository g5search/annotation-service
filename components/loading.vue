<template>
  <div v-if="loading" class="l">
    <octopus :size="`6em`" :color="`#0c233f`" />
    <div class="l__inset text-white h1">
      <b-icon-arrow-clockwise animation="spin" />
    </div>
  </div>
</template>

<script>
import Octopus from '~/components/icons/octopus'
export default {
  components: {
    Octopus
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    start() {
      this.loading = true
    },
    finish() {
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.l {
  position: fixed;
  z-index: 9999;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  &__inset {
    position: absolute;
    text-align: center;
    font-size: 3em;
    left: 50%;
    top: 25%;
    transform: translate(-46%, -25%);
  }
}
</style>
