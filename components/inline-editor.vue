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
          track-by="urn"
          @input="onClientChange"
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
          :custom-label="l => `${l.displayName ? l.displayName : l.name}`"
          track-by="urn"
          label="name"
        >
          <template
            slot="selection"
            slot-scope="{ values, isOpen }"
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
          <span class="smaller text-tertiary">
            *
          </span>
        </template>
        <vue-multiselect
          v-model="local.annotationCategory"
          :options="categories[team]"
          :custom-label="c => c.text"
          :allow-empty="false"
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
          :options="actionTypes[`${local.annotationCategory.value}`][team]"
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
      <div v-if="!local.internal" class="my-2 px-2">
        <b-form-checkbox
          id="toggle-promoted"
          v-model="promoted"
          :class="promoted ? 'text-success' : 'text-primary'"
          switch
          size="md"
        >
          <b-icon-star-fill v-if="promoted" />
          <b-icon-star v-else />
          {{ promoted ? 'Promoted!' : 'Promote' }}
        </b-form-checkbox>
      </div>
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
        <span :id="!isValid ? 'category-tip' : 'save-btn'" class="w-100 d-flex">
          <b-btn
            :disabled="!isValid"
            :variant="isValid ? 'primary-1' : 'outline-primary-1'"
            class="align-middle w-100"
            @click="onSave"
          >
            Save
          </b-btn>
          <b-tooltip
            target="category-tip"
            triggers="hover"
            placement="bottom"
            variant="primary-1"
          >
            Select a Category to Save
          </b-tooltip>
        </span>
        <b-btn
          variant="outline-tertiary"
          class="align-middle w-100 ml-3"
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
import AlertMixin from '~/mixins/alert-mixin'
import TextMenu from '~/components/text-with-menu'
export default {
  components: {
    VueMultiselect,
    TextMenu
  },
  mixins: [Hub, AlertMixin],
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
    teamId: {
      type: Number,
      default() {
        return 1
      }
    },
    clients: {
      type: Array,
      default() {
        return []
      }
    },
    categories: {
      type: Object,
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
      promoted: false,
      createdAt: null,
      category: null,
      actionType: null,
      user: null,
      note: ''
    }
  },
  computed: {
    team() {
      const map = {
        1: 'da',
        2: 'seo'
      }
      return map[this.teamId]
    },
    isValid() {
      const category = this.local.annotationCategory.value
      return category !== 'None'
    },
    id() {
      return this.content.id
    },
    teams() {
      return this.$store.state.controls.teams
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
    this.promoted = this.content.promoted
    this.createdAt = this.content.createdAt
    this.category = this.content.annotationCategory
    this.actionType = this.content.actionType
    this.startDate = this.local.startDate || null
    this.endDate = this.local.endDate || null
    this.locations = await this.getClientLocations(this.content.client.urn)
  },
  methods: {
    async onClientChange(evt) {
      if (evt) {
        this.locations = await this.getClientLocations(evt.urn)
        this.local.locations = []
      }
    },
    onSave() {
      const endpoint = `api/v1/note/${this.id}`
      this.$axios
        .$put(endpoint, {
          createdAt: this.local.createdAt,
          updatedAt: new Date().toISOString(),
          internal: this.local.internal,
          promoted: this.promoted,
          annotationCategory: this.local.annotationCategory.value,
          annotation: this.content.annotation.json,
          html: this.content.note,
          annotationType: this.local.annotationType,
          annotationUser: this.local.user.value,
          clientUrn: this.local.client.urn,
          locationUrns: this.local.locations.map(l => l.urn),
          teamId: this.teamId
        })
        .then(() => {
          this.showGlobalAlert('Note Updated!', 'success')
          this.$emit('on-close')
        }).catch(() => {
          this.showGlobalAlert('Network Error: Please try again', 'danger')
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
