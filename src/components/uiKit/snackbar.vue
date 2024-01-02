<template>
  <v-snackbar
    v-for="(item, index) in snackbars"
    :key="item.key"
    v-model="item.show"
    transition="slide-y-reverse-transition"
    variant="text"
    class="container-snack tw-transition-all"
    :style="{ margin : smAndDown ?0:'8px' , 'margin-bottom': calcMargin(index) }"
    :timeout="4000"
    :location="isRtl?'left bottom':'right bottom'"
    position="fixed"
    @update:model-value="removeSnack(index)"
  >
    <div
      class="wrap-snack tw-relative"
      :class="item.variant"
    >
      <v-btn
        icon="fas fa-remove"
        class="tw-absolute tw-left-2 tw-top-2 tw-text-[8px]"
        size="20"
        density="compact"
        :color="item.variant"
        variant="outlined"
        @click="removeSnack(index)"
      />
      <div
        class="content-snack"
      >
        <div class="icon-snack">
          <v-icon
            :icon="`custom:${item.variant}`"
            size="30"
          />
        </div>
        <p class="text-snack">
          {{ item.text }}
        </p>
      </div>
    </div>
  </v-snackbar>
</template>

<script setup>
import { useRtl , useDisplay } from 'vuetify'
import { useSnackbar } from '@/composables/useSnackbar'

const { snackbars } = useSnackbar()
const { isRtl } = useRtl()
const { smAndDown } = useDisplay()

function removeSnack(index) {
  snackbars.value.splice(index, 1)
}

const calcMargin = index => `${index * 100 + (smAndDown?0:30) }px`
</script>

<style scoped lang="scss">
.content-snack{
  @apply rtl:tw-ml-[20px] ltr:tw-mr-[20px] lg:tw-ml-0 tw-transition-all
}
.text-snack{
  @apply tw-my-auto tw-break-words tw-text-[16px]
}
.icon-snack {
  @apply tw-my-auto tw-ml-[15px] tw-mr-[30px]
}
.content-snack{
  @apply tw-flex tw-h-full sm:tw-w-[400px] tw-w-[95vw] rtl:tw-border-r-[8px] ltr:tw-border-l-[8px]
}
.wrap-snack{
  /*box-shadow: 1px 1px 8px 1px #9f9c9c;*/
  @apply sm:tw-rounded-[20px] tw-border-[#E9ECF6] tw-h-[95px] tw-overflow-hidden
}
.success{
  @apply tw-bg-success-100;
  .content-snack{
    @apply rtl:tw-border-r-success ltr:tw-border-l-success;
  }
}
.warning{
  @apply tw-bg-warning-100;
  .content-snack{
    @apply rtl:tw-border-r-warning ltr:tw-border-l-warning;
  }
}
.error{
  @apply tw-bg-error-100;
  .content-snack{
    @apply rtl:tw-border-error ltr:tw-border-error;
  }
}
.info{
  @apply tw-bg-info-100;
  .content-snack {
    @apply rtl:tw-border-r-info ltr:tw-border-l-info;
  }
}
</style>
