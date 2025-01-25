import Logo from "@/components/logo";

import Link from "next/link";

const Navbar = async () => {
  return (
    <header className="border-b py-2">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-12">
          <Link
            href="/"
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Logo width={32} />
          </Link>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
