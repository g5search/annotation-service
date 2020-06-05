<template>
  <b-container fluid class="px-5">
    <div class="ceph-container">
      <octopus
        :size="`7.25em`"
        :color="`#334159`"
        class="ceph-container__svg"
      />
      <div class="ceph-container__title text-primary">
        <b-img-lazy
          src="/g5-logo.png"
        />
      </div>
    </div>
    <b-row no-gutters>
      <b-col>
        <b-form-group>
          <b-form-select
            v-model="strategist"
            :options="strategists"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row no-gutters>
      <b-col>
        <b-card no-body bg-variant="white">
          <template v-slot:header>
            <b-input-group>
              <b-form-input />
            </b-input-group>
          </template>
          <b-table
            :fields="fields"
            :items="notes"
            responsive
          >
            <template v-slot:cell(internal)="row">
              <b-icon-check-circle v-if="row.item.internal === 'true'" />
              {{ row.item.internal }}
            </template>
            <template v-slot:cell(html)="row">
              <read-only :content="row.item.html" />
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
export default {
  components: {
    Octopus,
    ReadOnly
  },
  async asyncData({ $axios }) {
    const reject = [
      'annotation',
      'annotationCategoryId',
      'annotationTypeId',
      'external_id'
    ]
    // const notes = await $axios.$get('https://notes.g5marketingcloud.com/api/v1/notes')
    const notes = await $axios.$get('api/v1/notes')
    return {
      notes,
      fields: Object.keys(notes[0]).map(key => ({
        key,
        sortable: true
      })).filter(field => !reject.includes(field.key))
    }
  },
  data() {
    return {
      strategist: null,
      strategists: []
    }
  }
}
</script>

<style lang="scss" scoped>
.ceph-container {
  position: fixed;
  top: 0%;
  left: 0%;
  z-index: 5;
  &__svg {
    position: absolute;
    top: 0%;
    left: 0%;
    transform: rotate(-45deg) translateX(-5%);
  }
  &__title {
    top: 50%;
    left: 50%;
    transform: translate(25%, 50%);
    font-size: 1.5rem;
    padding: 0.05em 0.35em;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
}
</style>
