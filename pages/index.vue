<template>
  <b-container>
    <b-row class="my-5">
      <b-col cols="6" offset="3">
        <transition name="slide-fade" appear>
          <b-card v-show="true" class="text-center">
            <octopus :size="`5em`" />
          </b-card>
        </transition>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Octopus from '~/components/icons/octopus'
export default {
  components: {
    Octopus
  }
}
</script>

<style lang="scss" scoped>

</style>
