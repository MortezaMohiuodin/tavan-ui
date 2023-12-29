<template>
  <v-dialog
    v-if="modelValue !== null"
    v-model="value"
    v-bind="{...dialogProps,...$attrs}"
    :persistent="false"
    width="auto"
  >
    <template #activator="allProps">
      <slot
        name="activator"
        v-bind="allProps"
      />
    </template>
    <v-card
      v-bind="cardProps"
    >
      <template v-if="mode === 'modal'">
        <v-progress-linear
          v-if="loading"
          indeterminate
          :color="color"
          class="mb-0"
          height="8"
        />
        <div
          v-else
          class="topLine"
          :class="[`tw-border-t-${color}`]"
        />
      </template>
      <div :class="{'tw-p-3' : mode === 'modal' , 'tw-flex-1 tw-flex tw-flex-col' : mode === 'drawer'}">
        <h3
          v-if="title"
          class="tw-text-xl tw-font-YEKAN-BAKH-MEDIUM tw-text-center"
        >
          {{ title }}
        </h3>
        <!--      <v-btn -->
        <!--        v-if="showClose" -->
        <!--        icon="fas fa-times" -->
        <!--        variant="tonal" -->
        <!--        size="30" -->
        <!--        rounded="lg" -->
        <!--        color="primary" -->
        <!--        :ripple="false" -->
        <!--        class="tw-absolute tw-indent-0 tw-top-2px tw-top-2.5 tw-right-2.5" -->
        <!--        @click="value = false" -->
        <!--      /> -->
        <div :class="{'tw-flex-1' : mode === 'drawer'}">
          <slot />
        </div>
        <div class="tw-text-center">
          <slot
            name="actions"
          >
            <v-btn-cancel
              v-if="cancelBtnText"
              class="!tw-w-[120px] sm:tw-w-[180px]"
              @click="emit('onCancel')"
            >
              {{ cancelBtnText }}
            </v-btn-cancel>
            <v-btn
              v-if="confirmBtnText"
              :loading="loading"
              class="tw-mx-[4px] !tw-w-[120px] sm:tw-w-[180px]"
              size="large"
              :color="color"
              rounded="xl"
              @click="emit('onConfirm')"
            >
              {{ confirmBtnText }}
            </v-btn>
          </slot>
        </div>
      </div>
    </v-card>
  </v-dialog>
  <v-dialog
    v-else
    v-bind="{...dialogProps,...$attrs}"
    :persistent="false"
    width="auto"
  >
    <template #activator="allProps">
      <slot
        name="activator"
        v-bind="allProps"
      />
    </template>
    <v-card
      v-bind="cardProps"
    >
      <template v-if="mode === 'modal'">
        <v-progress-linear
          v-if="loading"
          indeterminate
          :color="color"
          class="mb-0"
          height="8"
        />
        <div
          v-else
          class="topLine"
          :class="`[tw-border-t-${color}]`"
        />
      </template>
      <div :class="{'tw-p-3' : mode === 'modal' , 'tw-flex-1 tw-flex tw-flex-col' : mode === 'drawer'}">
        <h3
          v-if="title"
          class="tw-text-xl tw-font-bold tw-text-center"
        >
          {{ title }}
        </h3>
        <!--      <v-btn -->
        <!--        v-if="showClose" -->
        <!--        icon="fas fa-times" -->
        <!--        variant="tonal" -->
        <!--        size="30" -->
        <!--        rounded="lg" -->
        <!--        color="primary" -->
        <!--        :ripple="false" -->
        <!--        class="tw-absolute tw-indent-0 tw-top-2px tw-top-2.5 tw-right-2.5" -->
        <!--        @click="value = false" -->
        <!--      /> -->
        <div :class="{'tw-flex-1' : mode === 'drawer'}">
          <slot />
        </div>
        <div class="tw-text-center">
          <slot
            name="actions"
          >
            <v-btn-cancel
              v-if="cancelBtnText"
              class="!tw-w-[120px] sm:tw-w-[180px]"
              @click="emit('onCancel')"
            >
              {{ cancelBtnText }}
            </v-btn-cancel>
            <v-btn
              v-if="confirmBtnText"
              :loading="loading"
              :color="color"
              class="tw-mx-[4px] !tw-w-[120px] sm:tw-w-[180px]"
              size="large"
              rounded="xl"
              @click="emit('onConfirm')"
            >
              {{ confirmBtnText }}
            </v-btn>
          </slot>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useDisplay } from 'vuetify'

