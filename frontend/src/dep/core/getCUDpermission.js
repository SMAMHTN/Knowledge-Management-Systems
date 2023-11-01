// import { cookies } from 'next/headers';
import { getCookie } from 'cookies-next';

function getCUDPermission() {
  const cudpermission = getCookie('cudpermission');
  if (cudpermission === true) {
    return 1;
  }
  return 2;
}

export default getCUDPermission;
