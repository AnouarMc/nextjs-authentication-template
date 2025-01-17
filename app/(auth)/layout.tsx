import EmailProvider from "@/providers/email-provider";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <EmailProvider>{children}</EmailProvider>;
};
export default Layout;
