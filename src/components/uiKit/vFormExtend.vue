<template>
  <v-form
    v-model="isValid"
    v-bind="$attrs"
    @submit.prevent="onSubmit"
  >
    <div
      class="tw-mx-auto tw-h-full"
      :style="{maxWidth:width}"
    >
      <!-- Form Title -->
      <h3
        v-if="
          title"
        class="page-heading tw-mt-3"
      >
        {{ title ? title : $route.meta.title }}
      </h3>
      <!-- Form Description -->
      <p
        v-if="desc"
        class="tw-mb-3"
      >
        {{ desc }}
      </p>
      <!-- Form wrapper , can be either card or simple div -->
      <component
        :is="withCard ? 'v-card-default' : 'div'"
        v-bind="wrapperProps"
      >
        <div :style="{'maxWidth' : innerWidth? innerWidth : 'initial' , 'margin' : innerWidth ? 'auto' : 'initial'}">
          <v-row
            dense
          >
            <!-- Iterating through schema -->
            <template
              v-for="(field,index) in formSchema"
              :key="field.uuid"
            >
              <!-- Condition to exist in form , default is true -->
              <template v-if="field.condition">
                <!-- Before slot for field -->
                <template v-if="hasSlot(`before.${field.model}`)">
                  <slot :name="`before.${field.model}`" />
                </template>
                <!-- Condition to be visible in form , default is true -->
                <v-col
                  v-show="field.visible"
                  v-bind="field.col"
                >
                  <!-- if checkboxGuard field is defined and is string , a checkbox will appear to determine field condition existent -->
                  <v-checkbox
                    v-if="!!field.checkboxGuard"
                    :label="field.checkboxGuard"
                    :model-value="modelsVisibility[field.model]"
                    @update:model-value="(val)=>updateFieldShow(val,field.model)"
                  />
                  <!-- If field name does not have slot generate it based on schema -->
                  <template
                    v-if="!hasSlot(field.model)"
                  >
                    <div
                      v-if="modelsVisibility[field.model]"
                      :style="{maxWidth: field.width }"
                    >
                      <label
                        v-if="field.title"
                        :for="field.uuid"
                        class="fieldLabel"
                      >{{ field.title }}</label>
                      <label
                        v-else-if="field.label"
                        :for="field.uuid"
                        class="fieldLabel tw-invisible"
                      >{{ field.label }}</label>
                      <component
                        :is="field.component"
                        :id="field.uuid"
                        :model-value="value[field.model]"
                        :rules="field.required ? [x=>!!x || 'این فیلد را پر کنید'] : [] "
                        v-bind="field"
                        @update:model-value="val=>updateFormValue(field.model,val)"
                      />
                    </div>
                  </template>
                  <!-- else generate field based on slot and pass scope -->
                  <template
                    v-else
                  >
                    <slot
                      :name="field.model"
                      v-bind="{formValue : value , updateFormValue , field}"
                    />
                  </template>
                </v-col>
                <!-- After slot for field -->
                <template v-if="hasSlot(`after.${field.model}`)">
                  <slot :name="`after.${field.model}`" />
                </template>
              </template>
            </template>
          </v-row>
          <v-overlay
            scrim="white"
            :model-value="loading"
            class="align-center justify-center"
            contained
          />
        </div>
      </component>
      <slot name="actions">
        <div
          v-if="actions"
          ref="formActions"
          class="tw-mt-10 sm:tw-mt-7 tw-text-center tw-flex tw-flex-col-reverse sm:tw-flex-row tw-mx-1 sm:tw-justify-center"
        >
          <v-btn-cancel
            v-if="cancelActions"
            size="large"
            class="tw-w-full sm:tw-w-44"
            @click="onCancel"
          >
            انصراف
          </v-btn-cancel>
          <v-btn-success
            size="large"
            class="tw-w-full sm:tw-w-44 tw-mb-4 sm:tw-mb-0"
            :loading="loading"
            elevation="2"
            type="submit"
            v-bind="confirmBtnProp"
          >
            ذخیره
          </v-btn-success>
        </div>
      </slot>
    </div>
  </v-form>
</template>

<script setup>
import { VCheckbox } from 'vuetify/components/VCheckbox'
import { VSwitch } from 'vuetify/components/VSwitch'
import { VRangeSlider } from 'vuetify/components/VRangeSlider'
import { VSlider } from 'vuetify/components/VSlider'
import { VTextarea } from 'vuetify/components/VTextarea'
import { VAlert } from 'vuetify/components/VAlert'
import { VRadio } from 'vuetify/components/VRadio'
import VTextFieldExtend from '@/components/uiKit/vTextFieldExtend.vue'
import VSelectExtend from '@/components/uiKit/vSelectExtend.vue'
import PersianDatepicker from '@/components/uiKit/persianDatepicker.vue'
import VRadioGroupExtend from '@/components/uiKit/vRadioGroupExtend.vue'

