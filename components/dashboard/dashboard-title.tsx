"use client";

import { usePathname } from "next/navigation";

const DashboardTitle = () => {
  const pathname = usePathname();
  const title = pathname.split("/").filter(Boolean).at(-1);
  return <span>{title && title.charAt(0).toUpperCase() + title.slice(1)}</span>;
};

export default DashboardTitle;
