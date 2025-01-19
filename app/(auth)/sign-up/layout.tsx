import LoadingStateProvider from "@/providers/loading-state-provider";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <LoadingStateProvider>{children}</LoadingStateProvider>;
};

export default Layout;
