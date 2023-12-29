<template>
  <VCard
    title="vDialogExtend"
    :rtl="false"
  >
    <VCardText>
      A wrapper function for vuetify vDialog. In mobile, it will show a bottomSheet and in desktop a modal.
      color theme can be changed via "color" prop. Confirm and cancel buttons can be added via props.
      <h1>Props</h1>
      <Prism>
       {{ vDialogExtendProps }}
      </Prism>
      <h1>Events</h1>
      <Prism>
        {{ vDialogExtendEmits }}
      </Prism>
      <h1>Basic Usage</h1>
      <Prism>
        {{ vDialogExtendBasic }}
      </Prism>
      <section>
        <VLocaleProvider
          rtl
        >
          <v-dialog-extend>
            <template #activator={props}>
              <v-btn v-bind="props">باز کردن</v-btn>
            </template>
            متن دیالوگ
          </v-dialog-extend>
        </VLocaleProvider>
      </section>
      <h1>V-model usage</h1>
      <Prism>
        {{ vDialogExtendVModel }}
      </Prism>
      <section>
        <VLocaleProvider
          rtl
        >
          <v-btn variant="tonal" @click="show = !show">روی من کلیک کن</v-btn>
          <v-dialog-extend v-model="show">
            متن دیالوگ
          </v-dialog-extend>
        </VLocaleProvider>
      </section>
      <h1>Full Usage</h1>
      <Prism language="javascript">
        {{ vDialogExtendFull }}
      </Prism>
      <section>
        <VLocaleProvider
          rtl
        >
          <v-btn color="info" :variant="!drawer ? 'tonal' : 'elevated'" @click="drawer = !drawer">حالت کشویی</v-btn>
          <v-dialog-extend
            v-model="showFull"
            title="عنوان"
            :desktop-mode="drawer ? 'drawer' : 'modal'"
            color="secondary"
            :loading="loading"
            cancel-btn-text="انصراف"
            confirm-btn-text="تایید"
            @on-cancel="onCancel"
            @on-confirm="onConfirm"
          >
            <template #activator="{props}">
              <v-btn color="secondary" class="me-2" v-bind="props">روی من کلیک کن</v-btn>
            </template>
            متن دیالوگ
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
          </v-dialog-extend>
        </VLocaleProvider>
      </section>
    </VCardText>
  </VCard>

</template>
<script setup>
import Prism from 'vue-prism-component'
import vDialogExtend from '../uiKit/vDialogExtend.vue';
const show = ref(false)
const showFull = ref(false)
const loading = ref(false)
const drawer = ref(false)
const onConfirm = ()=>{
  loading.value = true
  setTimeout(()=>{
    loading.value = false
  },3000)
}
const onCancel = ()=>{
  showFull.value = false
}

let vDialogExtendBasic = '  <vDialogExtend>\n' +
  '    <template #activator={props}>\n' +
  '      <v-btn v-bind="props">باز کردن</v-btn>\n' +
  '    </template>\n' +
  '    متن دیالوگ\n' +
  '  </vDialogExtend>'
let vDialogExtendVModel = `<v-dialog-extend v-model="show">
        متن دیالوگ
</v-dialog-extend>
`
let vDialogExtendProps = `defineProps({
  modelValue : { type : Boolean , default : null,  required : false },
  loading : { type : Boolean , default : false , required:  false },
  desktopMode : { type : String , default : 'modal' , required : false },
  color : { type : String , default : 'secondary' },
  title : { type : String , default : null , required : false },
  showClose : { type : Boolean , default : true , required:  false },
  cancelBtnText : { type:String , default: null },
  confirmBtnText : { type:String , default: null },
})`
let vDialogExtendEmits = `defineEmits(['update:loading' , 'update:modelValue','onConfirm' , 'onCancel'])`
let vDialogExtendFull = `
 <v-dialog-extend
      v-model="showFull"
      title="عنوان"
      :desktop-mode="drawer ? 'drawer' : 'modal'"
      color="secondary"
      :loading="loading"
      cancel-btn-text="انصراف"
      confirm-btn-text="تایید"
      @on-cancel="onCancel"
      @on-confirm="onConfirm"
    >
    <template #activator="{props}">
      <v-btn color="secondary">روی من کلیک کن</v-btn>
    </template>
    متن دیالوگ
 </v-dialog-extend>

  const showFull = ref(false)
  const loading = ref(false)
  const drawer = ref(false)
  const onConfirm = ()=>{
    loading.value = true
    setTimeout(()=>{
      loading.value = false
    },3000)
  }
  const onCancel = ()=>{
    showFull.value = false
  }
`
</script>
