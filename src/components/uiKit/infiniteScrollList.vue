<template>
  <div class="infiniteScrollList">
    <template v-for="(item , index) in items">
      <slot
        name="default"
        v-bind="{item}"
      >
        <v-card-default
          elevation="2"
          class="tw-mt-4"
        >
          {{ item.Title }}
        </v-card-default>
      </slot>
    </template>
    <div
      v-show="showLoadMore"
      class="more tw-text-center"
    >
      <v-progress-circular
        indeterminate
        color="secondary"
        size="35"
      />
    </div>
    <v-card-default v-if="totalRows === 0 && items.length === 0 && !loading">
      داده ای برای نمایش یافت نشد
    </v-card-default>
  </div>
</template>

<script setup>
const props = defineProps({
  items : { type:Array , default : ()=>([]) , required : false },
  loading : { type: Boolean , default : false , required: false },
  totalRows : { type: Number ,default : null ,required: false },
  showLoadMore : { type : Boolean , default :false },
})

const emit = defineEmits(['onLoad'])

onMounted(()=>{
  const observer = new IntersectionObserver(entries => {
    //if the API response doesn't provide the total number of rows and doesn't include a page parameter in the payload,
    // you can avoid making additional API calls while scrolling since you already have all the available data from the initial request
    // you can use the condition props.totalRows !== null to determine
    if (entries[0].isIntersecting && props.totalRows !== null) {
      emit('onLoad')
    }
  })

  observer.observe(document.querySelector('.more'))
})
</script>

