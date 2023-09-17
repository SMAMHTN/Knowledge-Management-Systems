import "../styles/global.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer";

export default function MyApp({ Component, pageProps }) {
  return (
      <Component {...pageProps} />
  );
}
