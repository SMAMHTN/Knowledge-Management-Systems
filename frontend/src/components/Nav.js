import Navbar from '@/components/Navbar/Navbar';
import NavbarMobile from '@/components/Navbar/NavbarMobile';

function Nav(themecolor) {
  console.log('color runntin----------------------------------------------------------------------------------------------------------------------------------', themecolor);
  return (
    <div>
      <Navbar theme={themecolor} />
      <NavbarMobile theme={themecolor} />
    </div>
  );
}

export default Nav;
