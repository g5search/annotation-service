<template>
  <b-container fluid class="px-5">
    <div class="ceph-container">
      <octopus
        :size="`8.5em`"
        :color="`#334159`"
        class="ceph-container__svg shadowed"
      />
      <div class="ceph-container__title text-primary">
        <b-img-lazy
          src="/g5-logo.png"
        />
        <span class="text-white">
          Notes
        </span>
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
          </b-table>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Octopus from '~/components/icons/octopus'
export default {
  components: {
    Octopus
  },
  data() {
    return {
      strategist: null,
      strategists: []
    }
  },
  async asyncData({ $axios }) {
    const reject = [
      'annotation',
      'annotationCategoryId',
      'annotationTypeId',
      'external_id'
    ]
    const notes = await $axios.$get('/api/v1/notes')
    return {
      notes,
      fields: Object.keys(notes[0]).map(key => ({
        key,
        sortable: true
      })).filter(field => !reject.includes(field.key))
    }
  }
}
</script>

<style lang="scss" scoped>
.ceph-container {
  position: fixed;
  top: 0%;
  left: 0%;
  // width: 100%;
  // transform: translate(0%, 0%);
  z-index: 5;
  &__svg {
    position: absolute;
    top: 0%;
    left: 0%;
    transform: rotate(-45deg) translateX(-5%);
  }
  &__title {
    // position: absolute;
    top: 50%;
    left: 50%;
    // width: 5rem;
    transform: translate(25%, 50%);
    font-size: 1.5rem;
    padding: 0.05em 0.35em;
    border: 2.5px solid white;
    background-color: rgba(47, 56, 176, 1);
    border-radius: 20px;
    box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.5);
    // background-color: white;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
}
.shadowed {
  -webkit-filter: drop-shadow(0px 0px 20px rgba(0,0,0,1));
  filter: url('/drop-shadow.svg#drop-shadow');
  -ms-filter: "progid:DXImageTransform.Microsoft.Dropshadow(OffX=12, OffY=12, Color='#444')";
  filter: "progid:DXImageTransform.Microsoft.Dropshadow(OffX=12, OffY=12, Color='#444')";
}
</style>
