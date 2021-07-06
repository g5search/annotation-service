<template>
  <div class="dangle">
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
        :id="`client-select-${parent}`"
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
        :id="`location-select-${parent}`"
        :value="location"
        :options="locations"
        :custom-label="l => `${l.displayName ? l.displayName : l.name}`"
        @input="onUpdate({ location: $event })"
      />
    </b-form-group>
    <b-btn-group class="dangle__btn bg-white">
      <b-btn
        variant="outline-primary"
        @click="$emit(
          'on-submit', {
            clientUrn: client ? client.urn : null,
            locationUrns: location ? location.urn : null
          }
        )"
      >
        Update
      </b-btn>
      <b-btn
        variant="tertiary"
        @click="onClear"
      >
        Clear
      </b-btn>
    </b-btn-group>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import VueMultiselect from 'vue-multiselect'
export default {
  components: {
    VueMultiselect
  },
  props: {
    parent: {
      type: String,
      default() {
        return 'header'
      }
    }
  },
  data() {
    return {
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
      locations: state => state.controls.locations
    })
  },
  methods: {
    ...mapActions({
      onUpdate: 'controls/onUpdate',
      onReset: 'controls/onReset'
    }),
    onClear() {
      this.onReset()
      this.$emit('on-submit')
    },
    async getLocations(evt) {
      if (!evt) {
        return
      }
      this.onUpdate({ client: evt })
      this.onUpdate({ location: [] })
      await this.$axios
        .$get(`api/hub/clients/${this.client.urn}/locations`)
        .then(l => this.onUpdate({ locations: l }))
    }
  }
}
</script>

<style lang="scss" scoped>
.dangle {
  position: relative;
  &__btn {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 125%);
  }
}
</style>
