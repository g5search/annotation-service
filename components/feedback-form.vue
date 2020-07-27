<template>
  <b-container fluid>
    <b-form-group label="Category">
      <b-form-select
        v-model="type"
        :options="types"
        required
      />
    </b-form-group>
    <b-form-group label="Comment">
      <b-form-textarea
        v-model="comments"
        :state="comments === '' ? null : commentLength <= 250"
        placeholder="Tell us how you really feel..."
        rows="6"
      />
    </b-form-group>
    <b-form-text class="text-muted text-right">
      {{ commentLength }} / 250
    </b-form-text>
    <b-btn
      :disabled="!isReady"
      variant="primary"
      block
      @click="onSubmit"
    >
      Submit
    </b-btn>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      type: null,
      types: [
        { text: 'Select an Option', value: null },
        'Report a Bug',
        'Suggest a Better Way',
        'Pitch a New Feature'
      ],
      comments: ''
    }
  },
  computed: {
    commentLength() {
      return this.comments.length
    },
    isReady() {
      return this.comments.length !== 0 &&
        this.commentLength <= 250 &&
        this.type !== null
    }
  },
  methods: {
    onReset() {},
    onSubmit() {
      this.$axios
        .$post('api/v1/feedback', {
          type: this.type,
          comments: this.comments
        })
        .finally(() => {
          this.type = null
          this.comments = ''
        })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
