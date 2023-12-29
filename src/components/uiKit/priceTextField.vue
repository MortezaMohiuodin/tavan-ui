<template>
  <v-text-field
    placeholder="نام..."
    hint="نام خود را وارد کنید"
    v-bind="$attrs"
  >
    <template #append-inner>
      <v-menu>
        <template #activator="{ props }">
          <v-btn
            color="success"
            v-bind="props"
            variant="tonal"
            density="default"
            size="small"
            append-icon="fa-solid fa-chevron-down tw-text-[12px]"
          >
            <span class="tw-text-[12px]">
              {{ unitName }}
            </span>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in units"
            :key="index"
            :value="index"
            @click="changeUnit(item)"
          >
            <v-list-item-title>
              {{ item.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </v-text-field>
</template>

<script setup>
let useProps = defineProps({ unit: { type: Number, default: null } })
const emit = defineEmits(['update:unit'])
let units = [{ title: 'تومان', value: 1 }, { title: 'دلار', value: 2 }]
let unitName = ref('واحد')

const getUnitName = unitValue => {
  unitName.value = units.find(unit => unit.value === unitValue)?.title || 'واحد'
}

if (useProps.unit) getUnitName(useProps.unit)
function changeUnit(item) {
  unitName.value = item.title
  emit('update:unit', item.value)
}
watch(()=>useProps.unit, val=> getUnitName(val))
</script>

<style scoped>
.v-btn--size-small {
  @apply tw-px-[10px] tw-font-[400]
}
</style>
