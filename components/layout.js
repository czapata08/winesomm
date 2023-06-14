import NavHeader from "./navheader";

const Layout = ({ children }) => {
  return (
    <div className='flex flex-col min-h-screen'>
      <NavHeader />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
