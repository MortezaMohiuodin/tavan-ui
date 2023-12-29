<template>
  <v-menu
    :close-on-content-click="false"
    location="end"
    :width="330"
    :min-height="100"
    @update:model-value="value => visible = value"
  >
    <template #activator="{ props }">
      <v-icon
        v-bind="props"
        icon="custom:history"
        size="12"
        class="tw-cursor-pointer"
      />
    </template>
    <div class="tw-px-2">
      <div
        v-for="(history, index) in histories"
        :key="index"
        class="tw-py-2 tw-border-b last:tw-border-0"
      >
        <div
          class="tw-text-sm tw-mb-2"
          :class="history.color"
        >
          <v-icon
            icon="custom:history"
            size="12"
            class="tw-ml-2"
            :class="history.color"
          />
          <span
            class="tw-pl-2 tw-border-l tw-ml-2"
            :class="history.color"
          >
            {{ `تاریخ: ${history.modifiedDate}` }}
          </span>
          <span>{{ `ساعت: ${history.modifiedTime}` }}</span>
        </div>
        <p class="tw-text-sm">
          {{ `ثبت زمان ${history.time} با نوع ${history.type} با وضعیت` }}
          <span
            class="tw-mx-px"
            :class="history.color"
          >
            {{ history.status }}
          </span>
          {{ `توسط ${history.fullName}` }}
        </p>
      </div>
    </div>
    <v-overlay
      v-model="loading"
      contained
      class="align-center justify-center"
    >
      <v-progress-circular
        color="primary"
        indeterminate
        size="35"
      />
    </v-overlay>
  </v-menu>
</template>

<script setup>
import { ref, watch } from 'vue'

const propItems = defineProps({
  data: { type: Object, default: null },
})

const store = useAppStore()

let loading = ref(false)

let visible = ref(false)

let histories = ref([])

let statusColor = {
  'verified': 'tw-text-success tw-fill-success !tw-border-success',
  'edited': 'tw-text-secondary tw-fill-secondary tw-border-secondary',
  'deleted': 'tw-text-error tw-fill-error tw-border-error',
}

watch(visible, val => {
  if (val) getData()
})

async function getData() {
  try {
    loading.value = true

    const { Data: response } = await useHttpPost('/inputoutput/get-inputoutput-logs', {
      body: {
        WorkspaceCode: store.WID,
        Code: propItems.data?.Id,
        ActionType: 3,
      },
    })

    histories.value = response.map(item => {
      const time = $moment(item.Time).format('HH:mm')
      const type = $getEnum($enums.inputOutputType, 'key', item.InputOutputType, 'value')
      const status = $getEnum($enums.inputOutputStatus, 'key', item.TemporaryStatus, 'value')
      const fullName = `${item.ModifiedBy.Name} ${item.ModifiedBy.Family}`
      const color = statusColor[$getEnum($enums.inputOutputStatus, 'key', item.TemporaryStatus, 'text')]
      const modifiedDate = $moment(item.ModifiedAt).format('jYYYY/jMM/jDD')
      const modifiedTime = $moment(item.ModifiedAt).format('HH:mm')

      return { modifiedDate, modifiedTime, time, type, status, fullName, color }
    })
    loading.value = false
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

function update(val) {
  console.log(val)
}
</script>
