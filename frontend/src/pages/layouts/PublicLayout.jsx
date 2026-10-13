import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import AmbientGlow from "../components/AmbientGlow.jsx";
import HeartField from "../components/HeartField.jsx";

export default function PublicLayout({ children, hideNavbar = false }) {
  return (
    <div className="site-wrap">
      <AmbientGlow />
      <HeartField count={12} />
      {!hideNavbar && <Navbar />}
      <main>{children}</main>
      <Footer />
    </div>
  );
}
