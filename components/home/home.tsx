import HeroAnimation from "@/components/home/hero-animation";

import Link from "next/link";
import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row relative">
      <div className="p-12 space-y-6 lg:my-36 mx-auto lg:mx-0">
        <h1 className="text-4xl md:text-6xl/normal font-semibold max-w-2xl">
          Next.js Authentication Template
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-400 max-w-md">
          A simple Next.js template featuring authentication and user management
          using Auth.js
        </p>

        <div className="flex gap-x-4">
          <Button size="lg" asChild className="rounded-full">
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button
            variant="secondary"
            size="lg"
            asChild
            className="rounded-full"
          >
            <Link href="/sign-up">Sign up</Link>
          </Button>
        </div>
      </div>

      <div className="mx-auto mt-0 mb-32 lg:mt-32 lg:absolute right-0 -z-10">
        <HeroAnimation />
      </div>
    </div>
  );
};
export default Home;
