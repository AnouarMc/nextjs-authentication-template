import Logo from "@/components/logo";
import ThemeSwitcher from "@/components/theme-switcher";

import Link from "next/link";

const Navbar = async () => {
  return (
    <header className="p-4">
      <div className="max-w-6xl px-6 py-2 mx-auto rounded-full bg-white/30 dark:bg-black/30 border dark:border-gray-500/30 border-gray-500/30">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Logo width={24} />
          </Link>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
};
export default Navbar;
