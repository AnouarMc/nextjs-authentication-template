import Navbar from "@/components/navbar";
import AuthProvider from "@/providers/auth-provider";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <Navbar />
      <div className="mt-16">{children}</div>
    </AuthProvider>
  );
};
export default Layout;
