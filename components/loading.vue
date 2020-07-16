<template>
  <div
    v-if="loading"
    class="l d-flex align-items-center bg-primary text-white h1 px-5 py-3"
  >
    <b-icon-arrow-clockwise animation="spin" />
    Loading...
  </div>
</template>

<script>
export default {
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
  font-size: 7em;
}
</style>
