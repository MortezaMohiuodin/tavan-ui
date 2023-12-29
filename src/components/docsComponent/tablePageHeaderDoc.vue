<template>
  <VCard
    title="Table Page Header"
    :rtl="false"
  >
    <VCardText>
      A header component for pages with table.
      <h1>Props && emits</h1>
      <Prism language="javascript">
        {{ propsEmits }}
      </Prism>
      <h1>Basic Usage</h1>
      <Prism>
        {{ basic }}
      </Prism>
      <section>
        <VLocaleProvider
          rtl
        >
          <table-page-header
            title="لیست آیتم"
            :show-add-item-link="true"
            :show-filter-btn="true"
             add-item-text="آیتم جدید"
             addPath="/docs"
          />
        </VLocaleProvider>
      </section>
      <h1>Open modal on add</h1>
      <Prism>
        {{ withModal }}
      </Prism>
      <section>
        <VLocaleProvider
          rtl
        >
          <table-page-header
            title="لیست آیتم"
            add-modal
            @on-add="onAdd"
          />
        </VLocaleProvider>
      </section>
    </VCardText>
  </VCard>

</template>
<script setup>
import Prism from 'vue-prism-component'
import tablePageHeader from '@/components/organisms/tablePage/tablePageHeader.vue'
let propsEmits = `// props
defineProps({
    // if page title is not passed , component will look for route.meta.title to display as title
    title : { type:String ,default :null , required:false },
    addPath : { type:String ,default :null , required:false },
    addModal : { type: Boolean ,default:false },
    showFilterBtn : { type : Boolean , default : true },
    showAddItemLink : { type : Boolean , default : true },
    addItemText : { type : String , default : 'افزودن آیتم جدید' },
})
// emits
defineEmits(['onAdd'])
`
const onAdd = ()=>{
  alert('onAdd')
}
let basic =  ` <table-page-header
    title="لیست آیتم"
    :show-add-item-link="true"
    :show-filter-btn="true"
     add-item-text="آیتم جدید"
     addPath="/docs"
/>`

let withModal =  ` <table-page-header
  title="لیست آیتم"
  add-modal
  @on-add="()=>alert('add!')"
/>`


</script>
