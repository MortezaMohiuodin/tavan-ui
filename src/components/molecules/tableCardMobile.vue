<template>
  <v-card-default
    class="tw-mb-4"
    @click="handleShowAction"
  >
    <div class="tw-flex-col">
      <div>
        <div
          class="tw-flex tw-items-center tw-justify-between"
        >
          <div class="tw-flex">
            <v-avatar
              v-if="img !== null"
              class="!tw-rounded-xl"
              rounded="initial"
              :image="img || avatarPlaceholder"
            />
            <div
              class="tw-ms-3"
              :class="{'tw-text-success' : showAction}"
            >
              <p class="tw-font-semibold">
                {{ heading }}
              </p>
              <p :class="{'tw-text-neutral-800':!showAction}">
                {{ subHeading }}
              </p>
            </div>
          </div>
          <v-chip
            v-if="more !== null"
            color="info"
            rounded="xl"
          >
            {{ more }}
          </v-chip>
        </div>
      </div>
      <div>
        <v-slide-x-transition>
          <div
            v-if="showAction"
            ref="actionBoxRef"
            class="actionBox tw-text-center tw-mt-3 tw-h-full tw-w-0 tw-pe-4"
            :class="[{'!tw-w-full':showAction}]"
          >
            <slot name="actions" />
          </div>
        </v-slide-x-transition>
      </div>
    </div>
  </v-card-default>
</template>

<script setup>
import avatarPlaceholder from '@/assets/images/profile/avatar-placeholder.png'

const props = defineProps({
  heading : { type: String ,default : null },
  subHeading : { type: String ,default : null },
  img : { type: String ,default : null },
  more : { type: String ,default : null },
})

const showAction = ref(false)
const actionBoxRef = ref(null)

const handleShowAction = e=>{
  // let condition = e.target?.className?.includes('actionBox') || e.target.offsetParent.className.includes('actionBox')
  // if(condition) return
  showAction.value = !showAction.value
}

onClickOutside(actionBoxRef, event => {
  // let condition = event.target.className.includes('v-card') || event.target.offsetParent.className.includes('v-card')
  // if(condition) return
  // showAction.value = false
})
</script>

<style scoped lang="scss">
.actionBox{
  margin-top: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-radius: 24px 0 0 24px;
  background: #fff;
}
</style>
