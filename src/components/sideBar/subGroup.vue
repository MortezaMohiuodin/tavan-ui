<template>
  <template
    v-for="item in menuProps.items"
    :key="item.id"
  >
    <v-list-item
      v-if="!!item.route"
      :value="item.id"
      :append-icon="item.icon"
      :ripple="false"
      :to="item.route"
      @click="store.resetTempBySidebarClick()"
    >
      <v-icon
        class="tw-mr-[50px] tw-mb-1 tw-transition-all"
        :icon="item.icon ? item.icon : 'fa fa-circle'"
        color="secondary"
        size="10"
      />
      <span class="tw-mr-3 tw-text-white">{{ item.title }}</span>
    </v-list-item>
    <v-list-group
      v-else
      :value="item.id"
      collapse-icon=""
      expand-icon=""
      class="tw-mb-3"
      subgroup
      v-bind="$attrs"
    >
      <!--      Define the category names, such as "Basic," "Assignment," and "Report -->
      <template #activator="{isOpen,props}">
        <v-list-item
          v-bind="props"
          append-icon=""
          :ripple="false"
        >
          <v-icon
            class="tw-mr-[50px] tw-mb-1 tw-transition-all"
            :icon="isOpen ? 'fa-solid fa-minus ': 'fa-solid fa-plus' "
            color="secondary"
            size="10"
          />
          <span class="tw-mr-3 tw-text-white">{{ item.title }}</span>
        </v-list-item>
      </template>
      <template
        v-for="subGroup in item.children"
        :key="subGroup.title"
      >
        <!--      Define corresponding submenus for each category -->
        <v-list-item
          rounded="xl"
          v-bind="$attrs"
          :to="subGroup.route"
          @click="store.resetTempBySidebarClick()"
        >
          <span class="tw-text-[14px] tw-text-white">{{ subGroup.title }} </span>
          <template
            #prepend
          >
            <div class="tw-w-fit tw-mr-[65px] tw-ml-3">
              <v-icon
                style="opacity: 1"
                icon="fas fa-square"
                color="secondary"
                size="8"
              />
            </div>
          </template>
        </v-list-item>
      </template>
    </v-list-group>
  </template>
</template>

<script setup>
const menuProps = defineProps({ items: { type: Array, default: ()=>[] } })
const store = useAppStore()
function hasRequirePermit(requirePermit) {
  // If the requirePermit property is undefined or empty, it means that it is not specifically dedicated to any spatial
  // Permit and can be shown to all users.
  return false
  // if (requirePermit === undefined || requirePermit.length === 0) return true

  // return requirePermit.filter(p => store.permits.includes(p)).length
}
function hasSubGroupPermits(children) {
  return children.filter(child => hasRequirePermit(child.requirePermit)).length
}
function hasRequirePlugin(requirePlugin) {
  // If the requirePlugin property is undefined or empty, it means that it is not specifically dedicated to any spatial
  // plugin and can be shown to all users.
  // if (requirePlugin === undefined || requirePlugin.length === 0) return true
  return false
  // return requirePlugin.filter(i => store.activePlugins.includes(i)).length
}
function hasLacksPermission(lacksPermission) {
  // if (lacksPermission === undefined || lacksPermission.length === 0) return false
  return false
  // return lacksPermission.filter(p => store.permits.includes(p)).length
}

const isDisable = item=>{
  return (!hasRequirePlugin(item.requirePlugin) || item.completelyDisable)
}
</script>
