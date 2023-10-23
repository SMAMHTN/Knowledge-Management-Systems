// import { cookies } from 'next/headers';
import { getCookie } from 'cookies-next';

function getSuperAdminStatus() {
  const adminStatus = getCookie('adminstatus');
  if (adminStatus === 'SuperAdmin') {
    return 1;
  }
  if (adminStatus === 'Admin') {
    return 2;
  }
  return 99;
}

export default getSuperAdminStatus;
