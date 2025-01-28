"use client";

import { cn } from "@/lib/utils";
import Logo from "@/components/logo";
import { Icons } from "@/components/home/hero-icons";

const data = [
  {
    icon: <Icons.nextjs />,
    title: "React Framework",
    subtitle: "Next.js",
    classes: "",
    svgClasses: "left-[14px]",
    beamClasses:
      "bg-[conic-gradient(from_280deg,_rgb(0,_0,_0)_6%,_#0000_14%,_#0000_100%)] dark:bg-[conic-gradient(from_280deg,_rgb(255,_255,_255)_6%,_#0000_14%,_#0000_100%)]",
  },
  {
    icon: <Icons.shadcn />,
    title: "UI Framework",
    subtitle: "Shadcn",
    classes: "flex-row-reverse text-right",
    svgClasses: "right-[14px] -scale-x-100",
    beamClasses:
      "delay-1000 bg-[conic-gradient(from_280deg,_rgb(0,_0,_0)_6%,_#0000_14%,_#0000_100%)] dark:bg-[conic-gradient(from_280deg,_rgb(255,_255,_255)_6%,_#0000_14%,_#0000_100%)]",
  },
  {
    icon: <Icons.backend />,
    title: "Backend",
    subtitle: "Prisma",
    classes: "",
    svgClasses: "left-[14px] -scale-y-100 bottom-full",
    beamClasses:
      "delay-1000 bg-[conic-gradient(from_280deg,_#1D4E6C_6%,_#0000_14%,_#0000_100%)] dark:bg-[conic-gradient(from_280deg,_#ffffff_6%,_#0000_14%,_#0000_100%)]",
  },
  {
    icon: <Icons.authjs />,
    title: "Authentication",
    subtitle: "Auth.js",
    classes: "flex-row-reverse text-right",
    svgClasses: "right-[14px] -scale-y-100 -scale-x-100 bottom-full",
    beamClasses:
      "bg-[conic-gradient(from_280deg,_#1DBBF1_6%,_#AC1EE3_14%,_#0000_20%)]",
  },
];

const HeroAnimation = () => {
  return (
    <div className="p-2 sm:p-6 bg-gray-50 dark:bg-[#1C1C2E] rounded-xl relative max-w-max">
      <svg className="pointer-events-none absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30 [mask-image:radial-gradient(circle,_white,_transparent_70%)]">
        <defs>
          <pattern
            id="id"
            width={40}
            height={40}
            patternUnits="userSpaceOnUse"
            x={-1}
            y={-1}
          >
            <path d="M.5 40V.5H40" fill="none" strokeDasharray={-1} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" strokeWidth={0} fill="url(#id)" />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={0}
        height={0}
        viewBox="0 0 169 97"
      >
        <clipPath id="beam-clip">
          <path d="m169,97H55.63c-4.54,0-8.81-1.77-12.02-4.98L4.98,53.39c-3.21-3.21-4.98-7.48-4.98-12.02V0h2v41.37c0,4.01,1.56,7.77,4.39,10.61l38.63,38.63c2.83,2.83,6.6,4.39,10.61,4.39h113.37v2Z" />
        </clipPath>
      </svg>
      <div className="flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 ">
        <Logo width={48} className="dark:drop-shadow-[0_0_15px_#db2979]" />
      </div>
      <div className="grid grid-cols-2 grid-rows-2 gap-y-52 sm:gap-y-64 gap-x-24 sm:gap-x-28">
        {data.map((item) => (
          <div
            key={item.title}
            className="w-28 sm:w-[200px] rounded-full relative"
          >
            <div
              className={cn(
                "px-4 py-2.5 bg-white dark:bg-[#191927] border border-gray-300 dark:border-gray-800 rounded-full relative flex items-center gap-x-2",
                item.classes
              )}
            >
              <div>{item.icon}</div>
              <div className="">
                <p className="hidden sm:block text-gray-600 dark:text-gray-400 uppercase text-xs font-semibold">
                  {item.title}
                </p>
                <p className="text-sm">{item.subtitle}</p>
              </div>
            </div>
            <svg
              width={200}
              height={100}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 169 97"
              className={cn(
                "stroke-gray-300 dark:stroke-gray-700 absolute",
                item.svgClasses
              )}
              fill="none"
            >
              <path
                d="m1,0v41.37c0,4.24,1.69,8.31,4.69,11.31l38.63,38.63c3,3,7.07,4.69,11.31,4.69h113.37"
                strokeWidth={2}
                stroke="currentStroke"
              />

              <foreignObject
                width="100%"
                height="100%"
                clipPath="url(#beam-clip)"
              >
                <div
                  className={cn(
                    "absolute left-[-15px] -top-[92px] w-[220px] rounded-full h-[220px] will-change-transform animate-beam",
                    item.beamClasses
                  )}
                ></div>
              </foreignObject>
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroAnimation;
