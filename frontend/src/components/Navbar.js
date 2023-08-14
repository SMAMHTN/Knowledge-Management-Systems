import UserProfileDropdown from './UserProfileDropdown';
import ShowLogo from './ShowLogo'; // Import the ShowLogo component

function Navbar() {
  return (
    <nav className="flex flex-col flex-auto antialiased flex-shrink-0">
      <div className="fixed w-full flex items-center justify-between h-14 text-white z-10 bg-white">
        <div className="flex items-center justify-start md:justify-center pl-3 w-14 md:w-64 h-14">
          <div className="flex items-center h-9 object-contain">
            <ShowLogo maxWidth="40px" maxHeight="40px" />
            <span className="hidden md:block ml-2 text-gray-600">Admin</span>
          </div>
        </div>
        <div className="flex justify-between items-center h-14 header-right">
          <div className="rounded flex items-center w-full max-w-xl mr-4 p-2 shadow-sm border border-blue-700">
            <button className="outline-none focus:outline-none">
              <svg
                className="w-5 text-gray-600 h-5 cursor-pointer"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <input
              type="search"
              name=""
              id=""
              placeholder="Search"
              className="w-full pl-3 text-sm text-black outline-none focus:outline-none bg-transparent"
            />
          </div>
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
