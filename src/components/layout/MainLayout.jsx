import HeaderMain from "./HeaderMain";
import FooterMain from "./FooterMain";

export default function MainLayout({ children, onCompanySelect }) {
  return (
    <>
      <HeaderMain onCompanySelect={onCompanySelect} />
      {children}
      <FooterMain />
    </>
  );
}
