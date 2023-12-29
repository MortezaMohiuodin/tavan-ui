<template>
  <VCard title="sidebar">
    <VCardText>
      <h1>Understanding Hierarchy Sidebar Levels </h1>
      <p>
        <b>Level</b> 1 The application sidebar menu is organized into three levels.
        consists of product names such as 🍔 Karfood, 💄 Karposhe, and 🛠️ Karsal. Each of these represents a different product within the application.
        Moving to <b>Level 2</b>, we have head categories that provide a broader classification of the products. Examples of these categories include 📚 Base Knowledge, 📋 Assignment, and 📊 Report. These categories help users easily navigate and find the specific functionality they need within the selected product.
        Finally,<b>Level 3 </b> contains the actual menu items, further refining the options available to the user. The structure of each level is spatially organized, meaning that the arrangement of items within each level is designed to provide a logical flow and visual clarity in navigating the application.
      </p>
      <h1>Level 1 Structure</h1>
      <p />
      <Prism language="javascript">
        {{ `
 headCategories = [{
  title: 'کارساعت',
  subTitle: 'حضور و غیاب آنلاین',
  icon: 'custom:KARSAAT',
  requireProduct: ['KARSAAT'],
  subGroup: 'KARSAAT',
}]
` }}
      </Prism>
      <p> <b>SubGroup</b> is a property found within the headCategory object, which acts as a key that specifically points to one of the properties in the menu-item object. This particular property within the menu-item object consists of the product menu items, effectively grouping them together under a common identifier.</p>
      <h1>Level 2 Structure</h1>
      <p />
      <Prism language="javascript">
        {{ `
KARSAAT: [
    {
      title: 'اطلاعات پایه',
      badgeKey: '',
      children: []
    }
      ]
` }}
      </Prism>
      <p><b>badgeKey</b>  is a property within the menuItem object that stores the title value of the key property present in the badge object. The badge object itself is fetched from the server as part of the data retrieval process. </p>
      <h1>Level 3 Structure</h1>
      <Prism language="javascript">
        {{`{
            title: 'صفحه اول',
            route: '/a',
            requirePermit: [],
            requirePlugin: [],
            lacksPermission: [],
            completelyDisable: true,
            badgeKey: '',
},`}}
      </Prism>
      <p>
        <b>route</b> property can be a router object
        </p>
      <p>
        <b>requirePermit</b> All the required permissions to show menu items are consolidated within this array and it is essential for the user to have these permissions assigned by the administrator.
      </p>
       <p>
        <b>requirePlugin</b> All the necessary plugins are listed within this collection, allowing the user to view menu items in an active state. In case the user doesn't have the specified plugin, the corresponding menu item will be disabled to ensure a seamless user experience.
      </p>
<p>
  <b>lacksPermission</b> This property indicates that the menu item can only be activated if the user does not possess the specified permissions.
</p>
      <p>
        <b>completelyDisable</b> This property is exclusively used to disable the menu item, without taking into account any other conditions or factors.
      </p>
      <h1>sample</h1>
      <Prism  language="javascript">
        {{`
export const headCategories = [{
  title: 'کارساعت',
  subTitle: 'حضور و غیاب آنلاین',
  icon: 'custom:KARSAAT',
  requireProduct: ['KARSAAT'],
  subGroup: 'KARSAAT',
}]
export const menuItems = {
  KARSAAT: [
    {
      title: 'اطلاعات پایه',
      badgeKey: '',
      children: [
        {
          title: 'صفحه اول',
          route: '/a',
          requirePermit: [],
          requirePlugin: [],
          lacksPermission: [],
          completelyDisable: true,
          badgeKey: '',
        },
        {
          title: 'صفحه دوم',
          route: '/b',
          requirePermit: [],
          requirePlugin: [],
          lacksPermission: [],
          completelyDisable: false,
          badgeKey: '',
        },
      ],
    },
    {
      title: 'درخواست من',
      route: '/a/1',
      requirePermit: [],
      requirePlugin: [],
      completelyDisable: false,
      lacksPermission: [],
      badgeKey: '',
    },
  ],
}
`}}
      </Prism>
    </VCardText>
  </VCard>
</template>

<script setup>
import Prism from 'vue-prism-component'
</script>

<style scoped>

</style>
