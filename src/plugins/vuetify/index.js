/**
 * plugins/index.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import '@fortawesome/fontawesome-free/css/all.css'
import 'vuetify/styles'
import { customSVGs } from '../../assets/icon/customSvgs'
import { mdi } from 'vuetify/iconsets/mdi'
import { aliases, fa } from 'vuetify/iconsets/fa'
import { VSelect } from 'vuetify/components/VSelect'
import { VChip } from 'vuetify/components/VChip'
import { VTextField } from 'vuetify/components/VTextField'
import { VCheckbox , VCheckboxBtn } from 'vuetify/components/VCheckbox'

import { VCard } from 'vuetify/components/VCard'
import { VListItem } from 'vuetify/components/VList'
import { VContainer } from 'vuetify/components/VGrid'
import { createVuetify } from 'vuetify'
import { md3 } from 'vuetify/blueprints'
import { VSlideGroup } from "vuetify/components/VSlideGroup"
import { aliases as buttonsAliases , defaults as buttonsDefaults } from './buttons'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides

const myCustomLightTheme = {
  dark: false,
  colors: {
    background: '#F5F7FC',
    surface: '#ffffff',
    primary: '#005D34',
    secondary: '#F68B1F',
    'secondary-darken-1': '#723B02FF',
    'secondary-100': '#FFF2D4',
    'k_white-800': '#6F6F9D',
    white: '#fff',
    k_white_400: '#8CB6A4',
    error: '#ED4C67',
    info: '#2196F3',
    success: '#1ABC9C',
    warning: '#FFD32A',
    k_black: '#212121',
  },
}

const defaultVuetify ={}

export default createVuetify({
  blueprint: md3,
  display: {
    mobileBreakpoint: 'lg',
    thresholds: {
      xs: 390,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536,
    },
  },
  aliases: {
    VAppContainer: VContainer,
    VMultiSelect: VSelect,
    VChipDocV: VChip,
    VCTextField: VTextField,
    VCheckboxPrimary: VCheckbox,
    VCardDashboard: VCard,
    VListItemPill: VListItem,
    VListItemPillLarge: VListItem,
    VSlideGroupFade : VSlideGroup,
    VChipArrow : VChip,
    VChipTable : VChip,
    VChipDate : VChip,
    VCardDefault : VCard,
    ...buttonsAliases,
  },
  defaults: {
    display: {
      mobileBreakpoint: 'sm',
    },
    VDialog: {
      persistent: true,
    },
    VOverlay: {
      persistent: true,
    },
    VCheckboxPrimary: {
      trueIcon: 'custom:checkboxTrue',
      falseIcon: 'custom:checkboxFalse',
    },
    VCheckboxBtn:{
      trueIcon: 'custom:checkboxTrue',
      falseIcon: 'custom:checkboxFalse',
      density:'compact',
    },
    VCheckbox:{
      class:'customCheckBox tw-w-fit',
      trueIcon: 'custom:checkboxTrue',
      falseIcon: 'custom:checkboxFalse',
      hideDetails: true,
      color:'primary',
    },
    VTextField: {
      density: 'compact',
      rounded: true,
      placeholder: '',
      color: 'primary',
      clearIcon: 'fa-solid fa-xmark tw-text-[15px]',
      class: 'customTextField tw-text-k_black',
    },
    VRadio:{
      class:'tw-w-fit',
      hideDetails: true,
      color:'success',
    },
    VRadioGroup:{
      color:'success',
    },
    VTextarea: {
      rounded: 'tw-rounded-lg',
      color: 'primary',
      class: 'customTextarea',
    },
    VMenu : {
      contentClass : 'custom-menu',
    },
    VSelect: {
      density: 'compact',
      clearable: true,
      menuIcon: 'fa-solid fa-chevron-down tw-text-[15px]',
      persistentClear: true,
      clearIcon: 'fa-solid fa-xmark tw-text-[15px]',
      placeholder: 'انتخاب کنید...',
      color: 'primary',
      class: 'chipInMultiSelect tw-text-k_black',
      contentClass : 'custom-menu',
    },
    VMultiSelect: {
      density: 'compact',
      clearable: true,
      menuIcon: 'fa-solid fa-chevron-down tw-text-[15px]',
      persistentClear: true,
      clearIcon: 'fa-solid fa-xmark tw-text-[15px]',
      placeholder: 'انتخاب کنید...',
      chips: true,
      multiple: true,
      closableChips: true,
      color: 'primary',
      VChip: {
        closeIcon: 'fa-solid fa-xmark',
      },
      class:'chipInMultiSelect',
    },
    VAutocomplete: {
      density: 'compact',
      clearable: true,
      menuIcon: 'fa-solid fa-chevron-down tw-text-[15px]',
      persistentClear: true,
      clearIcon: 'fa-solid fa-xmark tw-text-[15px]',
      placeholder: 'انتخاب کنید...',
      chips: false,
      multiple: false,
      color: 'primary',
      VChip: {
        closeIcon: 'fa-solid fa-xmark',
      },
      class:'chipInMultiSelect',
    },
    VAppContainer : {
      class:"tw-p-[1rem] lg:tw-p-[2rem] xl:tw-p-[3rem] 2xl:tw-p-[4rem]",
    },
    VDataTableServer: {
      class:'vDataTableServerCustom tw-border tw-border-[#E9ECF6] tw-p-[10px]',
      style: 'border-radius: 20px',
      noDataText:'اطلاعاتی برای نمایش نیست',
    },
    VTable:{
      VChip: {
        variant:'outlined',
      },
    },
    VChipDocV: {
      variant: 'outlined',
      color: 'info',
      rounded: true,
    },
    VChipTable :{
      variant:"tonal",
      color:"info",
      rounded:"xl",
    },
    VChipDate :{
      variant:"tonal",
      class: 'VChipDate',
      color:"#e2e8ee",
      prependIcon : 'fa fa-calendar',
      rounded:"xl",
      size : 'large',
    },
    VCardDashboard: {
      class: 'vCardDashboard tw-grid tw-grid-cols-[1fr_120px] tw-grid-rows-[55px_1fr] tw-rounded-3xl tw-p-7 tw-min-h-[250px]',
      elevation: 0,
      rounded:'xl',
      VCardTitle: {
        class: 'tw-col-span-1 tw-row-span-1 tw-text-neutral-800 tw-font-semibold tw-flex tw-text-xl tw-relative -tw-top-px',
      },
      VCardItem : {
        class : 'tw-p-0 tw-pt-1 tw-flex tw-items-start',
      },
      VCardText: {
        class: 'tw-col-span-2 tw-row-span-1 tw-px-0 tw-py-0',
      },
      VCardActions: {
        class: 'tw-col-span-1 tw-row-span-1 tw-col-start-2 tw-row-start-1 justify-end tw-px-0 tw-py-0 tw-items-start',
        VBtn: {
          color: 'secondary',
          variant: 'text',
          class: 'tw-text-base',
        },
      },
    },
    VListItemPill: {
      class: 'vListItemPill tw-bg-[#F5F7FC] tw-p-1 tw-px-4 tw-rounded-3xl tw-mb-3 last:tw-mb-0 tw-gap-x-2',
      VListItemTitle: {
        class: 'tw-text-neutral-400 tw-font-normal tw-text-base',
      },
      VListItemSubtitle: {
        class: 'tw-text-neutral-800 tw-font-semibold tw-opacity-100 tw-text-lg tw-relative tw-top-[2px]',
      },
      VIcon: {
        class: '!tw-ms-0',
      },
    },
    VListItemPillLarge: {
      class: 'vListItemPill tw-bg-[#F5F7FC] tw-bg-slate-50 tw-p-1 tw-px-4 tw-rounded-3xl tw-mb-3 last:tw-mb-0 tw-gap-x-2',
      VListItemTitle: {
        class: 'tw-text-neutral-400 tw-font-normal tw-text-lg',
      },
      VListItemSubtitle: {
        class: 'tw-text-neutral-800 tw-font-semibold tw-opacity-100 tw-text-lg',
      },
      VIcon: {
        class: '!tw-ms-0',
      },
    },
    VSlideGroupFade : {
      class : 'vSlideGroupFade',
    },
    VCardDefault : {
      rounded : 'xl',
      class: 'tw-p-4',
      elevation: 0,
    },

    ...buttonsDefaults,
  },

  // theme: {
  //   themes: {
  //     light: {
  //       colors: {
  //         primary: '#1867C0',
  //         secondary: '#5CBBF6',
  //       },
  //     },
  //   },
  // },
  theme: {
    defaultTheme: 'myCustomLightTheme',
    themes: {
      myCustomLightTheme,
      defaultVuetify,
    },
    typography: {
      fontFamily: 'YEKAN-BAKH',
    },
  },
  icons: {
    defaultSet: 'fa',
    aliases,
    sets: {
      mdi,
      custom: customSVGs,
      fa,
    },
  },
})
