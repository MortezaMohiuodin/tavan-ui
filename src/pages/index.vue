<template>
  <landing-header />
  <landing-main />
  <landing-footer />
</template>


<route>
  {
  meta: {
  layout: "blank"
  }
  }
  </route>



<script setup>
import landingHeader from '@/components/landing/header'
import landingMain from '@/components/landing/main'
import landingFooter from '@/components/landing/footer'
import './index.css'
</script>


