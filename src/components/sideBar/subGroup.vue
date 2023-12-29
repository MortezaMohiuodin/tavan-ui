<template>
  <template
    v-for="item in menuProps.items"
    :key="item.id"
  >
    <v-list-group
      v-if="item.children && hasSubGroupPermits(item.children)"
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
          <v-badge
            inline
            color="info"
            max="10000"
            :content="store.badges[item.badgeKey]"
            :model-value="!!store.badges[item.badgeKey]"
          >
            <span class="tw-mr-3 tw-text-white">{{ item.title }}</span>
          </v-badge>
        </v-list-item>
      </template>
      <template
        v-for="subGroup in item.children"
        :key="subGroup.title"
      >
        <!--      Define corresponding submenus for each category -->
        <v-list-item
          v-if="hasRequirePermit(subGroup.requirePermit) && !hasLacksPermission(subGroup.lacksPermission)"
          rounded="xl"
          v-bind="$attrs"
          :disabled="isDisable(subGroup)"
          :to="subGroup.route"
          @click="store.resetTempBySidebarClick()"
        >
          <template #title>
            <v-badge
              :content="store.badges[subGroup.badgeKey]"
              :model-value="!!store.badges[subGroup.badgeKey]"
              inline
              color="info"
              max="10000"
            >
              <span class="tw-text-[14px] tw-text-white">{{ subGroup.title }} </span>
            </v-badge>
          </template>
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
    <!--      Define individual menus outside of any category  -->
    <v-list-item
      v-else-if="!item.children && hasRequirePermit(item.requirePermit) && !hasLacksPermission(item.lacksPermission)"
      :disabled="false"
      rounded="xl"
      v-bind="$attrs"
      :to="item.route"
      @click="store.resetTempBySidebarClick()"
    >
      <template #title>
        <v-badge
          inline
          color="info"
          max="10000"
          :content="store.badges[item.badgeKey]"
          :model-value="!!store.badges[item.badgeKey]"
        >
          <span class="tw-text-[14px] tw-text-white">{{ item.title }}</span>
        </v-badge>
      </template>
      <template #prepend>
        <div class="tw-w-fit tw-mr-[50px] tw-ml-3">
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
</template>

<script setup>
const menuProps = defineProps({ items: { type: Array, default: ()=>[] } })
const store = useAppStore()
function hasRequirePermit(requirePermit) {
  // If the requirePermit property is undefined or empty, it means that it is not specifically dedicated to any spatial
  // Permit and can be shown to all users.
  if (requirePermit === undefined || requirePermit.length === 0) return true

  return requirePermit.filter(p => store.permits.includes(p)).length
}
function hasSubGroupPermits(children) {
  return children.filter(child => hasRequirePermit(child.requirePermit)).length
}
function hasRequirePlugin(requirePlugin) {
  // If the requirePlugin property is undefined or empty, it means that it is not specifically dedicated to any spatial
  // plugin and can be shown to all users.
  if (requirePlugin === undefined || requirePlugin.length === 0) return true

  return requirePlugin.filter(i => store.activePlugins.includes(i)).length
}
function hasLacksPermission(lacksPermission) {
  if (lacksPermission === undefined || lacksPermission.length === 0) return false

  return lacksPermission.filter(p => store.permits.includes(p)).length
}

const isDisable = item=>{
  return (!hasRequirePlugin(item.requirePlugin) || item.completelyDisable)
}
</script>
