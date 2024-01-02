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

const UserItems =  [
  {
    title: 'همکاران',
    route: '/employees',
    requirePermit: [],
    requirePlugin: [],
    completelyDisable: false,
    lacksPermission: [],
    badgeKey: '',
    children: [
      {
        title: 'لیست',
        route: '/employees/list',
        requirePermit: [],
        requirePlugin: [],
        lacksPermission: [],
        completelyDisable: false,
        badgeKey: '',
      },
    ],
  },
  {
    title: 'اطلاعات پایه ای',
    badgeKey: '',
    children: [
      {
        title: 'کاربران',
        route: '/basic/users',
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
    title: 'بخش کاربران',
    subTitle: 'مدیریت کاربران',
    icon: 'custom:user',
    requireProduct: [],
    subGroup: 'USER',
  },
]
export const menuItems = {
  USER: [
    ...UserItems,
  ],
}

