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
            @input="onUpdate({ key: 'location', value: $event })"
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
            @input="onUpdate({ key: 'user', value: $event })"
          />
        </b-form-group>
        <b-form-group
          label-cols="4"
          label-class="text-primary-1 py-1"
        >
          <template v-slot:label>
            <b-icon-people-fill />
            Team
          </template>
          <b-form-select
            v-model="team"
            :options="teams"
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
            :options="categories[team]"
            @input="onUpdate({ key: 'category', value: $event })"
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
            :options="actionTypes[category][team]"
            @input="onUpdate({ key: 'actionType', value: $event })"
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
              @input="onUpdate({ key: 'startDate', value: $event })"
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
              @input="onUpdate({ key: 'endDate', value: $event })"
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
            @input="onUpdate({ key: 'isInternal', value: $event })"
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
            @change="onUpdate({ key: 'isCreatedAt', value: $event })"
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
              @input="onUpdate({ key: 'fromDate', value: $event })"
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
              @input="onUpdate({ key: 'toDate', value: $event })"
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
      teams: state => state.controls.teams,
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
    ...mapGetters({
      showDates: 'controls/showDates'
    })
  },
  methods: {
    ...mapActions({
      onUpdate: 'controls/onUpdate',
      // onRemove: 'controls/onRemove',
      reset: 'controls/onReset'
    }),
    onReset() {
      this.reset()
      this.onSubmit()
    },
    async getLocations(evt) {
      if (!evt) {
        return
      }
      this.onUpdate({ key: 'client', value: evt })
      this.onUpdate({ key: 'location', value: [] })
      await this.$axios
        .$get(`api/hub/clients/${this.client.urn}/locations`)
        .then(l => this.onUpdate({ key: 'locations', value: l }))
    },
    onSubmit() {
      this.$emit('on-submit', {
        userEmail: this.user ? this.user : null,
        annotationName: this.category ? this.category : null,
        annotationType: this.actionType ? this.actionType : null,
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
