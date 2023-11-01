// import { cookies } from 'next/headers';
import { getCookie } from 'cookies-next';

function getSuperAdminStatus() {
  const adminStatus = getCookie('adminstatus');
  const CUDpermission = getCookie('cudpermission');
  if (adminStatus === 'SuperAdmin') {
    return 1;
  }
  if (adminStatus === 'Admin') {
    return 2;
  }
  if (adminStatus === 'User' && CUDpermission === 'true') {
    return 3;
  }
  return 99;
}

export default getSuperAdminStatus;
