<template>
  <b-container fluid class="py-3">
    <b-row no-gutters>
      <b-col>
        <b-form-group
          :label-class="labelClass"
          label-cols="4"
        >
          <template v-slot:label>
            <b-icon icon="briefcase" scale="1.1" />
            <span class="ml-2">
              Client
            </span>
          </template>
          <vue-multiselect
            id="client-select"
            :value="client"
            :options="clients"
            placeholder="Search"
            track-by="urn"
            label="name"
            @input="getLocations"
          />
        </b-form-group>
        <b-form-group
          :label-class="labelClass"
          label-cols="4"
        >
          <template v-slot:label>
            <b-icon icon="building" scale="1.1" />
            <span class="ml-2">
              Location
            </span>
          </template>
          <vue-multiselect
            id="location-select"
            :value="location"
            :options="locations"
            :custom-label="l => `${l.displayName ? l.displayName : l.name}`"
            @input="onUpdate({ location: $event })"
          />
        </b-form-group>
        <b-form-group
          :label-class="labelClass"
          label-cols="4"
        >
          <template v-slot:label>
            <b-icon icon="person" scale="1.1" />
            <span class="ml-2">
              User
            </span>
          </template>
          <b-form-select
            id="user-select"
            :value="user"
            :options="users"
            @input="onUpdate({ user: $event })"
          />
        </b-form-group>
        <b-form-group
          :label-class="labelClass"
          label-cols="4"
        >
          <template v-slot:label>
            <b-icon-collection scale="1.1" />
            <span class="ml-2">
              Category
            </span>
          </template>
          <b-form-select
            id="category-select"
            :value="category"
            :options="categories"
            @input="onUpdate({ category: $event })"
          />
        </b-form-group>
        <b-form-group
          :label-class="labelClass"
          label-cols="4"
        >
          <template v-slot:label>
            <b-icon icon="puzzle" scale="1.1" />
            <span class="ml-2">
              Action Type
            </span>
          </template>
          <b-form-select
            id="action-type-select"
            :value="actionType"
            :options="actionTypes[category]"
            @input="onUpdate({ actionType: $event })"
          />
        </b-form-group>
        <div v-show="showDates">
          <b-form-group
            :label-class="labelClass"
            label-cols="4"
          >
            <template v-slot:label>
              <b-icon icon="calendar" />
              <span class="ml-2">
                Start Date
              </span>
            </template>
            <b-form-datepicker
              :value="startDate"
              @input="onUpdate({ startDate: $event })"
            />
          </b-form-group>
          <b-form-group
            :label-class="labelClass"
            label-cols="4"
          >
            <template v-slot:label>
              <b-icon-calendar />
              <span class="ml-2">
                End Date
              </span>
            </template>
            <b-form-datepicker
              :value="endDate"
              @input="onUpdate({ endDate: $event })"
            />
          </b-form-group>
        </div>
        <b-form-group
          :label-class="labelClass"
          label-cols="4"
        >
          <template v-slot:label>
            <b-icon icon="eye" scale="1.1" />
            <span class="ml-2">
              Visibility
            </span>
          </template>
          <b-form-select
            id="is-internal-select"
            :value="isInternal"
            :options="isInternals"
            @input="onUpdate({ isInternal: $event })"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-card no-body bg-variant="pale" class="border-0 py-2 px-3 mb-3">
      <b-row>
        <b-col class="mb-2 text-muted">
          <b-form-checkbox
            :checked="isCreatedAt"
            switch
            size="sm"
            @change="onUpdate({ isCreatedAt: $event })"
          >
            Filter by {{ isCreatedAt ? 'Created' : 'Updated' }} Date Range
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="12">
          <b-form-group
            label="From"
            label-class="text-primary-1"
            label-cols="4"
          >
            <b-form-datepicker
              :value="fromDate"
              @input="onChange({ key: 'fromDate', value: $event })"
            />
          </b-form-group>
        </b-col>
        <b-col cols="12">
          <b-form-group
            label="To"
            label-class="text-primary-1"
            label-cols="4"
          >
            <b-form-datepicker
              :value="toDate"
              :min="fromDate"
              @input="onChange({ key: 'toDate', value: $event })"
            />
          </b-form-group>
        </b-col>
      </b-row>
    </b-card>
    <b-row>
      <b-col cols="8">
        <b-btn
          id="filter-table-btn"
          variant="primary"
          block
          @click="onSubmit"
        >
          <b-spinner v-if="isBusy" small />
          Update Table
        </b-btn>
      </b-col>
      <b-col cols="4">
        <b-btn
          id="clear-filters"
          variant="tertiary-2"
          block
          @click="onReset"
        >
          Clear Filters
        </b-btn>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import VueMultiselect from 'vue-multiselect'
import QueryParams from '~/mixins/query-params'
export default {
  components: {
    VueMultiselect
  },
  mixins: [QueryParams],
  props: {
    isBusy: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      team: 'da',
      labelClass: [
        'd-flex',
        'align-items-center',
        'text-primary-1',
        'justify-content-start'
      ]
    }
  },
  computed: {
    ...mapState({
      client: state => state.controls.client,
      clients: state => state.controls.clients,
      location: state => state.controls.location,
      locations: state => state.controls.locations,
      user: state => state.controls.user,
      users: state => state.controls.users,
      category: state => state.controls.category,
      categories: state => state.filters.categories,
      actionType: state => state.controls.actionType,
      actionTypes: state => state.filters.actionTypes,
      isInternal: state => state.controls.isInternal,
      isInternals: state => state.controls.isInternals,
      startDate: state => state.controls.startDate,
      endDate: state => state.controls.endDate,
      isCreatedAt: state => state.controls.isCreatedAt,
      fromDate: state => state.controls.fromDate,
      toDate: state => state.controls.toDate,
      salesforceSync: state => state.controls.salesforceSync
    }),
    ...mapGetters({
      showDates: 'controls/showDates'
    })
  },
  methods: {
    ...mapActions({
      onUpdate: 'controls/onUpdate',
      reset: 'controls/onReset'
    }),
    onChange({ key, value }) {
      this.updateQueryParams({ [key]: value })
      this.onUpdate({ [key]: value })
    },
    onReset() {
      this.reset()
      this.onSubmit()
    },
    getLocations(evt) {
      // updates selected client and locations
      this.onUpdate({ client: evt, location: null })
      // fetches locations if client was selected
      this.updateQueryParams({ client: evt ? evt.urn : null, location: null })
      if (evt) {
        this.$axios
          .$get(`api/hub/clients/${this.client.urn}/locations`)
          .then(l => this.onUpdate({ locations: l }))
      }
    },
    onSubmit() {
      this.$emit('on-submit', {
        userEmail: this.user ? this.user : null,
        annotationName: this.category !== 'None' ? this.category : null,
        annotationType: this.actionType !== 'None' ? this.actionType : null,
        clientUrn: this.client ? this.client.urn : null,
        locationUrns: this.location ? this.location.urn : null,
        isInternal: this.isInternal !== null ? this.isInternal : null,
        searchBy: this.isCreatedAt ? 'createdAt' : 'updatedAt',
        from: this.fromDate ? this.fromDate : null,
        to: this.toDate ? this.toDate : null,
        startDate: this.startDate ? this.startDate : null,
        endDate: this.endDate ? this.endDate : null
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
