<template>
  <b-container fluid class="px-0">
    <div class="ceph-container" @click="isOpen = !isOpen">
      <octopus
        :size="`6em`"
        :color="`#19356a`"
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
      width="450px"
      shadow
      sidebar-class="px-0"
    >
      <b-tabs card class="my-0 bg-white">
        <b-tab no-body>
          <template v-slot:title>
            <b-icon-filter scale="0.8" style="vertical-align: -0.15em;" />
            Filters
          </template>
          <controls :is-busy="isBusy" @on-submit="onSubmit" />
        </b-tab>
        <b-tab no-body>
          <template v-slot:title>
            <b-icon-card-text scale="0.8" style="vertical-align: -0.15em;" />
            New Note
          </template>
          <note-editor />
        </b-tab>
        <b-tab>
          <template v-slot:title>
            <b-icon-chat-quote scale="0.8" style="vertical-align: -0.15em;" />
            Feedback
          </template>
          <feedback-form />
        </b-tab>
      </b-tabs>
      <small class="text-right text-muted px-3 pb-1">
        v.{{ version }}
      </small>
    </b-sidebar>
    <b-row no-gutters>
      <b-col>
        <b-card
          bg-variant="white"
          body-class="p-0"
          header-class="d-flex"
          header-bg-variant="light"
        >
          <template v-slot:header>
            <b-input-group>
              <template v-slot:prepend>
                <b-input-group-text class="inset-label bg-transparent text-darker border-0">
                  <b-icon icon="search" />
                </b-input-group-text>
              </template>
              <b-form-input
                v-model="search"
                type="text"
                debounce="500"
                placeholder="Search Notes..."
                class="inset-padding"
              />
              <template v-slot:append>
                <b-btn
                  v-show="search !== ''"
                  variant="transparent"
                  class="inset-btn text-darker"
                  @click="onClear"
                >
                  <b-icon-x-circle-fill />
                </b-btn>
              </template>
            </b-input-group>
            <b-btn
              id="filter-me-btn"
              @click="onFilterMe"
              variant="transparent"
              class="ml-2 align-middle"
            >
              <b-icon-person-circle />
            </b-btn>
            <b-tooltip
              target="filter-me-btn"
              triggers="hover"
              placement="bottom"
              variant="primary-1"
            >
              Filter table to just my notes
            </b-tooltip>
            <b-input-group class="ml-2 w-50">
              <template v-slot:prepend>
                <b-input-group-text class="bg-transparent border-0">
                  Show Rows
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
              pills
              class="my-0 mx-2"
            />
            <b-btn
              id="download-csv-btn"
              :href="downloadCsv"
              download="notes.csv"
              variant="transparent"
              class="d-flex align-items-center mr-2"
            >
              <b-icon icon="file-spreadsheet" />
            </b-btn>
            <b-tooltip
              target="download-csv-btn"
              triggers="hover"
              placement="bottom"
              variant="primary-1"
            >
              Download a CSV of the current table
            </b-tooltip>
            <b-btn
              variant="transparent"
              class="d-flex align-items-center"
              @click="isOpen = !isOpen"
            >
              <b-icon-layout-sidebar-inset-reverse />
            </b-btn>
          </template>
          <b-table
            ref="notesTable"
            :fields="fields"
            :items="notes"
            :filter="search"
            :current-page="currentPage"
            :per-page="perPage"
            :busy="isBusy"
            :filter-included-fields="['note']"
            primary-key="id"
            show-empty
            responsive
            small
            hover
            striped
            sticky-header
            outlined
          >
            <template v-slot:table-busy>
              <div class="text-center h1 align-middle">
                <b-spinner scale="5" style="vertical-align: -0.15em;" />
                Loading Those Notes...
              </div>
            </template>
            <template v-slot:emptyfiltered>
              <div class="text-center py-5 h1">
                <b-icon-emoji-frown scale="1.2" />
                Your search did not return any results. Please adjust search string.
              </div>
            </template>
            <template v-slot:empty>
              <div class="text-center py-5 h1">
                <b-icon-emoji-frown scale="1.7" class="pr-2 text-tertiary" />
                {{ isEmpty }}
              </div>
            </template>
            <template v-slot:cell(internal)="row">
              <div class="hover-anchor">
                <b-icon-emoji-neutral v-if="row.item.internal" font-scale="2" />
                <b-icon-emoji-sunglasses v-else font-scale="2" />
                <div class="hovered-icon">
                  {{ row.item.internal ? 'Internal Only' : 'Customer-Facing' }}
                </div>
              </div>
            </template>
            <template v-slot:cell(annotationCategory)="row">
              {{ row.item.annotationCategory.text }}
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
            <template v-slot:cell(locationNames)="row">
              <div v-if="row.item.locationNames.length >= 10">
                {{ row.item.locationNames.length }} Locations
              </div>
              <b-badge
                v-for="(loc, i) in row.item.locationNames"
                v-else
                :key="`${loc}-${row.item.id}`"
                :variant="`primary-${i}`"
                class="mr-1"
              >
                {{ loc }}
              </b-badge>
            </template>
            <template v-slot:cell(salesforceSync)="row">
              <b-icon-check-circle-fill
                v-if="row.item.salesforceSync"
                scale="1.2"
                class="text-success"
              />
              <b-icon-x-circle-fill
                v-else
                scale="1.2"
                class="text-tertiary"
              />
            </template>
            <template v-slot:cell(note)="row">
              <span v-html="row.item.note" />
            </template>
            <template v-slot:cell(edit)="row">
              <div class="d-flex align-items-center">
                <b-btn
                  :variant="row.detailsShowing ? 'primary' : 'transparent'"
                  class="align-middle"
                  @click="onToggle(row)"
                >
                  <b-icon-pencil scale="1.2" />
                </b-btn>
                <b-btn
                  variant="transparent"
                  class="ml-2 align-middle text-tertiary"
                  @click="onDrop(row)"
                >
                  <b-icon-trash scale="1.2" />
                </b-btn>
              </div>
            </template>
            <template v-slot:row-details="row">
              <transition name="scale-in-ver-top" appear leave>
                <inline-editor
                  :content="row.item"
                  :clients="clients"
                  :users="users"
                  :categories="categories"
                  :action-types="actionTypes"
                  @on-close="row.toggleDetails()"
                />
              </transition>
            </template>
          </b-table>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState } from 'vuex'
