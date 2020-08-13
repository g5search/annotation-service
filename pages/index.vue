<template>
  <b-container fluid class="px-0 alert-anchor">
    <!-- START GLOBAL ALERT -->
    <alert
      :specs="specs"
      class="m-2"
    />
    <!-- END GLOBAL ALERT -->
    <!-- START BRANDED ICON -->
    <div class="ceph-container" @click="isOpen = !isOpen">
      <octopus
        :size="`6em`"
        :color="`#0c233f`"
        :class="[{ 'is-open': isOpen }, 'ceph-container__svg', 'shadowed']"
      />
      <div class="ceph-container__title text-primary">
        <b-img-lazy
          src="/g5-logo.png"
        />
      </div>
    </div>
    <!-- END BRANDED ICON -->
    <!-- START SIDEBAR -->
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
    <!-- END SIDEBAR -->
    <!-- START MODAL -->
    <b-modal
      v-model="modal.isOpen"
      centered
      title="Deletes Are Forever"
      title-tag="h1"
      title-class="text-tertiary mb-0"
      header-class="border-0"
      footer-class="border-0"
    >
      <strong>
        Are you sure you want to send this note to the trash?
      </strong>
      <template v-slot:modal-footer="{ cancel }">
        <b-btn variant="tertiary" @click="onConfirmDrop(modal.data)">
          <b-spinner v-if="modal.isBusy" small />
          <b-icon v-else icon="trash" />
          Yes, destroy this note.
        </b-btn>
        <b-btn variant="outline-tertiary" @click="cancel()">
          No, I didn't mean it!
        </b-btn>
      </template>
    </b-modal>
    <!-- END MODAL -->
    <b-row no-gutters>
      <b-col>
        <b-card
          bg-variant="white"
          body-class="p-0"
          header-class="d-flex fixed-height"
          header-bg-variant="light"
        >
          <!-- START HEADER -->
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
                @focus="$ga.event('Search', 'Focus', 'Notes Header', 0)"
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
            <b-dropdown id="client-location-select" variant="transparent" right class="ml-2">
              <template v-slot:button-content>
                <b-iconstack>
                  <b-icon-circle stacked scale="1.2" />
                  <b-icon-building stacked scale="0.75" />
                </b-iconstack>
              </template>
              <b-tooltip
                target="client-location-select"
                triggers="hover"
                placement="bottom"
                variant="primary-1"
              >
                Filter Client and Locations
              </b-tooltip>
              <b-dropdown-form style="width: 400px;" class="p-0 mb-0">
                <client-location @on-submit="onSubmit" />
              </b-dropdown-form>
            </b-dropdown>
            <b-input-group class="ml-2 w-50">
              <template v-slot:prepend>
                <b-input-group-text id="show-rows-select" class="bg-white">
                  <b-iconstack>
                    <b-icon stacked icon="table" scale="0.5" />
                    <b-icon stacked icon="textarea" rotate="90" scale="1.15" variant="darker" />
                  </b-iconstack>
                </b-input-group-text>
              </template>
              <b-form-select
                v-model="perPage"
                :options="pageOptions"
                style="border-left: none;"
              />
            </b-input-group>
            <b-tooltip
              target="show-rows-select"
              triggers="hover"
              placement="bottom"
              variant="primary-1"
            >
              Number of rows to display per page.
            </b-tooltip>
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
              class="mr-2"
              @click="$ga.event('Download', 'Click', 'Note Header', 0)"
            >
              <b-iconstack>
                <b-icon
                  stacked
                  icon="file-earmark-spreadsheet"
                  scale="1.25"
                />
                <b-icon
                  stacked
                  icon="arrow-down-square-fill"
                  shift-h="8"
                  shift-v="8"
                  scale="0.75"
                />
              </b-iconstack>
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
              id="filter-me-btn"
              variant="transparent"
              class="ml-2 align-middle"
              @click="onFilterMe"
            >
              <b-icon-person-circle :variant="isFiltered ? 'success' : 'primary-1'" />
            </b-btn>
            <b-tooltip
              target="filter-me-btn"
              triggers="hover"
              placement="bottom"
              variant="primary-1"
            >
              Filter table to just my notes
            </b-tooltip>
            <b-btn
              variant="transparent"
              class="d-flex align-items-center"
              @click="isOpen = !isOpen"
            >
              <b-icon-layout-sidebar-inset-reverse />
            </b-btn>
          </template>
          <!-- END HEADER -->
          <b-table
            ref="notesTable"
            :fields="fields"
            :items="notes"
            :filter="search"
            :current-page="currentPage"
            :per-page="perPage"
            :busy="isBusy"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :filter-included-fields="['note','locationNames']"
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
              <error-slot slot-name="searchText" />
            </template>
            <template v-slot:empty>
              <error-slot slot-name="filteredText" />
            </template>
            <template v-slot:cell(internal)="row">
              <div class="hover-anchor">
                <b-icon-emoji-neutral v-if="row.item.internal" scale="2" />
                <b-iconstack v-else>
                  <b-icon-star-fill v-if="row.item.promoted" scale="3" variant="success" />
                  <b-icon-emoji-sunglasses scale="2"/>
                </b-iconstack>
                <div class="hovered-icon">
                  {{ row.item.internal ? 'Internal Only' : 'Customer-Facing' }}
                </div>
              </div>
            </template>
            <template v-slot:cell(annotationCategory)="row">
              <small class="text-muted">
                {{ row.item.annotationCategory.text }}
              </small>
            </template>
            <template v-slot:cell(annotationType)="row">
              <small class="text-muted">
                {{ row.item.annotationType }}
              </small>
              <b-badge v-if="row.item.startDate" variant="neutral" class="mb-1 px-2">
                Start: {{ row.item.startDate }}
              </b-badge>
              <b-badge v-if="row.item.endDate" variant="neutral" class="mb-1 px-2">
                End: {{ row.item.endDate }}
              </b-badge>
            </template>
            <template v-slot:cell(createdAt)="row">
              <b-badge variant="neutral">
                {{ formatDate(row.item.createdAt) }}
              </b-badge>
            </template>
            <template v-slot:cell(updatedAt)="row">
              <b-badge variant="neutral">
                {{ formatDate(row.item.updatedAt) }}
              </b-badge>
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
            <template v-slot:cell(clientName)="row">
              <b-badge variant="neutral" class="text-wrap">
                {{ row.item.clientName }}
              </b-badge>
            </template>
            <template v-slot:cell(edit)="row">
              <div class="d-flex align-items-center">
                <b-btn
                  :variant="row.detailsShowing ? 'primary' : 'transparent'"
                  class="align-middle edit-btn"
                  @click="onToggle(row)"
                >
                  <b-icon-pencil scale="1.2" />
                </b-btn>
                <b-btn
                  variant="transparent"
                  class="ml-2 align-middle drop-btn text-tertiary"
                  @click="onOpen(row.item.id)"
                >
                  <b-icon-trash scale="1.2" />
                </b-btn>
              </div>
            </template>
            <template v-slot:row-details="row">
              <transition name="slide-fade" appear>
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
import ClientLocation from '~/components/client-location'
import ErrorSlot from '~/components/errors-fallbacks'
import Alert from '~/components/alert'
import PapaMixin from '~/mixins/papaparse'
import RequestTable from '~/mixins/api'
import AlertMixin from '~/mixins/alert-mixin'
export default {
  components: {
    Octopus,
    Controls,
    FeedbackForm,
    ErrorSlot,
    InlineEditor,
    ClientLocation,
    NoteEditor,
    Alert
  },
  mixins: [PapaMixin, RequestTable, AlertMixin],
  async fetch({ store }) {
    await store.dispatch('controls/fillUsers')
    store.dispatch('controls/fillClients')
  },
  async asyncData({ $axios }) {
    const notes = await $axios.$get('api/v1/notes')
    const me = await $axios.$get('api/v1/me')
    return {
      me,
      notes,
      totalRows: notes.length
    }
  },
  data() {
    return {
      specs: {
        id: 'global-status',
        width: 'w-25',
        dismissCountDown: 'globalDismissCountDown',
        alertVariant: 'globalAlertVariant',
        alertMsg: 'globalAlertMsg',
        dismissSecs: 'globalDismissSecs'
      },
      version,
      isEmpty: 'Oh no! We couldn\'t find any notes that match your selected filters, please review and adjust them.',
      isOpen: false,
      isBusy: false,
      isError: false,
      isFiltered: false,
      modal: {
        isOpen: false,
        data: {},
        isBusy: false
      },
      sortBy: 'createdAt',
      sortDesc: true,
      currentPage: 1,
      perPage: 20,
      pageOptions: [20, 50, 100, 200],
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
          class: 'align-middle text-center tbl-w200'
        },
        {
          key: 'annotationUser',
          label: 'User',
          sortable: true,
          class: 'align-middle text-center tbl-w200'
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
          label: 'SF Synced',
          sortable: true,
          class: 'align-middle text-center'
        },
        {
          key: 'note',
          label: 'Note',
          sortable: true,
          class: 'align-middle tbl-w350'
        },
        {
          key: 'clientName',
          label: 'Client',
          sortable: true,
          class: 'align-middle tbl-w350 text-center'
        },
        {
          key: 'locationNames',
          label: 'Location Name(s)',
          sortable: true,
          class: 'align-middle tbl-w400'
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
    this.onFilterMe()
  },
  methods: {
    formatDate(date) {
      const d = new Date(date)
      let month = '' + (d.getMonth() + 1)
      let day = '' + d.getDate()
      const year = d.getFullYear()

      if (month.length < 2) {
        month = '0' + month
      }
      if (day.length < 2) {
        day = '0' + day
      }
      return [year, month, day].join('-')
    },
    rdm(min, max) {
      return Math.random() * (max - min) + min
    },
    onClear() {
      this.search = ''
    },
    onFilterMe() {
      this.isBusy = true
      const endpoint = !this.isFiltered ? `api/v1/notes?app=notesService&email=${this.me.email}` : 'api/v1/notes?app=notesService'
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
          this.isBusy = false
        })
        .catch(() => this.showGlobalAlert('Network Error: Please try again', 'danger'))
        .finally(() => {
          this.isFiltered = !this.isFiltered
          this.updateCsv()
        })
    },
    updateCsv() {
      const columns = [
        'id',
        'internal',
        'category',
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
      const flattened = this.$refs.notesTable.filteredItems.map((row) => {
        return {
          category: row.annotationCategory.text,
          ...row
        }
      })
      this.unparse(flattened, columns)
    },
    onOpen(row) {
      this.modal.data = row
      this.modal.isOpen = true
    },
    onConfirmDrop(id) {
      this.modal.isBusy = true
      this.$axios
        .$delete(`api/v1/notes/${id}`)
        .then(() => {
          this.modal.isOpen = false
        })
        .catch(() => {
          this.modal.isOpen = false
          this.showGlobalAlert('Error: Please try again', 'danger')
        })
        .finally(() => {
          this.modal.isBusy = false
          this.modal.data = {}
          this.onFilterMe()
        })
    },
    onToggle(row) {
      this.$ga.event('Edit', 'Click', row.id, 0)
      row.toggleDetails()
    },
    onSubmit(payload) {
      // this.$emit('submitting', payload)
      // for pre-update tasks that might need to be done.
      this.onUpdate(payload)
    },
    onUpdate(evt) {
      const endpoint = this.createQuery(evt)
      this.isBusy = true
      this.isFiltered = false
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
          if (evt.locationUrns) {
            this.sortBy = 'locationNames'
          } else {
            this.sortBy = 'createdAt'
          }
        })
        .catch(() => {
          this.showGlobalAlert('Error: Please try again', 'danger')
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

.alert-anchor {
  position: relative;
  & #global-status {
    position: absolute;
    top: 5%;
    left: 20%;
    transform: translate(-50%, -100%);
    border-radius: 5px;
    z-index: 5;
  }
}

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
#show-rows-select {
  border-width: 2px;
  border-color: #e8e8e8;
  border-right: none;
}
.edit-btn,
.drop-btn {
  position: relative;
  &::after {
    position: absolute;
    opacity: 0;
    left: 50%;
    transform: translate(-50%, -100%);
    font-size: 0.9em;
  }
  &:hover::after {
    opacity: 1;
  }
}
.edit-btn:hover::after {
  content: 'EDIT'
}
.drop-btn:hover::after {
  content: 'DELETE'
}
.fixed-height {
  max-height: 75px;
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
</style>
