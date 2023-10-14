import { cookies } from 'next/headers';

function getSuperAdminStatus() {
  const adminStatus = cookies().get('adminstatus')?.value;

  return adminStatus === 'SuperAdmin';
}

export default getSuperAdminStatus;
