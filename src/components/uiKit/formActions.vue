<template>
  <div class="tw-text-center">
    <v-btn-cancel @click="$router.back()">
      انصراف
    </v-btn-cancel>
    <v-btn-success
      :loading="props.loading"
      @click="emits('save')"
    >
      ذخیره
    </v-btn-success>
  </div>
</template>

<script setup>
const props = defineProps({
  loading:{ type:Boolean,default:()=>{} },
})

const emits = defineEmits(['save','cancel'])
</script>
