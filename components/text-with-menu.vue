<template>
  <div class="editor">
    <editor-menu-bar
      v-slot="{ commands, isActive }"
      :editor="editor"
    >
      <div class="d-flex justify-content-start menubar">
        <b-btn
          :class="[{ 'is-active': isActive.bold() }, 'menubar__btn']"
          variant="outline-secondary"
          @click="commands.bold"
        >
          <b-icon-type-bold />
        </b-btn>
        <b-btn
          :class="[{ 'is-active': isActive.italic() }, 'menubar__btn']"
          variant="outline-secondary"
          @click="commands.italic"
        >
          <b-icon-type-italic />
        </b-btn>
        <b-btn
          :class="[{ 'is-active': isActive.underline() }, 'menubar__btn']"
          variant="outline-secondary"
          @click="commands.underline"
        >
          <b-icon-type-underline />
        </b-btn>
        <b-btn
          :class="[{ 'is-active': isActive.strike() }, 'menubar__btn']"
          variant="outline-secondary"
          @click="commands.strike"
        >
          <b-icon-type-strikethrough />
        </b-btn>
        <b-btn
          :class="[{ 'is-active': isActive.ordered_list() }, 'menubar__btn']"
          variant="outline-secondary"
          @click="commands.ordered_list"
        >
          <b-icon-list-ol />
        </b-btn>
        <b-btn
          :class="[{ 'is-active': isActive.bullet_list() }, 'menubar__btn']"
          variant="outline-secondary"
          @click="commands.bullet_list"
        >
          <b-icon-list-ul />
        </b-btn>
        <div class="menubar__spacer bg-secondary" />
      </div>
    </editor-menu-bar>
    <editor-content :editor="editor" class="editor__content" />
  </div>
</template>

<script>
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
    EditorContent,
    EditorMenuBar
  },
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      editor: null
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
      content: this.content,
      onUpdate: ({ getHTML, getJSON }) => {
        this.updateText({ html: getHTML(), json: getJSON() })
      }
    })
  },
  beforeDestroy() {
    this.editor.destroy()
  },
  methods: {
    updateText(evt) {
      this.$emit('on-update', evt)
    }
  }
}
</script>

<style lang="scss" scoped>
.editor {
  &__content {
    background-color: white;
    padding: 0.5em 0.5em 0.25em;
    border: 1px solid #e8e8e8;
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
      border-radius: 0;
      &.is-active {
        background-color: #e8e8e8;
        color: white;
      }
    }
  }
}
</style>
