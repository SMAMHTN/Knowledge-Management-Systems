export const menuUser = [
  {
    id: 'user',
    title: 'User',
    link: '/user',
  },
  {
    id: 'roles',
    title: 'Roles',
    link: '/roles',
  },
  {
    id: 'activity-log',
    title: 'Activity Log',
    link: '/activity-log',
  },
];

export const menuDoc = [
  {
    id: 'article',
    title: 'Article',
    link: '/article',
  },
  {
    id: 'category',
    title: 'Category',
    link: '/category',
  },
  {
    id: 'permission',
    title: 'Permission',
    link: '/permission',
  },
];

export const dashboard = {
  id: 'dashboard',
  title: 'Dashboard',
  link: '/dashboard',
};

export const systemSetting = {
  id: 'settings',
  title: 'Settings',
  link: '/settings',
};

export const userSetting = {
  id: 'user-profile',
  title: 'Profile',
  link: '/dashboard/settings',
};

export const post = {
  id: 'article',
  title: 'article',
  link: '/article',
};

const defaultExport = userSetting;

export { defaultExport as default };
