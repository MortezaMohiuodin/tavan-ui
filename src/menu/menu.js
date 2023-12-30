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

const KARPOOSHEManagerItems =  [
  {
    title: 'همکاران',
    route: '/KARPOOSHE/basic/employees',
    requirePermit: [],
    requirePlugin: [],
    completelyDisable: false,
    lacksPermission: [],
    badgeKey: '',
  },
  {
    title: 'اطلاعات پایه ای',
    badgeKey: '',
    children: [
      {
        title: 'دپارتمان',
        route: '/KARPOOSHE/basic/department',
        requirePermit: [],
        requirePlugin: [],
        lacksPermission: [],
        completelyDisable: false,
        badgeKey: '',
      },
      {
        title: 'مدیریت دسترسی ها',
        route: '/KARPOOSHE/basic/roles',
        requirePermit: [],
        requirePlugin: [],
        lacksPermission: [],
        completelyDisable: false,
        badgeKey: '',
      },
      {
        title: 'پست سازمانی',
        route: '/KARPOOSHE/basic/organization',
        requirePermit: ['OrgPositionalManager'],
        requirePlugin: [],
        lacksPermission: [],
        completelyDisable: false,
        badgeKey: '',
      },
    ],
  },
  {
    title: 'تخصیص به همکار',
    badgeKey: '',
    children: [
      {
        title: 'دسترسی',
        route: '/KARPOOSHE/assign/role',
        requirePermit: ['SetRole'],
        requirePlugin: [],
        lacksPermission: [],
        completelyDisable: false,
        badgeKey: '',
      },
      {
        title: 'دپارتمان',
        route: '/KARPOOSHE/assign/department',
        requirePermit: ['SetDepartment'],
        requirePlugin: [],
        lacksPermission: [],
        completelyDisable: false,
        badgeKey: '',
      },
      {
        title: 'پست سازمانی',
        route: '/KARPOOSHE/assign/orgPosition',
        requirePermit: ['SetOrgPosition'],
        requirePlugin: [],
        lacksPermission: [],
        completelyDisable: false,
        badgeKey: '',
      },
      {
        title: 'تفویض اختیار',
        route: '/KARPOOSHE/assign/delegation',
        requirePermit: ['GrantPermission'],
        requirePlugin: ['GrantPermission'],
        lacksPermission: [],
        completelyDisable: false,
        badgeKey: '',
      },
      {
        title: 'مدیریت اطلاع رسانی',
        route: '/KARPOOSHE/assign/portal-messaging',
        requirePermit: ['NoticeManagment'],
        requirePlugin: ['NoticeManagment'],
        lacksPermission: [],
        completelyDisable: false,
        badgeKey: '',
      },
    ],
  },
  {
    title: 'گزارش ها',
    badgeKey: '',
    children: [
      {
        title: 'چارت سازمانی',
        route: '/KARPOOSHE/reports/department-chart',
        requirePermit: ['ShowKarposheReport'],
        requirePlugin: [],
        lacksPermission: [],
        completelyDisable: true,
        badgeKey: '',
      },
    ],
  },
]

const KARPOSHEEmployeeItems = [
  {
    title: 'کاربران',
    badgeKey: '',
    requirePermit:  [],
    requirePlugin: [],
    lacksPermission: [],
    completelyDisable: false,
    children: [
      {
        title: 'لیست کاربران',
        route: '/users',
        requirePermit: [],
        requirePlugin: [],
        lacksPermission: [],
        completelyDisable: true,
        badgeKey: '',
      },
    ],
  },
]



export const headCategories = [
  {
    title: 'مدیریت',
    subTitle: 'کلینیک',
    icon: 'custom:KARPOOSHE',
    requireProduct: [],
    subGroup: 'KARPOOSHE',
  },
]
export const menuItems = {
  KARPOOSHE: [
    ...KARPOSHEEmployeeItems,
  ],
}

