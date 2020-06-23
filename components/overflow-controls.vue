<template>
  <b-container fluid class="py-3">
    <b-row no-gutters>
      <b-col>
        <b-form-group
          label-cols="4"
          label-class="d-flex align-items-center text-secondary justify-content-start"
        >
          <template v-slot:label>
            <span class="ml-2">
              Client
            </span>
          </template>
          <vue-multiselect
            id="client-select"
            :value="client"
            :options="clients"
            @input="getLocations"
            placeholder="Search"
            track-by="urn"
            label="name"
          />
        </b-form-group>
        <b-form-group
          label-cols="4"
          label-class="d-flex align-items-center text-secondary justify-content-start"
        >
          <template v-slot:label>
            <span class="ml-2">
              Location
            </span>
          </template>
          <vue-multiselect
            id="location-select"
            :value="location"
            :options="locations"
            @input="onUpdate({ key: 'location', value: $event })"
          />
        </b-form-group>
        <b-form-group
          label-cols="4"
          label-class="d-flex align-items-center text-secondary justify-content-start"
        >
          <template v-slot:label>
            <span class="ml-2">
              Vertical
            </span>
          </template>
          <b-form-select
            id="vertical-select"
            :value="vertical"
            :options="verticals"
            @input="onUpdate({ key: 'vertical', value: $event })"
          />
        </b-form-group>
        <b-form-group
          label-cols="4"
          label-class="d-flex align-items-center text-secondary justify-content-start"
        >
          <template v-slot:label>
            <span class="ml-2">
              User
            </span>
          </template>
          <b-form-select
            id="user-select"
            :value="user"
            :options="users"
            @input="onUpdate({ key: 'user', value: $event })"
          />
        </b-form-group>
        <b-form-group
          label-cols="4"
          label-class="d-flex align-items-center text-secondary justify-content-start"
        >
          <template v-slot:label>
            <span class="ml-2">
              Category
            </span>
          </template>
          <b-form-select
            id="category-select"
            :value="category"
            :options="categories"
            @input="onUpdate({ key: 'category', value: $event })"
          />
        </b-form-group>
        <b-form-group
          label-cols="4"
          label-class="d-flex align-items-center text-secondary justify-content-start"
        >
          <template v-slot:label>
            <span class="ml-2">
              Action
            </span>
          </template>
          <b-form-select
            id="action-type-select"
            :value="actionType"
            :options="actionTypes[category]"
            @input="onUpdate({ key: 'actionType', value: $event })"
          />
        </b-form-group>
        <b-form-group
          label-cols="4"
          label-class="d-flex align-items-center text-secondary justify-content-start"
        >
          <template v-slot:label>
            <span class="ml-2">
              Is Internal
            </span>
          </template>
          <b-form-select
            id="is-internal-select"
            :value="isInternal"
            :options="isInternals"
            @input="onUpdate({ key: 'isInternal', value: $event })"
          />
        </b-form-group>
        <b-form-group
          label-cols="4"
          label-class="d-flex align-items-center text-secondary justify-content-start"
        >
          <template v-slot:label>
            <b-icon-calendar-date-fill />
            <span class="ml-2">
              Start Date
            </span>
          </template>
          <b-form-datepicker
            :value="startDate"
            @input="onUpdate({ key: 'startDate', value: $event })"
          />
        </b-form-group>
        <b-form-group
          label-cols="4"
          label-class="d-flex align-items-center text-secondary justify-content-start"
        >
          <template v-slot:label>
            <b-icon-calendar-date-fill />
            <span class="ml-2">
              End Date
            </span>
          </template>
          <b-form-datepicker
            :value="endDate"
            @input="onUpdate({ key: 'endDate', value: $event })"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-card no-body class="p-2 mb-3">
      <b-row>
        <b-col>
          <b-form-checkbox
            :checked="isCreatedAt"
            @change="onUpdate({ key: 'isCreatedAt', value: $event })"
            switch
            size="sm"
          >
            Filter by {{ isCreatedAt ? 'Created' : 'Updated' }} Date Range
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="6">
          <b-form-group
            label="From"
            label-class="text-secondary"
          >
            <b-form-datepicker
              :value="fromDate"
              @input="onUpdate({ key: 'fromDate', value: $event })"
            />
          </b-form-group>
        </b-col>
        <b-col cols="6">
          <b-form-group
            label="To"
            label-class="text-secondary"
          >
            <b-form-datepicker
              :value="toDate"
              :min="fromDate"
              @input="onUpdate({ key: 'fromDate', value: $event })"
            />
          </b-form-group>
        </b-col>
      </b-row>
    </b-card>
    <b-row>
      <b-col cols="6">
        <b-btn
          id="filter-table-btn"
          @click="onSubmit"
          variant="primary"
          block
        >
          <b-spinner v-if="isBusy" small />
          Update Table
        </b-btn>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import VueMultiselect from 'vue-multiselect'
export default {
  components: {
    VueMultiselect
  },
  props: {
    isBusy: {
      type: Boolean,
      default: false
    }
  },
  computed: mapState({
    client: state => state.controls.client,
    clients: state => state.controls.clients,
    location: state => state.controls.location,
    locations: state => state.controls.locations,
    vertical: state => state.controls.vertical,
    verticals: state => state.controls.verticals,
    user: state => state.controls.user,
    users: state => state.controls.users,
    category: state => state.controls.category,
    categories: state => state.controls.categories,
    actionType: state => state.controls.actionType,
    actionTypes: state => state.controls.actionTypes,
    isInternal: state => state.controls.isInternal,
    isInternals: state => state.controls.isInternals,
    startDate: state => state.controls.startDate,
    endDate: state => state.controls.endDate,
    isCreatedAt: state => state.controls.isCreatedAt,
    fromDate: state => state.controls.fromDate,
    toDate: state => state.controls.toDate,
    salesforceSync: state => state.controls.salesforceSync
  }),
  methods: {
    ...mapActions({
      onUpdate: 'controls/onUpdate'
    }),
    async getLocations(evt) {
      this.onUpdate({ key: 'client', value: evt })
      await this.$axios
        .$get(`api/hub/clients/${this.client.urn}/locations`)
        .then(l => this.onUpdate({ key: 'locations', value: l }))
    },
    onSubmit() {
      this.$emit('on-submit')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
