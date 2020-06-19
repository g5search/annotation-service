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
          <b-form-group
            label-class="pt-1 pb-0 text-secondary d-flex w-100 align-items-center justify-content-start"
            class="mb-1 mt-0"
          >
            <template v-slot:label>
              <b-icon-briefcase />
              <span class="ml-2 flex-grow-1">
                Client
                <span class="smaller roman text-tertiary">
                  *
                </span>
              </span>
            </template>
            <vue-multiselect
              v-model="client"
              :options="clients"
              @input="onClientSelect"
              placeholder="Search"
              track-by="urn"
              label="name"
            />
          </b-form-group>
          <b-form-group
            v-show="clientLocations"
            label-class="pb-0 pt-1 text-secondary"
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
              :clear-on-select="false"
              placeholder="Search"
              track-by="urn"
              label="name"
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
          <b-card no-body class="my-2 py-1 px-2">
            <b-form-group
              label-cols="4"
              label-class="text-secondary py-1"
              class="my-1"
            >
              <template v-slot:label>
                <b-icon-collection />
                Category
                <span class="smaller roman text-tertiary">
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
              label-class="text-secondary py-1"
              class="my-1"
            >
              <template v-slot:label>
                <b-icon-puzzle />
                Action Type
              </template>
              <b-form-select
                v-model="actionType"
                :options="actionTypes[category]"
                @change="toggleDates"
                required
              />
            </b-form-group>
            <div v-show="showDates">
              <b-form-group
                label-cols="3"
                label-class="text-secondary"
                class="mb-0 mt-1"
              >
                <template v-slot:label>
                  Start Date
                </template>
                <b-form-datepicker
                  v-model="startDate"
                  size="sm"
                />
              </b-form-group>
              <b-form-group
                label-cols="3"
                label-class="text-secondary"
                class="my-0"
              >
                <template v-slot:label>
                  End Date
                </template>
                <b-form-datepicker
                  v-model="endDate"
                  reset-button
                  reset-button-variant="outline-secondary"
                  size="sm"
                />
              </b-form-group>
            </div>
          </b-card>
          <b-card
            :bg-variant="isInternal ? 'quaternary-lt4' : 'white'"
            no-body
            class="border-0 p-2 mb-2"
          >
            <b-form-group
              label-class="d-flex w-100 align-items-center justify-content-between"
              class="my-1 text-secondary"
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
                  :editor="editor"
                  v-slot="{ commands, isActive }"
                >
                  <div class="d-flex justify-content-start menubar">
                    <b-btn
                      :class="[{ 'is-active': isActive.bold() }, 'menubar__btn']"
                      @click="commands.bold"
                      variant="outline-secondary"
                    >
                      <b-icon-type-bold />
                    </b-btn>
                    <b-btn
                      :class="[{ 'is-active': isActive.italic() }, 'menubar__btn']"
                      @click="commands.italic"
                      variant="outline-secondary"
                    >
                      <b-icon-type-italic />
                    </b-btn>
                    <b-btn
                      :class="[{ 'is-active': isActive.underline() }, 'menubar__btn']"
                      @click="commands.underline"
                      variant="outline-secondary"
                    >
                      <b-icon-type-underline />
                    </b-btn>
                    <b-btn
                      :class="[{ 'is-active': isActive.strike() }, 'menubar__btn']"
                      @click="commands.strike"
                      variant="outline-secondary"
                    >
                      <b-icon-type-strikethrough />
                    </b-btn>
                    <b-btn
                      :class="[{ 'is-active': isActive.ordered_list() }, 'menubar__btn']"
                      @click="commands.ordered_list"
                      variant="outline-secondary"
                    >
                      <b-icon-list-ol />
                    </b-btn>
                    <b-btn
                      :class="[{ 'is-active': isActive.bullet_list() }, 'menubar__btn']"
                      @click="commands.bullet_list"
                      variant="outline-secondary"
                    >
                      <b-icon-list-ul />
                    </b-btn>
                    <div class="menubar__spacer bg-secondary" />
                  </div>
                </editor-menu-bar>
                <editor-content :editor="editor" class="editor__content" />
              </div>
            </b-form-group>
          </b-card>
          <b-card no-body class="mb-1 p-1">
           <b-form-checkbox
              v-model="backdate"
              switch
              size="sm"
              class="text-secondary"
            >
              <b-icon-calendar />
              Manual Note Date
            </b-form-checkbox>
            <div v-show="backdate">
              <b-form-group
                label-cols="3"
                label-class="text-secondary"
                class="my-0"
              >
                <template v-slot:label>
                  Note Date
                </template>
                <b-form-datepicker
                  v-model="noteDate"
                  reset-button
                  reset-button-variant="outline-secondary"
                  size="sm"
                />
              </b-form-group>
            </div>
          </b-card>
          <template v-slot:footer>
            <b-btn-group class="w-100 d-flex">
              <b-btn
                @click="onSubmit"
                :disabled="!isValid"
                :variant="isValid ? 'secondary' : 'outline-secondary'"
                class="roman flex-grow-1 btn-rad"
              >
                <b-icon-bookmark-plus />
                Save Note
              </b-btn>
              <b-btn
                id="reset"
                @click="onReset"
                variant="outline-tertiary"
                class="ml-1 btn-rad px-2 roman flex-grow-0"
              >
                <b-icon-trash />
              </b-btn>
            </b-btn-group>
          </template>
          <b-alert
            :show="dismissCountDown"
            @dismissed="dismissCountDown = 0"
            @dismiss-count-down="countDownChanged"
            id="submission-status"
            variant="success"
            dismissible
          >
            <b-icon-check-circle />
            Note Saved!
          </b-alert>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
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
export default {
  components: {
    VueMultiselect,
    EditorContent,
    EditorMenuBar
  },
  data () {
    return {
      editor: null,
      showLocation: false,
      showDates: false,
      backdate: false,
      theme: 'secondary',
      client: null,
      clients: [],
      clientLocations: [],
      detectedClient: false,
      isBusy: false,
      noteDate: new Date(),
      startDate: null,
      endDate: null,
      locations: [],
      isInternal: true,
      annotation: {
        html: '',
        json: ''
      },
      macros: [
        {
          text: 'Location DA Start',
          data: {
            category: 'Account Changes',
            actionType: 'Location DA Start',
            isInternal: false
          }
        },
        {
          text: 'Location DA End',
          data: {
            category: 'Account Changes',
            actionType: 'Location DA End',
            isInternal: false
          }
        }
      ],
      category: null,
      categories: [
        { text: 'Select option', value: null },
        { text: 'Account Changes', value: 'Account Changes' },
        { text: 'Customer Contact', value: 'Customer Contact' },
        { text: 'General Note', value: 'General Note' },
        { text: 'Optimizations', value: 'Optimizations' },
        { text: 'Other', value: 'Other' },
        { text: 'Technical Issue', value: 'Technical Issue' }
      ],
      actionType: null,
      actionTypes: {
        null: [
          { text: 'Select a category first' }
        ],
        'Account Changes': [
          { text: 'Select Option', value: null },
          'Smart Bidding Strategy Change',
          'Specials/Promotions',
          'Spend Optimizer Version Change',
          'URL Change',
          'Whitelisting Events Change'
        ],
        'General Note': [
          { text: '-', value: 'none' }
        ],
        'Customer Contact': [
          { text: 'Select Option', value: null },
          'Action Items',
          'Analysis/Notes'
        ],
        Optimizations: [
          { text: 'Select Option', value: null },
          'Added Negative Keywords',
          'Added Keywords',
          'Changed Location Strategy',
          'Paused Campaign',
          'Enabled Campaign',
          'Refreshed Ad Copy',
          'Testing',
          'T & O Added',
          'Manual Spend Adjustments',
          'Manual Bid Adjustments'
        ],
        Other: [
          { text: 'Select Option', value: null },
          'Uncontrollable Circumstances'
        ],
        'Technical Issue': [
          { text: 'Select Option', value: null },
          'DA WoW',
          'Dynamic Pricing',
          'Dynamic Availability',
          'Reporting Issue'
        ],
        'Implementation Dates': [
          { text: 'Select Option', value: null },
          'Dynamic Pricing Start',
          'Dynamic Pricing End',
          'Dynamic Availability Start',
          'Dynamic Availability End',
          'Spend Optimizer Start',
          'Spend Optimizer End',
          'Call Scoring Start',
          'Call Scoring End',
          'First Impressions',
          'First Spend'
        ]
      },
      dismissSecs: 2,
      dismissCountDown: 0
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
  computed: {
    isValid() {
      return this.category !== null && this.client !== null
    }
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
    onReset() {
      this.client = null
      this.locations = []
      this.isInternal = true
      this.showAlert = true
      this.category = null
      this.actionType = null
      this.autoDetect = false
      this.editor.clearContent()
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs
    },
    onSubmit() {},
    onClientSelect() {
    }
  }
}
</script>

<style lang="scss" scoped>
.alert-anchor {
  position: relative;
  & #submission-status {
    position: absolute;
    width: 75%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 5px;
    box-shadow: 0px 5px 15px rgba(12, 35, 63, 0.2),
                0px 10px 20px rgba(12, 35, 63, 0.2);
  }
}
.editor {
  &__content {
    font-size: 0.9em;
    padding: 0.5em 0.5em 0.25em;
    border: 1px solid #7898ad;
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
      padding: 0.15em 0.25em;
      margin: 0;
      &.is-active {
        background-color: #7898ad;
        color: white;
      }
    }
  }
}
.note {
  &__content {
    font-size: 0.9em;
  }
  & .menubar {
    box-shadow: 0 2px 10px rgba(120, 152, 173, 0.2);
    transition: 200ms ease-out;
    display: flex;
    &:hover {
      box-shadow: 0 2px 15px rgba(120, 152, 173, 0.2);
    }
    &__spacer {
      flex: 1 1 auto;
    }
    &__btn {
      position: relative;
      padding: 0.15em 0.25em;
      margin: 0;
      & .is-active {
        background-color: #0b233f;
        color: white;
      }
      &:hover {
        &.draft-btn::after {
          content: 'save';
          position: absolute;
          color: #0b233f;
          left: 50%;
          transform: translate(-50%, -80%);
          height: 100%;
        }
      }
    }
  }
}
.close-container {
  position: relative;
  & .close-tab {
    position: absolute;
    right: 0;
    border-radius: 50%;
    padding: 0 0.05em;
    transform: translate(75%, -275%);
    transition: all 200ms ease;
    opacity: 0;
    transition-delay: 100ms;;
  }
  &:hover .close-tab {
    transform: translate(75%, -75%);
    opacity: 1;
  }
}
.add-btn {
  position: relative;
  border: none;
  margin-left: 0.15em;
  padding: 0;
  transition: 200ms ease-in-out;
  &:hover,
  &:active {
    background-color: #dee2e6;
    border: none;
    outline: none;
    & .nav-link::after {
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      height: 100%;
      content: "add";
    }
  }
  & .nav-link {
    padding-left: 0.25em;
    padding-right: 0.25em;
  }
}
</style>