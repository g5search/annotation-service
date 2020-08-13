<template>
  <b-container fluid class="px-2 py-1 my-1">
    <b-row no-gutters>
      <b-col>
        <b-card
          no-body
          class="border-0 p-2 note alert-anchor"
          header-class="p-0 border-0"
          footer-class="p-0 border-0"
          footer-bg-variant="white"
        >
          <!-- <tri-checkbox :current="mode" /> -->
          <b-form-group
            label-class="pt-1 pb-0 text-primary-1 d-flex w-100 align-items-center justify-content-start"
            class="mb-1 mt-0"
          >
            <template v-slot:label>
              <b-icon-briefcase />
              <span class="ml-2 flex-grow-1">
                Client
                <span class="smaller text-tertiary">
                  *
                </span>
              </span>
            </template>
            <vue-multiselect
              v-model="client"
              :options="clients"
              placeholder="Search"
              track-by="urn"
              label="name"
              @input="onClientSelect"
            />
          </b-form-group>
          <b-form-group
            v-show="clientLocations"
            label-class="pb-0 pt-1 text-primary-1"
            class="my-1"
          >
            <template v-slot:label>
              <b-icon-building />
              Location
            </template>
            <vue-multiselect
              v-model="locations"
              :options="clientLocations"
              :multiple="true"
              :close-on-select="false"
              :clear-on-select="true"
              :custom-label="l => `${l.displayName ? l.displayName : l.name}`"
              placeholder="Search"
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
          <b-card no-body class="my-2 py-3 pl-4 pr-2">
            <b-form-group
              label-cols="4"
              label-class="text-primary-1 py-1"
              class="my-1"
            >
              <template v-slot:label>
                <b-icon-collection />
                Category
                <span class="smaller text-tertiary">
                  *
                </span>
              </template>
              <b-form-select
                v-model="category"
                :options="categories"
              />
            </b-form-group>
            <b-form-group
              label-cols="4"
              label-class="text-primary-1 py-1"
              class="my-1"
            >
              <template v-slot:label>
                <b-icon-puzzle />
                Action Type
              </template>
              <b-form-select
                v-model="actionType"
                :options="actionTypes[category]"
                required
                @change="toggleDates"
              />
            </b-form-group>
            <div v-show="showDates">
              <b-form-group
                label-cols="4"
                label-class="text-primary-1"
                class="my-1"
              >
                <template v-slot:label>
                  <b-icon-calendar-date />
                  Start Date
                </template>
                <b-form-datepicker
                  v-model="startDate"
                  reset-button
                  reset-button-variant="outline-secondary"
                />
              </b-form-group>
              <b-form-group
                label-cols="4"
                label-class="text-primary-1"
              >
                <template v-slot:label>
                  <b-icon-calendar-date />
                  End Date
                </template>
                <b-form-datepicker
                  v-model="endDate"
                  reset-button
                  reset-button-variant="outline-secondary"
                />
              </b-form-group>
            </div>
          </b-card>
          <b-card
            :bg-variant="isInternal ? 'quaternary-0' : 'white'"
            no-body
            class="border-0 p-2 mb-2"
          >
            <b-form-group
              label-class="d-flex w-100 align-items-center justify-content-between"
              class="my-1 text-primary-1"
            >
              <template v-slot:label>
                <span>
                  <b-icon-file-richtext />
                  Note
                </span>
                <b-form-checkbox
                  v-model="isInternal"
                  switch
                  size="sm"
                  class="align-self-center pr-2"
                >
                  <b-icon-eye-fill v-if="!isInternal" />
                  <b-icon-eye-slash v-else />
                  {{ isInternal ? 'Internal-Only' : 'Ok to Share' }}
                </b-form-checkbox>
              </template>
              <div class="editor">
                <editor-menu-bar
                  v-slot="{ commands, isActive }"
                  :editor="editor"
                >
                  <div class="d-flex justify-content-start menubar">
                    <b-btn
                      :class="[{ 'is-active': isActive.bold() }, 'menubar__btn']"
                      variant="outline-primary-1"
                      @click="commands.bold"
                    >
                      <b-icon-type-bold />
                    </b-btn>
                    <b-btn
                      :class="[{ 'is-active': isActive.italic() }, 'menubar__btn']"
                      variant="outline-primary-1"
                      @click="commands.italic"
                    >
                      <b-icon-type-italic />
                    </b-btn>
                    <b-btn
                      :class="[{ 'is-active': isActive.underline() }, 'menubar__btn']"
                      variant="outline-primary-1"
                      @click="commands.underline"
                    >
                      <b-icon-type-underline />
                    </b-btn>
                    <b-btn
                      :class="[{ 'is-active': isActive.strike() }, 'menubar__btn']"
                      variant="outline-primary-1"
                      @click="commands.strike"
                    >
                      <b-icon-type-strikethrough />
                    </b-btn>
                    <b-btn
                      :class="[{ 'is-active': isActive.ordered_list() }, 'menubar__btn']"
                      variant="outline-primary-1"
                      @click="commands.ordered_list"
                    >
                      <b-icon-list-ol />
                    </b-btn>
                    <b-btn
                      :class="[{ 'is-active': isActive.bullet_list() }, 'menubar__btn']"
                      variant="outline-primary-1"
                      @click="commands.bullet_list"
                    >
                      <b-icon-list-ul />
                    </b-btn>
                    <div class="menubar__spacer bg-primary-1" />
                  </div>
                </editor-menu-bar>
                <editor-content :editor="editor" class="editor__content" />
              </div>
            </b-form-group>
            <div v-if="!isInternal" class="px-2">
              <b-form-checkbox
                id="toggle-promoted"
                v-model="promoted"
                :class="promoted ? 'text-success' : 'text-primary'"
                switch
                size="sm"
              >
                <b-icon-star-fill v-if="promoted" />
                <b-icon-star v-else />
                {{ promoted ? 'Promoted!' : 'Promote' }}
              </b-form-checkbox>
            </div>
          </b-card>
          <b-card no-body class="mb-1 p-2">
            <b-form-checkbox
              v-model="backdate"
              switch
              size="sm"
              class="text-muted"
            >
              <b-icon-calendar-fill />
              Manual Note Date
            </b-form-checkbox>
            <div v-show="backdate" class="px-2">
              <b-form-group
                label-cols="4"
                label-class="text-primary-1"
                class="my-3"
              >
                <template v-slot:label>
                  <b-icon-calendar-date />
                  Note Date
                </template>
                <b-form-datepicker
                  v-model="noteDate"
                  reset-button
                  reset-button-variant="outline-secondary"
                />
              </b-form-group>
            </div>
          </b-card>
          <template v-slot:footer>
            <b-btn-group class="w-100 d-flex mt-3">
              <b-btn
                :disabled="!isValid"
                :variant="isValid ? 'primary-1' : 'outline-primary-1'"
                class="h1 flex-grow-1 btn-rad"
                @click="onSubmit"
              >
                <b-spinner v-if="isBusy" small style="vertical-align: -0.15em;" />
                <b-icon-bookmark-plus v-else style="vertical-align: -0.15em;" />
                Save Note
              </b-btn>
              <b-btn
                id="reset"
                variant="tertiary-2"
                class="h1 btn-rad flex-grow-0"
                @click="onReset"
              >
                <b-icon-trash style="vertical-align: -0.15em;" />
              </b-btn>
            </b-btn-group>
          </template>
          <alert :specs="specs" />
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState } from 'vuex'
import VueMultiselect from 'vue-multiselect'
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
  OrderedList,
  BulletList,
  ListItem,
  Bold,
  Italic,
  Link,
  Strike,
  Underline,
  Placeholder
} from 'tiptap-extensions'
import AlertMixin from '~/mixins/alert-mixin'
import Alert from '~/components/alert'
// import TriCheckbox from '~/components/tri-check'
export default {
  components: {
    VueMultiselect,
    EditorContent,
    // TriCheckbox,
    EditorMenuBar,
    Alert
  },
  mixins: [AlertMixin],
  data() {
    return {
      editor: null,
      isError: false,
      showLocation: false,
      showDates: false,
      backdate: false,
      theme: 'primary-1',
      mode: 0,
      client: null,
      clientLocations: [],
      detectedClient: false,
      isBusy: false,
      noteDate: new Date(),
      startDate: null,
      endDate: null,
      locations: [],
      isInternal: true,
      promoted: false,
      annotation: {
        html: '',
        json: ''
      },
      category: null,
      actionType: null,
      specs: {
        id: 'submission-status',
        width: 'w-100',
        dismissCountDown: 'dismissCountDown',
        alertVariant: 'alertVariant',
        alertMsg: 'alertMsg',
        dismissSecs: 'dismissSecs'
      }
    }
  },
  computed: {
    ...mapState({
      alertProps: state => state.alert,
      clients: state => state.controls.clients,
      categories: state => state.controls.categories,
      actionTypes: state => state.controls.actionTypes
    }),
    isValid() {
      return this.category !== null && this.client !== null
    }
  },
  mounted() {
    this.editor = new Editor({
      extensions: [
        new OrderedList(),
        new BulletList(),
        new ListItem(),
        new Bold(),
        new Italic(),
        new Link(),
        new Strike(),
        new Underline(),
        new Placeholder({
          emptyEditorClass: 'is-editor-empty',
          emptyNodeClass: 'is-empty',
          emptyNodeText: 'Write something …',
          showOnlyWhenEditable: true
        })
      ],
      content: this.annotation.html,
      onUpdate: ({ getHTML, getJSON }) => {
        this.updateText({ html: getHTML(), json: getJSON() })
      }
    })
  },
  beforeDestroy() {
    this.editor.destroy()
  },
  methods: {
    toggleDates(evt) {
      const matches = [
        'Specials/Promotions',
        'Testing',
        'Uncontrollable Circumstance',
        'DA WoW',
        'Other',
        'Dynamic Pricing',
        'Dynamic Availability'
      ]
      this.showDates = matches.includes(evt)
    },
    updateText(data) {
      this.annotation = data
    },
    onReset() {
      this.client = null
      this.isBusy = false
      this.locations = []
      this.isInternal = true
      this.promoted = false
      this.showDates = false
      this.category = null
      this.actionType = null
      this.autoDetect = false
      this.startDate = null
      this.endDate = null
      this.backdate = false
      this.createdAt = null
      this.editor.clearContent()
    },
    onError() {
      this.isError = true
      this.showAlert('Network Error: Please try again', 'danger')
    },
    onSubmit() {
      const endpoint = 'api/v1/note'
      this.isBusy = true
      this.$axios
        .$post(endpoint, {
          annotation: this.annotation.json,
          internal: this.isInternal,
          promoted: this.promoted,
          startDate: this.startDate,
          endDate: this.endDate,
          html: this.annotation.html,
          createdAt: this.noteDate,
          category: this.category,
          actionType: this.actionType,
          clientUrn: this.client.urn,
          locationUrns: this.locations.map(l => l.urn)
        })
        .then(() => this.showAlert('Note Saved!', 'success'))
        .then(() => this.$ga.event('Note Saved', 'Submit', 'New Note', 0))
        .catch(err => this.onError(err))
        .finally(() => this.onReset())
    },
    onClientSelect(evt) {
      this.$axios
        .$get(`api/hub/clients/${evt.urn}/locations`)
        .then((res) => {
          this.clientLocations = res
        })
        .catch(err => this.onError(err))
    }
  }
}
</script>

