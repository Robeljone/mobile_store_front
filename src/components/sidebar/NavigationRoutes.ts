export interface INavigationRoute {
  name: string
  displayName: string
  meta: { icon: string }
  children?: INavigationRoute[]
}

export default {
  root: {
    name: '/',
    displayName: 'navigationRoutes.home',
  },
  routes: [
        {
      name: 'Management',
      displayName: 'Management',
      meta: {
        icon: 'bar_chart',
      },
      children: [
        {
          name: 'products',
          displayName: 'Products'
        },
        {
          name: 'customer',
          displayName: 'Customer',
        },
        {
          name: 'supplier',
          displayName: 'Supplier',
        },
        {
          name: 'brand',
          displayName: 'Brands',
        },
        {
          name: 'model',
          displayName: 'Model',
        },
      ],
    },
    {
      name: 'POS',
      displayName: 'POS',
      meta: {
        icon: 'settings',
      },
      children: [
        {
          name: 'sales',
          displayName: 'Sales',
        },
        {
          name: 'purchase',
          displayName: 'Purchase',
        }
      ],
    },
    {
      name: 'Reports',
      displayName: 'Reports',
      meta: {
        icon: 'credit_card',
      },
      children: [
        {
          name: 'sales_report',
          displayName: 'Sales Report',
        },
        {
          name: 'purchase_report',
          displayName: 'Purchase Report',
        }
      ],
    },
        {
      name: 'Settings',
      displayName: 'Settings',
      meta: {
        icon: 'settings',
      },
      children: [
        {
          name: 'users',
          displayName: 'Users',
        },
        {
          name: 'roles',
          displayName: 'Roles',
        },
        {
          name: 'permission',
          displayName: 'Permission',
        }
      ],
    }
  ] as INavigationRoute[],
}
