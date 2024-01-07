<template>
  <div
    class="vDatatableServerCustom"
    :class="{ 'lastColumnFixed': !!actionSchema }"
  >
    <v-data-table-server
      v-bind="$attrs"
      id="tableWidthHeight"
      v-model="selected"
      :headers="showColumns"
      :items="items"
      :loading="loading && !isFirstLoading"
      items-length="10"
    >
      <template
        v-for="(itemColumn, index) in columns"
        #[itemColumn.slotColumnName]="{ column }"
        :key="index"
      >
        <template v-if="itemColumn.key === 'action'">
          <div class="tw-flex tw-justify-end">
            <v-btn-refresh
              v-tooltip="'بارگیری مجدد'"
              size="small"
              style="z-index: 10;"
              :class="[{ 'tw-animate-spin': loading }]"
              @click="reload"
            />
            <v-btn-setting
              v-tooltip="'تنظیمات جدول'"
              size="small"
              @click="showSettingDialog = true"
            />
          </div>
        </template>
        <template v-else>
          <div class="tw-text-sm">
            {{ column?.title }}
          </div>
        </template>
      </template>

      <template
        v-for="(column, index) in columns"
        #[column.slotName]="{ item }"
        :key="index"
      >
        <div v-if="column.type === 'date'">
          {{ $moment(item[column.key]).format('jYYYY-jMM-jDD') }}
        </div>
        <div v-else-if="column.type === 'boolean'">
          <v-icon
            :icon="item[column.key] ? 'fa fa-check' : 'fa fa-times'"
            :color="item[column.key] ? 'success' : 'error'"
            size="20"
          />
        </div>
        <div v-else>
          {{ item[column.key] }}
        </div>
      </template>

      <template
        v-for="(_, slot) of $slots"
        #[slot]="scope"
      >
        <slot
          :name="slot"
          v-bind="scope"
        />
      </template>
      <template
        v-if="actionSchema?.actions?.length"
        #[`item.action`]="allProps"
      >
        <div
          class="tw-flex tw-gap-1.5 tw-justify-end fixed tw-overflow-x-hidden"
          :style="{ width: actionSchema?.width ? actionSchema.width : actionSchema?.actions.length * (32 + 6) }"
        >
          <slot
            name="item.action"
            v-bind="allProps"
          />
          <template
            v-for="(action, index) in actionSchema?.actions"
            :key="index"
          >
            <v-btn-table
              v-if="(typeof action === 'object' && action.icon)"
              v-tooltip="action?.label || ''"
              v-bind="action"
              :disabled="!!action.disabledCondition ? action.disabledCondition(allProps.item?.raw) : false"
              @click="action?.emit(allProps.item?.raw)"
            />
            <v-btn-table-view
              v-if="(typeof action === 'string' && action === 'view')"
              v-tooltip="'مشاهده'"
              @click="emit('onView', allProps.item)"
            />
            <v-btn-table-edit
              v-if="(typeof action === 'string' && action === 'edit')"
              v-tooltip="'ویرایش'"
              @click="emit('onEdit', allProps.item)"
            />
            <v-btn-table-trash
              v-if="(typeof action === 'string' && action === 'delete')"
              v-tooltip="'حذف'"
              @click="emit('onDelete', allProps.item)"
            />
          </template>
        </div>
      </template>
      <template #bottom />
    </v-data-table-server>
    <pagination
      v-model="page"
      :length="totalPages"
    />
    <v-dialog-extend
      v-model="showSettingDialog"
      title="تنظیمات جدول"
      confirm-btn-text="اعمال"
      width="500"
      cancel-btn-text="انصراف"
      @on-cancel="showSettingDialog = false"
      @on-confirm="selectedColumns = setting.selectedColumns"
    >
      <div class="tw-my-4">
        <label class="fieldLabel">
          نمایش ستون ها
        </label>
        <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-mx-3 tw-bg-slate-100 tw-rounded-xl tw-py-3 tw-px-2">
          <v-checkbox
            v-for="column in columns"
            :key="column.key"
            v-model="setting.selectedColumns"
            :label="column.title"
            :value="column.key"
          />
        </div>
      </div>
    </v-dialog-extend>
  </div>
</template>

<script setup>
import avatarPlaceholder from '@/assets/images/profile/avatar-placeholder.png'
import useDatatableServer from '@/composables/useDatatableServer'

const props = defineProps({
  modelValue: { type: Array, default: () => ([]), required: false },
  columns: { type: Array, default: () => ([]), required: true },
  service: { type: [Function, Array], default: null, required: true },
})


const emit = defineEmits(['update:modelValue', 'onView', 'onEdit', 'onDelete'])
const selected = useVModel(props, 'modelValue', emit)
const slots = useSlots()


const setting = ref({
  selectedColumns: props.columns.map(val => val.key),
})

const showSettingDialog = ref(false)

const hasSlot = name => {
  return !!slots[name]
}


const selectedColumns = ref(props.columns.map(val => val.key))
const { page, loading, isFirstLoading, items, totalPages, reset, reload } = useDatatableServer(props.service)

const actionSchema = computed(() => {
  return props.columns.find(val => val.key === 'action')
})

const showColumns = computed(() => {
  return props.columns.filter(val => selectedColumns.value.includes(val.key))
})

const getValue = (column, item) => {
  console.log(item, 'test', column)
  let result
  const propValue = item[column.key]
  if (propValue?.value) {
    result = propValue?.value
  } else {
    result = propValue
  }

  return column.value ? column.value(item) : result
}

let widthTable = ref(null)
let heightTable = ref(null)

let setHeightWidth = function () {
  widthTable.value = document.getElementById('tableWidthHeight').offsetWidth
  heightTable.value = document.getElementById('tableWidthHeight').offsetHeight
}
watch(page, () => {
  setHeightWidth()
})

defineExpose({ reset, reload, loading, page })
</script>

<style lang="scss">
.vDataTableServerCustom {
  .v-data-table__thead {
    @apply tw-bg-[#F5F7FC]
  }

  .v-data-table-header__content {
    @apply tw-text-[#6F6F9D] tw-font-light tw-text-sm
  }

  .v-data-table__tbody {
    .v-data-table__tr {
      height: 60px;
    }
  }

  .v-data-table__thead tr th {
    &:last-child {
      padding-left: 5px !important;
    }
  }

  .lastColumnFixed {
    table>tbody>tr>td:last-child {
      background-color: white !important;
    }

    table>tbody>tr>td:last-child,
    table>thead>tr>th:last-child {
      position: sticky !important;
      position: -webkit-sticky !important;
      left: 0;
      z-index: 5;
    }

    table>thead>tr>th:last-child {
      z-index: 6;
      background-color: #f5f7fc !important;
    }
  }

  .v-data-table__th {
    border-bottom: none !important;
  }

  .v-data-table-progress th {
    background-color: white !important;
  }

  thead {
    @apply tw-bg-[#F9FAFB]
  }

  thead tr th:first-child {
    @apply tw-rounded-r-full
  }

  thead tr th:last-child {
    @apply tw-rounded-l-full tw-text-center
  }

  .v-data-table-headers__loader {
    @apply tw-right-[30px] tw-w-[calc(100%-60px)];
  }

  .vBtnTable .v-icon {
    transition: all .1s ease-in;
    font-size: 16px;
  }

  .v-data-table-progress__loader {
    @apply tw-mr-[30px] tw-w-[calc(100%-60px)];
  }
}
</style>
