<template>
  <b-container fluid class="px-0">
    <div class="ceph-container" @click="isOpen = !isOpen">
      <octopus
        :size="`6em`"
        :color="`#334159`"
        :class="[{ 'is-open': isOpen }, 'ceph-container__svg', 'shadowed']"
      />
      <div class="ceph-container__title text-primary">
        <b-img-lazy
          src="/g5-logo.png"
        />
      </div>
    </div>
    <b-sidebar
      id="controls-container"
      v-model="isOpen"
      right
      width="400px"
      shadow
      bg-variant="neutral"
      sidebar-class="px-2"
    >
      <b-card
        header-class="d-flex m-0 p-0 justify-content-between align-items-center"
        header-bg-variant="white"
        body-class="px-3 py-4"
      >
        <template v-slot:header>
          <b-btn
            v-b-toggle.filter-controls
            variant="outline-secondary"
            block
          >
            <b-icon-filter />
            Filter Table
          </b-btn>
        </template>
        <b-collapse
          id="filter-controls"
          visible
          accordion="controls-accordion"
          role="tabpanel"
        >
          <b-form-group
            label-cols="2"
            label-class="d-flex align-items-center text-secondary justify-content-end"
          >
            <template v-slot:label>
              <b-icon-person />
              <span class="ml-2">
                User
              </span>
            </template>
            <b-form-select
              v-model="strategist"
              :options="strategists"
            />
          </b-form-group>
          <b-form-group
            label-cols="2"
            label-class="d-flex align-items-center text-secondary justify-content-end"
          >
            <template v-slot:label>
              Vertical
            </template>
            <b-form-select
              v-model="vertical"
              :options="verticals"
            />
          </b-form-group>
          <b-form-group
            label-cols="2"
            label-class="d-flex align-items-center text-secondary justify-content-end"
          >
            <template v-slot:label>
              Internal
            </template>
            <b-form-select
              v-model="internal"
              :options="internals"
            />
          </b-form-group>
          <b-btn-group class="w-100">
            <b-btn @click="onUpdate">
              <b-spinner v-if="isBusy" small />
              Update Table
            </b-btn>
            <b-btn
              @click="isBusy = !isBusy"
              variant="outline-secondary"
            >
              Clear Filters
            </b-btn>
          </b-btn-group>
        </b-collapse>
      </b-card>
      <b-card
        header-class="d-flex m-0 p-0 justify-content-start align-items-end border-0"
        body-class="p-1"
      >
        <template v-slot:header>
          <b-btn
            v-b-toggle.new-note
            variant="outline-secondary"
            block
          >
            <b-icon-card-text />
            New Note
          </b-btn>
        </template>
        <b-collapse
          id="new-note"
          accordion="controls-accordion"
          role="tabpanel"
        >
          <note-editor />
        </b-collapse>
      </b-card>
    </b-sidebar>
    <b-row no-gutters>
      <b-col>
        <b-card
          bg-variant="white"
          body-class="p-3"
          header-class="d-flex primary-header"
          header-bg-variant="neutral"
        >
          <template v-slot:header>
            <b-input-group>
              <template v-slot:prepend>
                <b-input-group-text class="text-primary">
                  <b-icon-search />
                  <span class="ml-2">
                    Search
                  </span>
                </b-input-group-text>
              </template>
              <b-form-input
                v-model="search"
              />
              <template v-slot:append>
                <b-btn
                  v-show="search !== ''"
                  @click="onClear"
                >
                  <b-icon-x-circle />
                </b-btn>
              </template>
            </b-input-group>
            <b-input-group class="ml-2">
              <template v-slot:prepend>
                <b-input-group-text>
                  Per Page
                </b-input-group-text>
              </template>
              <b-form-select
                v-model="perPage"
                :options="pageOptions"
              />
            </b-input-group>
            <b-pagination
              v-model="currentPage"
              :total-rows="totalRows"
              :per-page="perPage"
              class="my-0 mx-2"
            />
            <b-btn
              id="download-csv-btn"
              :href="downloadCsv"
              download="notes.csv"
              variant="primary"
              class="d-flex align-items-center mr-2"
            >
              <b-icon-download />
              <span class="ml-2">
                CSV
              </span>
            </b-btn>
            <b-btn
              @click="isOpen = !isOpen"
              variant="primary"
              class="d-flex align-items-center"
            >
              <b-icon-chevron-double-right />
              <span class="ml-2">
                More
              </span>
            </b-btn>
          </template>
          <b-table
            :fields="fields"
            :items="notes"
            :filter="search"
            :current-page="currentPage"
            :per-page="perPage"
            responsive
            small
            striped
            sticky-header
          >
            <template v-slot:cell(internal)="row">
              <div class="hover-anchor">
                <b-icon-emoji-neutral v-if="row.item.internal" font-scale="2" />
                <b-icon-emoji-sunglasses v-else font-scale="2" />
                <div class="hovered-icon">
                  {{ row.item.internal ? 'Internal Only' : 'Customer-Facing' }}
                </div>
              </div>
            </template>
            <template v-slot:cell(annotationType)="row">
              {{ row.item.annotationType }}
              <b-form-text
                v-if="row.item.startDate"
              >
                <b-row no-gutters>
                  <b-col cols="6">
                    Start
                  </b-col>
                  <b-col cols="6">
                    End
                  </b-col>
                </b-row>
                <b-row no-gutters>
                  <b-col cols="6">
                    {{ row.item.startDate }}
                  </b-col>
                  <b-col cols="6">
                    {{ row.item.endDate }}
                  </b-col>
                </b-row>
              </b-form-text>
            </template>
            <template v-slot:cell(createdAt)="row">
              {{ new Date(row.item.createdAt).toLocaleDateString() }}
            </template>
            <template v-slot:cell(updatedAt)="row">
              {{ new Date(row.item.updatedAt).toLocaleDateString() }}
            </template>
            <template v-slot:cell(locations)="row">
              <div v-if="row.item.locations.length >= 10">
                {{ row.item.locations.length }} Locations
              </div>
              <b-badge
                v-else
                v-for="(loc, i) in row.item.locations"
                :key="loc"
                :variant="`primary-${i}`"
                class="mr-1"
              >
                {{ loc }}
              </b-badge>
            </template>
            <template v-slot:cell(salesforceSync)="row">
              <b-icon-check-circle-fill v-if="row.item.salesforceSync" scale="1.5" />
              <b-icon-x-circle-fill v-else scale="1.5" />
            </template>
            <template v-slot:cell(note)="row">
              <read-only :content="row.item.note" />
            </template>
            <template v-slot:cell(edit)="row">
              <b-btn
                @click="onToggle(row)"
                variant="outline-primary"
                style="vertical-align: text-top;"
                class="d-flex"
              >
                <b-icon-pencil-square />
                <span class="ml-2">
                  Edit
                </span>
              </b-btn>
            </template>
            <template v-slot:row-details="row">
              {{ row }}
              <!-- <inline-editor :row="row" @toggle-details="onToggle" /> -->
            </template>
          </b-table>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Octopus from '~/components/icons/octopus'