const props = defineProps({
  modelValue : { type : Boolean , default : null,  required : false },
  loading : { type : Boolean , default : false , required:  false },
  desktopMode : { type : String , default : 'modal' , required : false },
  color : { type : String , default : 'success' },
  title : { type : String , default : null , required : false },
  showClose : { type : Boolean , default : true , required:  false },
  cancelBtnText : { type:String , default: null },
  confirmBtnText : { type:String , default: null },
})

const emit = defineEmits(['update:loading' , 'update:modelValue','onConfirm' , 'onCancel'])
const { smAndDown } = useDisplay()
const route = useRoute()

const bottomSheetProps = {
  class : 'v-bottom-sheet',
  contentClass : 'v-bottom-sheet__content',
  transition : 'bottom-sheet-transition',
}

const bottomSheetCardProps = {
  class : 'rounded-t-xl rounded-b-0 tw-bg-secondary-100 tw-p-7',
}

const modalCardProps = {
  class : 'customModal',
}

const drawerProps = {
  contentClass:"left-drawer",
  transition : 'drawer-transition',
}

const modalProps = {
  width: 'auto',
  minWidth : '300px',
  persistent:"false",
}

const drawerCardProps = {
  width:"100%",
  rounded:"0",
  class:"rounded-s-xl tw-p-4",
}

const mode = computed(()=>{
  return smAndDown.value ? 'bottomSheet' : props.desktopMode === 'drawer' ?  'drawer' : 'modal'
})

const dialogProps = computed(()=>{
  return mode.value === 'bottomSheet' ? bottomSheetProps : mode.value === 'drawer' ? drawerProps : modalProps
})

const cardProps = computed(()=>{
  return mode.value === 'bottomSheet' ? bottomSheetCardProps : mode.value === 'drawer' ? drawerCardProps : modalCardProps
})

const value = useVModel(props, 'modelValue' , emit)

watch(route,()=>{
  value.value = false
})
</script>

<style lang="scss">
.bottom-sheet-transition{
  &-enter-from{
    transform: translateY(100%)
  }

  &-leave-to{
    transform: translateY(100%)
  }
}
// Block
.v-bottom-sheet{
  > .v-bottom-sheet__content.v-overlay__content{
    align-self: flex-end;
    border-radius: 0;
    width: 100%!important;
    max-width: 100%;
    margin: 0;
  }
  flex: 0 1 auto;
  left: 0;
  right: 0;
  margin-inline-start: 0;
  margin-inline-end: 0;
  margin-bottom: 0;
  transition-duration: .2s;
  width: 100%;
  max-width: 100%;
  overflow: visible;
  > .v-card,
  > .v-sheet{
    border-radius: 0px;
  }
  &.v-bottom-sheet--inset{
    max-width: none
  }
}
.left-drawer{
  max-height: 100%!important;
  margin: 0!important;
  left: 0!important;
  width: 300px!important;
  height: 100%!important;
  display: flex!important;
  max-width: 30%!important;
  flex-direction: row!important;
  justify-content: flex-end!important;
}
//.drawer-transition{
//  &-enter-from{
//    transform: translateX(100%)
//  }
//
//  &-leave-to{
//    transform: translateX(100%)
//  }
//}
.topLine{
  @apply tw-w-full tw-border-t-[8px]
}
.customModal{
  border-radius: 15px!important;
}
</style>