import { version } from '~/package.json'
import Octopus from '~/components/icons/octopus'
import Controls from '~/components/overflow-controls'
import NoteEditor from '~/components/note-editor'
import FeedbackForm from '~/components/feedback-form'
import InlineEditor from '~/components/inline-editor'
import PapaMixin from '~/mixins/papaparse'
export default {
  components: {
    Octopus,
    Controls,
    FeedbackForm,
    InlineEditor,
    NoteEditor
  },
  mixins: [PapaMixin],
  async fetch({ store }) {
    await store.dispatch('controls/fillUsers')
    store.dispatch('controls/fillClients')
  },
  async asyncData({ $axios }) {
    const notes = await $axios.$get('api/v1/notes')
    const me = await $axios.$get('api/v1/whoami')
    return {
      me,
      notes,
      totalRows: notes.length
    }
  },
  data() {
    return {
      version,
      isEmpty: 'Oh no! We couldn\'t find any notes that match your selected filters, please review and adjust them.',
      isOpen: false,
      isBusy: false,
      isError: false,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 20, 50, 100],
      search: '',
      fields: [
        {
          key: 'internal',
          label: 'Visibility',
          sortable: true,
          class: 'align-middle text-center'
        },
        {
          key: 'annotationCategory',
          label: 'Category',
          sortable: true,
          class: 'align-middle text-center'
        },
        {
          key: 'annotationType',
          label: 'Action Type',
          sortable: true,
          class: 'align-middle text-center'
        },
        {
          key: 'annotationUser',
          label: 'User',
          sortable: true,
          class: 'align-middle text-center'
        },
        {
          key: 'createdAt',
          label: 'Created',
          sortable: true,
          class: 'align-middle text-center'
        },
        {
          key: 'updatedAt',
          label: 'Updated',
          sortable: true,
          class: 'align-middle text-center'
        },
        {
          key: 'salesforceSync',
          label: 'Synced',
          sortable: true,
          class: 'align-middle text-center'
        },
        {
          key: 'note',
          label: 'Note',
          sortable: true,
          class: 'align-middle'
        },
        {
          key: 'clientName',
          label: 'Client',
          sortable: true,
          class: 'align-middle'
        },
        {
          key: 'locationNames',
          label: 'Locations',
          sortable: true,
          class: 'align-middle'
        },
        {
          key: 'edit',
          label: 'Edit',
          sortable: false,
          class: 'align-middle text-center'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      clients: state => state.controls.clients,
      users: state => state.controls.users,
      categories: state => state.controls.categories,
      actionTypes: state => state.controls.actionTypes
    })
  },
  mounted() {
    this.updateCsv()
  },
  methods: {
    rdm(min, max) {
      return Math.random() * (max - min) + min
    },
    onClear() {
      this.search = ''
    },
    onFilterMe() {
      this.isBusy = true
      const endpoint = `api/v1/notes?email=${this.me.email}`
      this.$axios
        .$get(endpoint)
        .then(() => {
          this.updateCsv()
          this.isBusy = false
        })
    },
    updateCsv() {
      const columns = [
        'id',
        'internal',
        'annotationType',
        'annotationUser',
        'startDate',
        'endDate',
        'createdAt',
        'updatedAt',
        'note',
        'clientName',
        'locationNames'
      ]
      this.unparse(this.$refs.notesTable.filteredItems, columns)
    },
    onDrop(row) {},
    onToggle(row) {
      row.toggleDetails()
    },
    onSubmit(payload) {
      this.$emit('submitting', payload)
      this.onUpdate(payload)
    },
    onUpdate(evt) {
      const userEmail = evt.userEmail ? `email=${evt.userEmail}&` : ''
      const clientUrn = evt.clientUrn ? `clientUrn=${evt.clientUrn}&` : ''
      const locationUrns = (evt.locationUrns.length > 0)
        ? `locationUrns=${evt.locationUrns}&`
        : ''
      const searchBy = `searchBy=${evt.searchBy}&`
      const fromDate = evt.from ? `from=${evt.from}&` : ''
      const toDate = evt.to ? `to=${evt.to}&` : ''
      const category = evt.annotationName ? `annotationName=${evt.annotationName}&` : ''
      const internal = evt.isInternal !== null ? `internal=${evt.isInternal}&` : ''
      const type = evt.annotationType ? `annotationType=${evt.annotationType}` : ''
      const endpoint = `api/v1/notes?${userEmail}${category}${clientUrn}${locationUrns}${searchBy}${fromDate}${toDate}${internal}${type}`
      this.isBusy = true
      this.$axios
        .$get(endpoint)
        .then((res) => {
          if (res.length > 0) {
            this.totalRows = res.length
            this.notes = res
          } else {
            this.totalRows = 0
            this.notes = []
          }
        })
        .catch(() => {
          this.isError = true
        })
        .finally(() => {
          this.isBusy = false
          this.updateCsv()
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
  transform: translate(-50%, -50%) scale(0.65);
  &:hover {
    cursor: pointer;
  }
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
.inset-label {
  position: relative;
}
.inset-label > svg {
  position: absolute;
  pointer-events: none;
  z-index: 1;
  transform: translate(100%, 0%) scale(0.8);
}
.inset-padding {
  padding: 0 2em;
  border-radius: 5px !important;
  transition: 200ms ease-in-out;
  background-color: #e8e8e8;
  &:focus {
    padding: 0 1em;
    border-color: #e8e8e8;
    background-color: white;
    box-shadow: 0 0 0.2em 0.2em rgba(11, 35, 63, 0.25);
  }
}
.inset-btn {
  z-index: 10;
  position: absolute;
  right: 0;
  transform: translateX(-0%);
  & svg {
    vertical-align: -0.25em !important;
  }
}
.hover-anchor {
  position: relative;
  background-color: inherit;
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
.scale-in-ver-top-enter-active,
.scale-in-ver-top-leave-active {
  transition: 300ms cubic-bezier(0.250, 0.460, 0.550, 0.740);
}
.scale-in-ver-top-enter,
.scale-in-ver-top-leave {
  transform: translateZ(160px) translateY(-100px);
}
.scale-in-ver-top-leave-to {
  transform: translateZ(0) translateY(0);
}
</style>