<style lang="scss" scoped>

.alert-anchor {
  position: relative;
  & #submission-status {
    position: absolute;
    top: 0%;
    left: 50%;
    transform: translate(-50%, -100%);
    border-radius: 5px;
  }
}
.editor {
  &__content {
    font-size: 0.9em;
    padding: 0.5em 0.5em 0.25em;
    border: 1px solid #0b233f;
    border-top: none;
    color: #0b233f;
    & .is-editor-empty:first-child::before {
      content: attr(data-empty-text);
      float: left;
      color: #aaa;
      pointer-events: none;
      height: 0;
      font-style: italic;
    }
  }
  & .menubar {
    transition: 200ms ease-out;
    display: flex;
    &__spacer {
      flex: 1 1 auto;
    }
    &__btn {
      padding: 0 0.25em 0.25em;
      margin: 0;
      border-radius: 0;
      &.is-active {
        background-color: #0b233f;
        color: white;
      }
    }
  }
}
// .close-container {
//   position: relative;
//   & .close-tab {
//     position: absolute;
//     right: 0;
//     border-radius: 50%;
//     padding: 0 0.05em;
//     transform: translate(75%, -275%);
//     transition: all 200ms ease;
//     opacity: 0;
//     transition-delay: 100ms;;
//   }
//   &:hover .close-tab {
//     transform: translate(75%, -75%);
//     opacity: 1;
//   }
// }
// .add-btn {
//   position: relative;
//   border: none;
//   margin-left: 0.15em;
//   padding: 0;
//   transition: 200ms ease-in-out;
//   &:hover,
//   &:active {
//     background-color: #dee2e6;
//     border: none;
//     outline: none;
//     & .nav-link::after {
//       position: absolute;
//       left: 50%;
//       transform: translate(-50%, -50%);
//       height: 100%;
//       content: "add";
//     }
//   }
//   & .nav-link {
//     padding-left: 0.25em;
//     padding-right: 0.25em;
//   }
// }
</style>
