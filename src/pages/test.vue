<template>
  <div>
    <schema-form-with-plugins
      schema-row-classes="custom-form-extend"
      :schema="schema"
      :step="step"
      :prevent-model-cleanup-on-schema-change="false"
      :use-custom-form-wrapper="false"
      @submit="onSubmit"
    >
      <template #beforeForm>
        <div>after form</div>
      </template>
      <template #afterForm>
        <button type="submit">
          after form
        </button>
      </template>
    </schema-form-with-plugins>
  </div>
</template>

<script setup>
import { SchemaForm, useSchemaForm , SchemaWizard , SchemaFormFactory } from 'formvuelate'
import { markRaw } from 'vue'
import VTextFieldExtend from '@/components/uiKit/vTextFieldExtend.vue'
import VSelectExtend from '@/components/uiKit/vSelectExtend.vue'


markRaw(VTextFieldExtend)

const formModel = ref({})
const step = ref(0)

const { model, updateFormModel } = useSchemaForm(formModel)

const SchemaFormWithPlugins = SchemaFormFactory([
//   LookupPlugin({
//     mapComponents: {
//       string: 'FormText',
//       array: 'FormSelect',
//     },
//   }),
//   VuelidatePlugin(useVuelidate),
//   VeeValidatePlugin(),
],

{ input : VTextFieldExtend , select : VSelectExtend },
)


const schema = computed(()=>{
  return [
    { model:'name', component : 'input', title : 'نام',default: 'Darth',condition: model => model.name === 'salam'  },
    { model:'email', component : 'input', title : 'ایمیل'  , type : 'email'  },
    { model:'role', component : 'select' , title : 'نقش' , items: $enums.role  },
    { model:'phone', component : 'input' , title : 'موبایل'  },
    { model:'city', component : 'input' , title : 'شهر'  },
    { model:'country', component : 'input' , title : 'کشور' },
  ]
})

const onSubmit = async()=>{
  console.log('submit')
}
</script>