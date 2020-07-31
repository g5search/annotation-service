<template>
  <b-form-group class="tri-border">
    <template v-slot:label>
      <b-icon icon="people" />
      Team
    </template>
    <b-iconstack class="triangle mx-2" @click="rotate">
      <b-icon :variant="pos[current].variant" stacked icon="triangle-fill" />
      <b-icon
        :shift-v="pos[current].v"
        :shift-h="pos[current].h"
        variant="white"
        stacked
        icon="circle-fill"
        scale="0.35"
        class="triangle"
      />
    </b-iconstack>
    {{ pos[current].value }}
  </b-form-group>
</template>

<script>
export default {
  props: {
    current: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      // current: 0,
      pos: [
        { v: 2, h: 0, value: 'SEO', variant: 'primary-1' },
        { v: -3.75, h: 3, value: 'DA', variant: 'primary-2' },
        { v: -3.75, h: -3, value: 'CC', variant: 'primary-3' }
      ]
    }
  },
  methods: {
    rotate() {
      this.current = (this.current === 2)
        ? this.current = 0
        : this.current + 1
    }
  }
}
</script>

<style lang="scss" scoped>
.triangle {
  transition: 200ms ease-in-out;
  cursor: pointer;
}
.tri-border {
  border: 2px solid #e8e8e8;
  padding: 0 0.5em 0.25em 0;
  border-radius: 5px;
}
</style>