import { uuidv4 } from '@/helper/utility'


const props = defineProps({
  // form model
  modelValue : { type: Object, default : ()=>({}) },
  // An Object defining form fields
  schema : { type : Array , default : ()=>([]),required: true },
  // Wrapper be a card or div
  withCard : { type : Boolean , default : true },
  // Form width
  width : { type : [String,Number] , default : null },
  // Form inner width
  innerWidth : { type : [String,Number] , default : null },
  loading : { type : Boolean , default : false,required:false },
  // Show Actions buttons for form
  actions : { type : Boolean , default : true,required:false },
  cancelActions : { type : Boolean , default : true,required:false },
  confirmBtnProp : { type : Object , default : ()=>{},required:false },
  title : { type: String , default : null },
  desc : { type: String , default : null },
  // Whether validate form or not
  validation: { type : Boolean , default : true,required:false },
})

const emit = defineEmits(['onSubmit','update:modelValue','onCancel'])

const slots = useSlots()
const value = useVModel(props, 'modelValue' , emit)
const modelsVisibility = ref({})
const isValid = ref(false)
const formActions = ref(null)
const { width : formActionWidth } = useElementSize(formActions)


const COLS_DEFAULT = val=>{
  if(val.component !== 'radio' && val.component !== 'radio-group' && val.component !== 'checkbox' && val.component !== 'alert' )
    return { cols:'12', sm:'12',md:'6',lg:'4',xl:'3' }
  else    return { cols:'12' }
}

const updateFormValue = (key,val)=>{
  value.value[key]=val
}

const onSubmit = ()=>{
  if(props.validation && !isValid.value) return
  emit('onSubmit',value.value)
}

const onCancel = ()=>{
  emit('onCancel')
}

const hasSlot = name => {
  return !!slots[name]
}

const attrs = useAttrs()

const wrapperProps = computed(()=>{
  return props.width ? { class: 'tw-p-2 lg:tw-p-4 tw-mx-auto tw-h-full',style: { maxWidth: props.width } } :{ class: 'tw-p-2 lg:tw-p-4 tw-h-full' }
})



const formSchema = computed({
  get(){
    return props.schema.map(val=>{
      let col
      let uuid = uuidv4()
      let component
      let condition
      let visible
      let required
      if(typeof val.component === 'string'){
        if(val.component === 'input'){
          component = VTextFieldExtend
        }else if(val.component === 'select'){
          component = VSelectExtend
        }else if(val.component === 'checkbox'){
          component = VCheckbox
        }else if(val.component === 'switch'){
          component = VSwitch
        }else if(val.component ==='range-slider'){
          component = VRangeSlider
        }else if(val.component ==='textarea'){
          component = VTextarea
        }else if(val.component === 'slider'){
          component = VSlider
        }else if(val.component === 'datepicker'){
          component = PersianDatepicker
        }else if(val.component === 'radio-group'){
          component = VRadioGroupExtend
        }else if(val.component === 'radio'){
          component = VRadio
        }
        else if(val.component === 'alert'){
          component = VAlert
        }
      }else{
        component = val.component
      }
      col = val.col ? val.col : COLS_DEFAULT(val)
      if(typeof val.condition === 'function'){
        condition = val.condition(value.value)
      }else if(typeof val.condition === 'boolean'){
        condition = val.condition
      }else condition = true
      if(typeof val.visible === 'function'){
        visible = val.visible(value.value)
      }else if(typeof val.visible === 'boolean'){
        visible = val.visible
      }else visible = true
      if(typeof val.required === 'function'){
        required = val.required(value.value)
      }else if(typeof val.required === 'boolean'){
        required = val.required
      }else required = true


      return {
        ...val,
        uuid,
        col,
        condition,
        component,
        visible,
      }
    })
  },
  set(val){
  },
})

const updateFieldShow = (val , key)=>{
  if(!val) value.value[key] = null
  modelsVisibility.value[key] = val
}

watch(formSchema,()=>{
  let object = {}
  formSchema.value.forEach(val=>{
    if(!val.checkboxGuard) {
      object[val.model] = true
    }else if(value.value[val.model]){
      object[val.model] = true
    }else{
      object[val.model] = false
    }
  })

  modelsVisibility.value = object
},{ immediate:true })

defineExpose({ onSubmit , isValid })
</script>
