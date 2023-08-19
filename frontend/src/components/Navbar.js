import UserProfileDropdown from './UserProfileDropdown';
import ShowLogo from './ShowLogo';

function Navbar() {
  return (
    <nav className="flex flex-col flex-auto antialiased flex-shrink-0">
      <div className="fixed w-full flex items-center justify-between h-14 text-white z-20 bg-white border-b border-gray-100 shadow">
        <div className="flex items-center justify-start md:justify-center pl-3 w-14 md:w-64 h-14">
          <div className="flex items-center h-9 object-contain">
            <ShowLogo maxWidth="40px" maxHeight="40px" />
            <span className="hidden md:block ml-2 text-gray-600">Admin</span>
          </div>
        </div>
        <div className="flex justify-between items-center h-14 header-right">
          <ul className="flex items-center">
            <li>
              <UserProfileDropdown />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
