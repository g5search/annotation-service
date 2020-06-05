<template>
  <div>
    <editor-content :editor="editor" class="editor__content" />
  </div>
</template>

<script>
import { Editor, EditorContent } from 'tiptap'
export default {
  components: {
    EditorContent
  },
  props: {
    content: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      editor: null
    }
  },
  mounted() {
    this.editor = new Editor({
      content: this.content
    })
  },
  beforeDestroy() {
    this.editor.destroy()
  }
}
</script>

<style>

</style>