import ReadOnly from '~/components/read-only'
import NoteEditor from '~/components/note-editor'
import PapaMixin from '~/mixins/papaparse'
export default {
  components: {
    Octopus,
    NoteEditor,
    ReadOnly
  },
  mixins: [PapaMixin],
  async asyncData({ $axios }) {
    const reject = [
      'annotation',
      'external_id',
      'startDate',
      'endDate'
    ]
    const notes = await $axios.$get('api/v1/notes')
    const strategists = await $axios.$get('api/v1/strategists')
    // const clients = await $$axios.$get('api/v1/clients')
    return {
      fields: [
        ...Object.keys(notes[0])
          .map(key => ({
            key,
            sortable: true,
            class: 'text-center align-middle'
          })).filter(field => !reject.includes(field.key)),
        { key: 'Edit', class: 'text-center align-middle' }
      ],
      notes,
      totalRows: notes.length,
      strategists: strategists.map(s => ({
        text: `${s.first_name} ${s.last_name}`,
        value: s.email
      }))
    }
  },
  data() {
    return {
      strategist: null,
      isOpen: false,
      isBusy: false,
      isError: false,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 20, 50, 100],
      search: '',
      client: null,
      vertical: null,
      verticals: [
        'Multifamily',
        'Senior Living',
        'Self Storage'
      ],
      category: null,
      categories: [],
      actionType: null,
      actionTypes: {},
      internal: null,
      internals: [
        { text: 'Both', value: null },
        { text: 'Internal Only', value: true },
        { text: 'Customer-Facing', value: false }
      ]
    }
  },
  methods: {
    onClear() {
      this.search = ''
    },
    onDrop(row) {},
    onToggle(row) {
      row.toggleDetails()
      // this.refetch()
    },
    onUpdate(evt) {
      const endpoint = `api/v1/notes?userEmail=${this.strategist}`
      this.isBusy = true
      this.$axios
        .$get(endpoint)
        .then((res) => {})
        .catch(() => {
          this.isError = true
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.ceph-container {
  position: fixed;
  bottom: 0%;
  right: 0%;
  z-index: 9999;
  transform: translate(-100%, -100%);
  &__svg {
    position: absolute;
    top: 0%;
    left: 0%;
    transition: 200ms ease-in-out;
    transform: rotate(0deg) translate(12%, -2%);
    transform-origin: center 45%;
    &.is-open {
      transform: rotate(180deg) translate(-17%, 23%);
    }
  }
  &__title {
    pointer-events: none;
    user-select: none;
    transform: translate(45%, 15%);
    font-size: 1.5rem;
    padding: 0.05em 0.35em;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    & img {
      user-select: none;
      pointer-events: none;
    }
  }
}
.primary-header {
  box-shadow: 0 5px 25px rgba(25, 53, 106, 0.5);
}
.align-middle {
  vertical-align: middle;
}
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 400ms cubic-bezier(0.2, 0.4, 0.8, 1.0);
}
.slide-fade-enter {
  transform: translateY(-20px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
.hover-anchor {
  position: relative;
  background-color: inherit;
  transition: 200ms ease-in-out;
  border-radius: 20px / 50% 0 0 50%;
  height: calc(100% + 10px);
  padding: 5px 0;
  & .hovered-icon {
    position: absolute;
    background-color: inherit;
    opacity: 0;
    top: 50%;
    right: 0%;
    width: 135px;
    height: 100%;
    display: flex;
    align-items: center;
    transform: translate(100%, -50%);
    border-radius: 20px / 0 50% 50% 0;
  }
  &:hover {
    background-color: #19356a;
    color: white;
    & .hovered-icon {
      opacity: 1;
    }
  }
}
</style>
