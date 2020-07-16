<template>
  <b-container class="p-5">
    <b-btn to="/" variant="transparent" class="text-primary-1" style="font-size: 5em;">
      <b-iconstack>
        <b-icon stacked icon="file-earmark-spreadsheet" scale="1" />
        <b-icon
          stacked
          icon="arrow-down-square-fill"
          shift-h="5"
          shift-v="5"
          scale="0.5"
        />
      </b-iconstack>
    </b-btn>
  </b-container>
</template>

<script>
export default {
  asyncData () {
    return new Promise((resolve) => {
      // eslint-disable-next-line
      setTimeout(function () {
        resolve({})
      }, 4000)
    })
  }
}
</script>

<style>

</style>
