<template>
  <div
    v-for="(item,i) in value"
    :key="i"
    class="tw-relative tw-bg-neutral-100 tw-p-1 !tw-rounded-xl tw-mb-4"
  >
    <v-menu-confirm
      v-if="!rowActionMode"
      color="error"
      prompt
      @on-confirm="remove(i)"
    >
      <template #activator="{props}">
        <v-btn-table-trash
          v-tooltip="'حذف'"
          class="tw-absolute tw-left-2 tw-top-2 "
          :loading="deleteLoading"
          v-bind="props"
        />
      </template>
    </v-menu-confirm>
    <!--    <v-btn-table -->
    <!--      v-if="!rowActionMode" -->
    <!--      v-tooltip="'حذف'" -->
    <!--      class="tw-absolute tw-left-2 tw-top-2 " -->
    <!--      icon="fas fa-times" -->
    <!--      color="k_white-800" -->
    <!--      @click="remove(i)" -->
    <!--    /> -->
    <div :class="{'tw-flex tw-items-center tw-gap-2' : rowActionMode}">
      <v-form-extend
        ref="formRef"
        v-model="value[i]"
        class="tw-flex-1"
        :schema="schema"
        :actions="false"
        :with-card="false"
        :disabled="!value[i].edit"
      />
      <div
        v-if="rowActionMode"
        class="tw-flex tw-gap-1 tw-justify-end"
      >
        <v-btn-table-save
          v-if="rowActionMode && (value[i].edit || value[i].AssignCode===undefined)"
          v-tooltip=" 'ثبت' "
          :loading="submitLoading && actionIndex === i"
          @click="onSubmitRow(value[i],i)"
        />
        <v-btn-table-edit
          v-if="rowActionMode && !value[i].edit && value[i].AssignCode!==undefined"
          v-tooltip="'ویرایش'"
          :loading="submitLoading && actionIndex === i"
          @click="value[i].edit=true"
        />
        <v-menu-confirm
          v-if="!value[i].edit && value[i].AssignCode!==undefined"
          :loading="deleteLoading"
          color="error"
          prompt
          @on-confirm="onDeleteRow(value[i],i)"
        >
          <template #activator="{props}">
            <v-btn-table-trash
              v-if="rowActionMode"
              v-tooltip="'حذف'"
              :loading="deleteLoading"
              v-bind="props"
            />
          </template>
        </v-menu-confirm>
        <v-btn-table-trash
          v-else-if="!value[i].edit || value[i].AssignCode===undefined"
          v-tooltip="'حذف'"
          :loading="deleteLoading && actionIndex === i"
          @click="remove(i)"
        />
        <v-btn-table
          v-else
          v-tooltip="'لغو ویرایش'"
          icon="fas fa-times"
          color="k_white-800"
          @click="value[i].edit=false"
        />
      </div>
    </div>
    <v-overlay
      :model-value="loading || submitLoading || deleteLoading"
      scrim="white"
      contained
    />
  </div>
  <br>
  <div>
    <v-btn-add-item
      v-if="value.length < max"
      class="inherit"
      color="info"
      :disabled="props.disabled"
      @click="add"
    >
      {{ addTitle }}
    </v-btn-add-item>
    <v-btn-success
      v-if="submit"
      class="!tw-w-fit"
      prepend-icon="fas fa-save"
      :loading="loading"
      :disabled="props.disabled"
      @click="emit('on-submit')"
    >
      ثبت
    </v-btn-success>
    <slot name="actions" />
  </div>
</template>

<script setup>
const props = defineProps({
  'modelValue' : { type : [Array] , default : ()=>([]) , required: true },
  'schema' : { type : [Array] , default : ()=>([]) },
  'addTitle' : { type : String, default :'افزودن' },
  'submit' : { type : Boolean, default : false },
  'loading': { type: Boolean , default: false },
  'eager' : { type : Boolean , default :false },
  'disabled' : { type : Boolean , default :false },
  'rowActionMode' : { type : Boolean , default :false },
  'onSubmitRow' : { type : Function , default : null },
  'onDeleteRow' : { type : Function , default : null },
  'max' : { type :Boolean , default : 100 },
})

const emit = defineEmits(['update:modelValue','onSubmit','onRemove'])
const submitLoading = ref(false)
const deleteLoading = ref(false)
const value = useVModel(props,'modelValue',emit)
const actionIndex = ref(null)
const formRef = ref()

const add = ()=>{
  if(value.value.length < props.max) {
    value.value.push({ edit: true })
  }
}

const remove = i=>{
  value.value.splice(i , 1)
}

const onSubmitRow = async (val,i)=>{
  if(props.onSubmitRow){
    submitLoading.value = true
    actionIndex.value = i
    try{
      const res = await props.onSubmitRow(val)

      submitLoading.value =false
    }catch(e){
      submitLoading.value =false
      console.log(e)
    }

  }
}

const onDeleteRow = async (val,i)=>{
  if(!!val.AssignCode){
    if(props.onDeleteRow){
      deleteLoading.value = true
      try{
        actionIndex.value = i

        const res = await props.onDeleteRow(val)

        deleteLoading.value = false

        remove(i)
      }catch(e){
        deleteLoading.value =false
        console.log(e)
      }

    }else{
      remove(i)
    }
  }
}

console.log(value.value)
watch(value,val=>{
  if(val && val.length === 0 && props.eager){
    value.value[0] = {}
  }
})
onMounted(() => {
  if(props.eager){
    value.value[0] = {}
  }
})
</script>
