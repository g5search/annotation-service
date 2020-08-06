<template>
  <div class="text-center py-5 h1">
    <b-icon-emoji-frown scale="1.2" class="pr-2 text-tertiary" />
    {{ slotName === 'filteredText' ? filteredText : searchText }}
  </div>
</template>

<script>
export default {
  props: {
    slotName: {
      type: String,
      default() {
        return 'filteredText'
      }
    }
  },
  data() {
    return {
      filteredText: 'Oh no! We couldn\'t find any notes that match your selected filters, please review and adjust them.',
      searchText: 'Your search did not return any results. Please adjust search string.'
    }
  }
}
</script>

<style>

</style>
