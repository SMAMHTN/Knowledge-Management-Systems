import UserProfileDropdown from './UserProfileDropdown';
import Sidebar from './Sidebar';
import ShowLogo, { CompanyName } from './ShowLogo';

function Navbar() {
  return (
    <>
      <nav className="fixed z-20 h-14 w-full items-center justify-between bg-white border-b border-gray-100 shadow px-4 text-sm hidden md:flex">
        <div className="flex cursor-pointer items-center gap-2 ">
          <ShowLogo maxWidth="40px" maxHeight="40px" />
          <CompanyName />
        </div>
        <div className="flex items-center gap-3 sm:gap-5">
          <UserProfileDropdown />
        </div>
      </nav>
      <Sidebar />
    </>
  );
}

export default Navbar;
