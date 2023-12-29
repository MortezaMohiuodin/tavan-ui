<template>
  <form-section-iterator
    v-model="arrayValue"
    :schema="formSchema"
  />
</template>

<script setup>
const arrayValue = ref([])

const formSchema = ref([
  { model:'startFieldFrom', component : 'input', title : 'شروع دوره از' ,col : { cols: 4 }  },
  { model:'endFieldFrom', component : 'input', title : 'پایان دوره تا روز' ,col : { cols: 4 } },
  { model:'restInThisPeriod', component : 'checkbox' , title: 'در این دوره استراحت کند' ,col : { cols: 4 }  },

  // { model:'selectedShift', component : ShiftSelect , title: 'َشیفت مورد نظر' ,col : { cols: 4 } ,condition: val=>val.restInThisPeriod  },
  { model: 'replaceWithShift' , component : 'checkbox' , title : 'در روز تعطیل شیفت جایگزین تنظیم شود' ,col : { cols: 4 } , condition: val=>val.restInThisPeriod },

  // { model:'replacedShift', component : ShiftSelect , title: 'شیفت جایگزین' ,col : { cols: 4 } ,condition: val=>val.replaceWithShift  },
])
</script>

