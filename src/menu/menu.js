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



export const menuItems =  [
  {
    title: 'داشبورد',
    icon : 'fa fa-dashboard',
    route : '/dashboard',
    requirePermit: [],
    requirePlugin: [],
    completelyDisable: false,
    lacksPermission: [],
    badgeKey: '',
  },
  {
    title: 'کاربران',
    icon : 'fa fa-users',
    route : '/dashboard/users',
    requirePermit: [],
    requirePlugin: [],
    completelyDisable: false,
    lacksPermission: [],
    badgeKey: '',
  },
  {
    title: 'تنظیمات',
    icon : 'fa fa-tools',
    requirePermit: [],
    requirePlugin: [],
    completelyDisable: false,
    lacksPermission: [],
    badgeKey: '',
    children : [
      {
        title: 'کلیات',
        route : 'dashboard/setting/general',
        requirePermit: [],
        requirePlugin: [],
        completelyDisable: false,
        lacksPermission: [],
        badgeKey: '',
      },
    ],
  },
]




