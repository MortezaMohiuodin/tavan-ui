<template>
  <div class="sidebarContainer tw-overflow-hidden">
    <!--  header -->
    <div class="headerContainer">
      <div class="headerWrapIcon">
        <v-icon
          icon="custom:logo"
          size="70"
          class="tw-m-auto"
        />
      </div>
    </div>
    <!--  items -->
    <div
      class="tw-m-auto tw-w-60  tw-overflow-y-auto tw-pr-3"
      style="height: calc(100% - 150px)"
      dir="ltr"
    >
      <v-list
        v-model:opened="open"
        dir="rtl"
        open-strategy="single"
        color="secondary"
      >
        <template
          v-for="menuItem in menuItems"
          :key="menuItem.id"
        >
          <v-list-item
            v-if="!!menuItem.route"
            :prepend-avatar="menuItem.icon"
            class="tw-mb-6"
            :ripple="false"
            :to="menuItem.route"
            @click="store.resetTempBySidebarClick()"
          >
            <span class="tw-mr-2 tw-text-white"> {{ menuItem.title }}</span>
            <template #prepend>
              <div class="headCategoryIcon">
                <v-icon
                  :icon="menuItem.icon"
                  size="20"
                  color="primary"
                  class="tw-m-auto"
                />
              </div>
            </template>
          </v-list-item>
          <!--      product names -->
          <v-list-group
            v-else
            class="tw-mb-5"
            :value="menuItem.id"
          >
            <template
              #activator="{ isOpen,props }"
            >
              <v-list-item
                v-bind="props"
                :prepend-avatar="menuItem.icon"
                class="tw-mb-6"
                :ripple="false"
              >
                <span class="tw-mr-2 tw-text-white"> {{ menuItem.title }}</span>
                <template #prepend>
                  <div class="headCategoryIcon">
                    <v-icon
                      color="primary"
                      :icon="menuItem.icon"
                      size="20"
                      class="tw-m-auto"
                    />
                  </div>
                </template>
                <template #append>
                  <v-btn
                    size="small"
                    color="secondary"
                    variant="text"
                    :icon="isOpen? 'fas fa-chevron-up':'fas fa-chevron-down'"
                  />
                </template>
              </v-list-item>
            </template>
           
            <!--    Define the category names, such as "Basic," "Assignment," and "Report," along with their corresponding submenus for each product.  -->
            <sub-group
              v-if="!!menuItem.children"
              :items="menuItem.children"
            />
          </v-list-group>
        </template>
      </v-list>
    </div>
  </div>
</template>

<script setup>
import { menuItems as MENU_ITEMS } from '@/menu/menu'

const store = useAppStore()
let menuItems = Object.entries(MENU_ITEMS).map(([key,value])=>{
  return { key ,...value, id: Math.floor(Math.random() * 1000) + 1 }
})
let open = ref([])

// fix vuetify bug : the issue is related to the open variable not being properly updated when a head category is closed
// solution : watch the 'open' variable. If it contains only one element, it should be one of the category IDs. In any other case, the 'open' variable should be cleared
watch(open, val=>{
  if (val?.length === 1 && !menuItems.find(item => item.id === val[0])) { open.value = [] }
})
</script>

<style lang="scss">
.sidebarContainer{
  @apply  tw-h-full tw-rounded-tl-[60px] tw-bg-primary
}
.headerContainer{
  @apply tw-flex tw-h-[150px] tw-flex-col
}
.headerWrapIcon{
  @apply tw-m-auto tw-flex tw-h-[86px] tw-w-52 tw-flex-col tw-rounded-[30px] tw-bg-secondary-100
}
.headCategoryIcon{
  @apply tw-flex tw-h-10 tw-w-10 tw-rounded-[15px] tw-bg-secondary-100
}
// customize vuetify v-list
.sidebarContainer {
  .v-list-item {
    -webkit-padding-start: 0px !important;
    padding-inline-start: 0px !important;
  }
  .v-list-item__prepend > .v-icon {
    -webkit-margin-end: 106px;
    margin-inline-end: 16px;
  }
}
</style>
