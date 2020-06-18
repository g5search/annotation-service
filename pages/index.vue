<template>
  <b-container fluid class="px-0">
    <div class="ceph-container" @click="isOpen = !isOpen">
      <octopus
        :size="`6em`"
        :color="`#334159`"
        :class="[{ 'is-open': isOpen }, 'ceph-container__svg']"
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
            <b-btn @click="onSubmit">
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
        header-class="d-flex m-0 p-0 justify-content-between align-items-center"
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
          header-class="d-flex"
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
            <b-input-group class="mx-2">
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
              class="my-0 mr-2"
            />
            <b-btn
              variant="primary"
            >
              <b-icon-download />
            </b-btn>
            <b-btn
              variant="primary"
              @click="isOpen = !isOpen"
            >
              <b-icon-caret-right />
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
            bordered
          >
            <template v-slot:cell(internal)="row">
              <div class="hover-anchor">
                <b-icon-emoji-neutral font-scale="2" v-if="row.item.internal" />
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
                {{ row.item.startDate }} - {{ row.item.endDate }}
              </b-form-text>
            </template>
            <template v-slot:cell(html)="row">
              <read-only :content="row.item.html" />
            </template>
            <template v-slot:cell(edit)>
              <b-btn
                variant="outline-primary"
              >
                <b-icon-pencil-square />
              </b-btn>
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
export default {
  components: {
    Octopus,
    NoteEditor,
    ReadOnly
  },
  async asyncData({ $axios }) {
    const reject = [
      'annotation',
      'annotationCategoryId',
      'annotationTypeId',
      'external_id',
      'startDate',
      'endDate'
    ]
    const notes = await $axios.$get('api/v1/notes')
    const strategists = await $axios.$get('api/v1/strategists')
    // const clients = await $$axios.$get('api/v1/clients')
    return {
      notes,
      totalRows: notes.length,
      strategists: strategists.map(s => ({
        text: `${s.first_name} ${s.last_name}`,
        value: s.email
      })),
      fields: [
        ...Object.keys(notes[0])
          .map(key => ({
            key,
            sortable: true,
            class: 'text-center align-middle'
          })).filter(field => !reject.includes(field.key)),
        { key: 'Edit', class: 'text-center align-middle' }
      ]
    }
  },
  data() {
    return {
      strategist: null,
      isOpen: true,
      isBusy: false,
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
    onSubmit(evt) {
      // const endpoint = `api/v1/notes?userEmail=${this.strategist.value}`
      this.isBusy = true
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
.hover-anchor {
  position: relative;
  background-color: inherit;
  transition: opacity 200ms ease-in-out;
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
    background-color: #f1eaea;
    & .hovered-icon {
      opacity: 1;
    }
  }
}
</style>
