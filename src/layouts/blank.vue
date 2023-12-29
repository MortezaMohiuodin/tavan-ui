<template>
  <v-app>
    <v-main style="height:fit-content">
      <router-view v-slot="{ Component, route }">
        <transition
          :name="route.meta.transition"
          mode="out-in"
        >
          <component
            :is="Component"
            :key="route.path"
          />
        </transition>
      </router-view>
    </v-main>
  </v-app>
</template>
