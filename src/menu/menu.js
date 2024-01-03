/**
 Helper functions to skip repeating code.
 */
 function extractRequirePermits(array) {
  const requirePermits = []
  function traverse(children) {
    children.forEach(child=> {
      if (child.hasOwnProperty('requirePermit') && Array.isArray(child.requirePermit)) {
        requirePermits.push(...child.requirePermit)
      }
      if (child.hasOwnProperty('children') && Array.isArray(child.children)) {
        traverse(child.children)
      }
    })
  }
  traverse(array)

  return requirePermits
}

/**
 main menu items
*/

const MAINItems =  [
  {
    title: 'پنل کاربری',
    requirePermit: [],
    requirePlugin: [],
    completelyDisable: false,
    lacksPermission: [],
    badgeKey: '',
    children: [
      {
        title: 'داشبورد',
        route: '/dashboard',
        requirePermit: [],
        requirePlugin: [],
        lacksPermission: [],
        completelyDisable: false,
        badgeKey: '',
      },
      {
        title: 'کاربران',
        route: '/dashboard/users',
        requirePermit: [],
        requirePlugin: [],
        lacksPermission: [],
        completelyDisable: false,
        badgeKey: '',
      },
    ],
  },
]





export const headCategories = [
  {
    title: 'بخص اصلی',
    subTitle: 'مدیریت',
    icon: 'custom:user',
    requireProduct: [],
    subGroup: 'MAIN',
  },
]
export const menuItems = {
  MAIN: [
    ...MAINItems,
  ],
}

