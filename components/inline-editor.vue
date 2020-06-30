<template>
  <b-card-group class="py-5 px-3">
    <b-card>
      <template v-slot:header>
        Client and locations
      </template>
      <vue-multiselect
        v-model="content.client"
        :options="clients"
        :custom-label="c => c.name"
      />
      <vue-multiselect
        v-model="content.locations"
        :options="locations"
        :multiple="true"
        :custom-label="l => `${l.name}`"
        @open="$emit('FETCH CLIENT LOCATIONS HERE')"
      />
      <vue-multiselect
        v-model="content.user"
        :options="users"
        :custom-label="u => u.text"
        track-by="value"
      />
    </b-card>
    <b-card>
      <template v-slot:header>
        Note Details
      </template>
      <b-form-checkbox
        v-model="content.internal"
        switch
        size="lg"
        class="align-self-center pr-2"
      >
        <b-icon-emoji-neutral v-if="content.internal" scale="1.5" />
        <b-icon-emoji-sunglasses v-else scale="1.5" />
        <span class="ml-2">
          {{ content.internal ? 'Internal-Only' : 'Ok to Share' }}
        </span>
      </b-form-checkbox>
      <vue-multiselect
        v-model="content.annotationCategory"
        :options="categories"
        :custom-label="c => c.text"
        track-by="value"
      />
      {{ actionTypes[`${content.annotationCategory.value}`] }}
      <!-- <vue-multiselect
        v-model="content.annotationType"
        :options="actionTypes[content.annotationCategory.value]"
      /> -->
      <div v-if="content.startDate || content.endDate">
        <b-form-datepicker
          :value-as-date="content.startDate"
        />
        <b-form-datepicker
          :value-as-date="content.endDate"
        />
      </div>
      <text-menu
        :content="content.note"
        @on-update="updateText"
      />
    </b-card>
    <b-card>
      <template v-slot:header>
        Dates and Controls
      </template>
      {{ content.salesforceSync }}
      {{ content.createdAt }}
      <b-form-datepicker
        v-model="content.createdAt"
      />
      <small class="text-muted">
        Last Updated on {{ new Date(content.updatedAt).toLocaleDateString() }}
      </small>
      <template v-slot:footer>
        <b-btn
          @click="onSave"
          variant="primary"
        >
          Save
        </b-btn>
        <b-btn
          @click="onCancel"
          variant="outline-tertiary"
        >
          Cancel
        </b-btn>
      </template>
    </b-card>
  </b-card-group>
</template>

<script>
import VueMultiselect from 'vue-multiselect'
import Hub from '~/mixins/hub'
import TextMenu from '~/components/text-with-menu'
export default {
  components: {
    VueMultiselect,
    TextMenu
  },
  mixins: [Hub],
  props: ['content', 'users', 'clients', 'categories', 'actionTypes'],
  data() {
    return {
      locations: []
    }
  },
  async created() {
    this.locations = await this.getClientLocations(this.content.client.urn)
  },
  methods: {
    onSave() {
      this.$emit('on-close')
    },
    onCancel() {
      this.$emit('on-close')
    },
    updateText(data) {
      // TODO handle updates from text editor
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
