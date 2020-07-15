<template>
  <b-card-group class="py-4 px-3">
    <b-card bg-variant="transparent">
      <b-form-group label-class="pl-2">
        <template v-slot:label>
          <b-icon-briefcase scale="1.2" />
          Client
        </template>
        <vue-multiselect
          v-model="local.client"
          :options="clients"
          :custom-label="c => c.name"
        />
      </b-form-group>
      <b-form-group label-class="pl-2">
        <template v-slot:label>
          <b-icon-building scale="1.2" />
          Locations
        </template>
        <vue-multiselect
          v-model="local.locations"
          :options="locations"
          :multiple="true"
          :close-on-select="false"
          :custom-label="l => `${l.display_name ? l.display_name : l.name}`"
          track-by="urn"
          label="name"
          @open="$emit('FETCH CLIENT LOCATIONS HERE')"
        >
          <template
            slot="selection"
            slot-scope="{ values, search, isOpen }"
          >
            <span
              v-if="values.length && !isOpen"
              class="multiselect__single"
            >
              {{ values.length }} location(s) selected
            </span>
          </template>
        </vue-multiselect>
      </b-form-group>
      <b-form-group label-class="pl-2">
        <template v-slot:label>
          <b-icon-person-fill scale="1.2" />
          User
        </template>
        <vue-multiselect
          v-model="local.user"
          :options="users"
          :custom-label="u => u.text"
          track-by="value"
        />
      </b-form-group>
    </b-card>
    <b-card :bg-variant="local.internal ? 'quaternary-0' : 'transparent'">
      <b-form-group label-class="pl-2">
        <template v-slot:label>
          <b-icon-eye-fill scale="1.2" />
          Visibility
        </template>
        <b-form-checkbox
          v-model="local.internal"
          switch
          size="md"
          class="align-self-center pr-2"
        >
          <b-icon-emoji-neutral v-if="local.internal" scale="1.2" />
          <b-icon-emoji-sunglasses v-else scale="1.2" />
          <span class="ml-2">
            {{ local.internal ? 'Internal-Only' : 'Ok to Share' }}
          </span>
        </b-form-checkbox>
      </b-form-group>
      <b-form-group label-class="pl-2">
        <template v-slot:label>
          <b-icon-collection scale="1.2" />
          Category
        </template>
        <vue-multiselect
          v-model="local.annotationCategory"
          :options="categories"
          :custom-label="c => c.text"
          track-by="value"
        />
      </b-form-group>
      <b-form-group label-class="pl-2">
        <template v-slot:label>
          <b-icon-puzzle scale="1.2" />
          Action Type
        </template>
        <vue-multiselect
          v-if="actionTypes[`${local.annotationCategory.value}`]"
          v-model="local.annotationType"
          :options="actionTypes[`${local.annotationCategory.value}`]"
        />
      </b-form-group>
      <div v-show="showDates">
        <b-form-group label="Start Date">
          <b-form-datepicker
            v-model="local.startDate"
          />
        </b-form-group>
        <b-form-group label="End Date">
          <b-form-datepicker
            v-model="local.endDate"
          />
        </b-form-group>
      </div>
      <text-menu
        :content="note"
        @on-update="updateText"
      />
    </b-card>
    <b-card bg-variant="transparent" footer-class="d-flex justify-content-between">
      <b-form-group label-class="pl-2">
        <template v-slot:label>
          <b-icon-calendar-day scale="1.2" />
          Created Date
        </template>
        <b-form-datepicker
          v-model="createdAt"
        />
        <small class="text-muted pl-2">
          Last Updated on {{ new Date(content.updatedAt).toLocaleDateString() }}
        </small>
      </b-form-group>
      <template v-slot:footer>
        <b-btn
          variant="primary"
          class="align-middle w-50"
          @click="onSave"
        >
          Save
        </b-btn>
        <b-btn
          variant="outline-tertiary"
          class="align-middle w-50 ml-3"
          @click="onCancel"
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
  props: {
    content: {
      type: Object,
      default() {
        return {}
      }
    },
    users: {
      type: Array,
      default() {
        return []
      }
    },
    clients: {
      type: Array,
      default() {
        return []
      }
    },
    categories: {
      type: Array,
      default() {
        return this.$store.state.controls.categories
      }
    },
    actionTypes: {
      type: Object,
      default() {
        return this.$store.state.controls.actionTypes
      }
    }
  },
  data() {
    return {
      local: this.content,
      client: null,
      includedLocations: [],
      locations: [],
      internal: null,
      createdAt: null,
      category: null,
      actionType: null,
      user: null,
      note: ''
    }
  },
  computed: {
    id() {
      return this.content.id
    },
    showDates() {
      const matches = [
        'Specials/Promotions',
        'Testing',
        'Uncontrollable Circumstance',
        'DA WoW',
        'Other',
        'Dynamic Pricing',
        'Dynamic Availability'
      ]
      return matches.includes(this.local.annotationType)
    }
  },
  async created() {
    this.client = this.content.client
    this.note = this.content.note
    this.user = this.content.user
    this.internal = this.content.internal
    this.createdAt = this.content.createdAt
    this.category = this.content.annotationCategory
    this.actionType = this.content.actionType
    this.startDate = this.local.startDate || null
    this.endDate = this.local.endDate || null
    this.locations = await this.getClientLocations(this.content.client.urn)
  },
  methods: {
    onSave() {
      const endpoint = `api/v1/note/${this.id}`
      this.$axios
        .$put(endpoint, {
          createdAt: this.local.createdAt,
          updatedAt: new Date().toISOString(),
          internal: this.local.internal,
          annotationCategory: this.local.annotationCategory.value,
          annotation: this.content.annotation.json,
          html: this.content.note,
          annotationType: this.local.annotationType,
          annotationUser: this.local.user.value,
          clientUrn: this.local.client.urn,
          locationUrns: this.local.locations.map(l => l.urn)
        })
        .then(() => {
          this.$emit('on-close')
        })
    },
    onCancel() {
      this.$emit('on-close')
    },
    updateText(data) {
      this.content.note = data.html
      this.content.annotation = data
      // TODO handle updates from text editor
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
