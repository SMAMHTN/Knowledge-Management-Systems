import UserProfileDropdown from './UserProfileDropdown';
import Sidebar from './Sidebar';
import ShowLogo, { CompanyName } from './ShowLogo';
import getThemeCookiesValueAsync from '@/dep/core/getThemeCookiesValueAsync';

async function Navbar(themecolor) {
  // const theme = await getThemeCookiesValueAsync();
  const thm = themecolor;
  const secondaryColor = thm.theme.themecolor.secondary_color;
  return (
    <>
      <nav className="fixed z-20 h-14 w-full items-center justify-between bg-white text-black shadow px-4 text-sm hidden md:flex" style={{ backgroundColor: secondaryColor }}>

        <div className="flex cursor-pointer items-center gap-2 ">
          <ShowLogo maxWidth="40px" maxHeight="40px" />
          <CompanyName />
        </div>
        <div className="flex items-center gap-3 sm:gap-5">
          <UserProfileDropdown />
        </div>
      </nav>
      <Sidebar color={themecolor} />
    </>
  );
}

export default Navbar;
