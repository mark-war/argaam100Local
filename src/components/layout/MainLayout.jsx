import HeaderMain from "./HeaderMain";
import FooterMain from "./FooterMain";

export default function MainLayout({ children }) {
  return (
    <>
      <HeaderMain />
      {children}
      <FooterMain />
    </>
  );
}
