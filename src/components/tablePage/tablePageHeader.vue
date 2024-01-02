<template>
  <h3
    v-if="hasSlot('right')"
    class="page-heading tw-my-3"
  >
    {{ title ? title : $route.meta.title }}
  </h3>
  <v-row class="tw-mb-1">
    <v-col>
      <template v-if="!hasSlot('right')">
        <h3 class="page-heading tw-my-3">
          {{ title ? title : $route.meta.title }}
        </h3>
      </template>
      <slot name="right" />
    </v-col>
    <v-col
      class="tw-text-left"
    >
      <v-btn-filter
        v-if="showFilterBtn"
        :variant="store.isTableFilterVisible ? 'tonal':'outlined'"
        @click="store.isTableFilterVisible = !store.isTableFilterVisible"
      >
        فیلتر
      </v-btn-filter>
      <v-btn-add
        v-if="showAddItemLink"
        class="tw-ms-3"
        v-bind="vBtnAddProps"
        :text="addItemText"
        @click="emit('onAdd')"
      />
      <slot />
    </v-col>
  </v-row>
</template>

<script setup>
const props = defineProps({
  // if page title is not passed , component will look for route.meta.title to display as title
  title : { type:String ,default :null , required:false },
  addPath : { type:String ,default :null , required:false },
  addModal : { type: Boolean ,default:false },
  showFilterBtn : { type : Boolean , default : true },
  showAddItemLink : { type : Boolean , default : true },
  addItemText : { type : String , default : 'افزودن آیتم جدید' },
})

const emit = defineEmits(['onAdd'])
const slots = useSlots()

const route = useRoute()

const hasSlot = name => {
  return !!slots[name]
}

const vBtnAddProps = computed(()=>{
  if(!props.addModal)
    return { to : props.addPath ? props.addPath : route.fullPath + '/add/new' }
  else {}
})

const store = useAppStore()
</script>
