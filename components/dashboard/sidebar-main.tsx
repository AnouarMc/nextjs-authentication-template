"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Settings, User, ShieldCheck } from "lucide-react";

const items = [
  {
    title: "Manage Account",
    url: "#",
    icon: Settings,
    items: [
      {
        title: "Profile",
        icon: User,
        url: "/dashboard/profile",
      },
      {
        title: "Security",
        icon: ShieldCheck,
        url: "/dashboard/security",
      },
    ],
  },
];

const SidebarMain = () => {
  const { setOpenMobile } = useSidebar();
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={true}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem
                      key={subItem.title}
                      onClick={() => setOpenMobile(false)}
                    >
                      <SidebarMenuSubButton asChild>
                        <Link
                          href={subItem.url}
                          className={`flex items-center font-semibold ${
                            pathname === subItem.url
                              ? "bg-gray-200 text-primary hover:!bg-gray-200 hover:text-primary dark:bg-gray-800 dark:hover:!bg-gray-800"
                              : ""
                          }`}
                        >
                          {subItem.icon && (
                            <subItem.icon
                              className="text-primary"
                              color={
                                pathname === subItem.url
                                  ? "#2563EB"
                                  : "currentColor"
                              }
                            />
                          )}
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default SidebarMain;
