<template>
  <b-container fluid class="feedback-container">
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
    <alert
      :specs="specs"
    />
  </b-container>
</template>

<script>
import Alert from '~/components/alert'
import AlertMixin from '~/mixins/alert-mixin'
export default {
  components: {
    Alert
  },
  mixins: [AlertMixin],
  data() {
    return {
      type: null,
      types: [
        { text: 'Select an Option', value: null },
        'Report a Bug',
        'Suggest a Better Way',
        'Pitch a New Feature'
      ],
      comments: '',
      specs: {
        id: 'submission-status',
        width: 'w-100',
        dismissCountDown: 'dismissCountDown',
        alertVariant: 'alertVariant',
        alertMsg: 'alertMsg',
        dismissSecs: 'dismissSecs'
      }
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
        .then(() => this.showAlert('Feedback Submitted!', 'success'))
        .catch(() => this.showAlert('Error: Please try again', 'danger'))
        .finally(() => {
          this.type = null
          this.comments = ''
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.feedback-container {
  position: relative;
  & #submission-status {
    position: absolute;
    top: 0%;
    left: 50%;
    transform: translate(-50%, -100%);
    border-radius: 5px;
  }
}
</style>
