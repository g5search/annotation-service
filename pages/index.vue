<template>
  <b-container>
    <b-row class="my-5">
      <b-col cols="6" offset="3">
        <transition name="slide-fade" appear>
          <b-card v-show="true" class="text-center">
            <p>Annotation Service</p>
            <octopus :size="`5em`" />
          </b-card>
        </transition>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        {{ notes }}
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Octopus from '~/components/icons/octopus'
export default {
  components: {
    Octopus
  },
  async asyncData({ $axios }) {
    return {
      notes: await $axios.$get('/api/v1/notes')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
