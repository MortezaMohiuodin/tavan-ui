<template>
  <div>
    <v-data-table-server
      :headers="headers"
      :items="desserts"
      :loading="loading"
      loading-text="در حال بارگزاری"
      style="border-radius: 20px;"
      class="tw-border tw-border-[#E9ECF6] tw-p-[10px]"
      :items-length="8"
    >
      <template #bottom />
      <template #[`item.actions`]>
        <trash-modal
          ref="trashDialog"
          title="حذف عنوان"
          message="این عنوان حذف شود"
          @ok="x('ok')"
          @cancel="x('cancel')"
        />
        <v-b-table
          color="error"
          size="30"
        >
          <v-icon
            icon="custom:trash"
            size="15"
          />
        </v-b-table>
        <v-b-table
          color="success"
          size="30"
        >
          <v-icon
            icon="mdi-pencil-outline"
            size="15"
          />
        </v-b-table>
      </template>
      <template #[`item.FromDate`]="{item}">
        {{ $moment(item.columns.FromDate).format('jYYYY/jM/jD') }}
      </template>
      <template #[`item.ToDate`]="{item}">
        {{ $moment(item.columns.FromDate).format('jYYYY/jM/jD') }}
      </template>
    </v-data-table-server>
  </div>
  <pagination
    v-model="page"
    :length="10"
  />
</template>

<script setup>
import { VDataTableServer } from 'vuetify/labs/VDataTable'

let page = ref(2)
let loading = ref(false)

const desserts = [
  {
    name: 'Frozen Yogurt',
    calories: 159,
    fat: 6.0,
    carbs: 24,
    protein: 4.0,
    iron: '1',
    FromDate: '2023-02-14T00:00:00',
  },
  {
    name: 'Jelly bean',
    calories: 375,
    fat: 0.0,
    carbs: 94,
    protein: 0.0,
    iron: '0',
    FromDate: '2023-02-14T00:00:00',
  },
  {
    name: 'KitKat',
    calories: 518,
    fat: 26.0,
    carbs: 65,
    protein: 7,
    iron: '6',
    FromDate: '2023-02-14T00:00:00',
  },
  {
    name: 'Eclair',
    calories: 262,
    fat: 16.0,
    carbs: 23,
    protein: 6.0,
    iron: '7',
    FromDate: '2023-02-14T00:00:00',
  },
  {
    name: 'Gingerbread',
    calories: 356,
    fat: 16.0,
    carbs: 49,
    protein: 3.9,
    iron: '16',
    FromDate: '2023-02-14T00:00:00',
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
    fat: 9.0,
    carbs: 37,
    protein: 4.3,
    iron: '1',
    FromDate: '2023-02-14T00:00:00',
  },
  {
    name: 'Lollipop',
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 0,
    iron: '2',
    FromDate: '2023-02-14T00:00:00',

  },
  {
    name: 'Cupcake',
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    iron: '8',
    FromDate: '2023-02-14T00:00:00',

  },
  {
    name: 'Honeycomb',
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 6.5,
    iron: '45',
    FromDate: '2023-02-14T00:00:00',

  },
  {
    name: 'Donut',
    calories: 452,
    fat: 25.0,
    carbs: 51,
    protein: 4.9,
    iron: '22',
    FromDate: '2023-02-14T00:00:00',

  },
]

const headers = [
  {
    title: 'ردیف',
    align: 'center',
    sortable: false,
    key: 'name',
    removable: true,
  },
  {
    title: 'نام', key: 'calories', align: 'center', removable: true, sortable: false,
  },
  {
    title: 'تاریخ تولد', key: 'FromDate', align: 'center', removable: true, sortable: false,
  },
  {
    title: 'وضعیت تاهل', key: 'carbs', align: 'center', removable: true, sortable: false,
  },
  {
    title: 'استان', key: 'protein', align: 'center', removable: true, sortable: false,
  },
  {
    title: 'اهن', key: 'iron', align: 'center', removable: true, sortable: false,
  },
  {
    title: '', key: 'action', align: 'end', removable: true, sortable: false,
  },
]

function x(a) {
  console.log('item', a)
}
</script>
