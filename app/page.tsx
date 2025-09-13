"use client";

import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import { motion } from "motion/react";
import Link from "next/link";

export default function HeroSectionOne() {
  const { isSignedIn } = useUser();

  const handleClick = () => {
    if (!isSignedIn) {
      window.location.href = "/sign-in";
    } else {
      window.location.href = "/dashboard";
    }
  };
  return (
    <div className="relative my-2 flex flex-col items-center justify-center">
      <Navbar />
      <div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="px-4 py-20 md:py-30 lg:py-35">
        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl my-4 font-bold text-slate-700 md:text-4xl lg:text-6xl dark:text-slate-300">
          {"Your Healthcare Companion, Listening and Guiding with Care"
            .split(" ")
            .map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
                className="mr-2 inline-block"
              >
                {word}
              </motion.span>
            ))}
        </h1>
        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 0.8,
          }}
          className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-neutral-600 dark:text-neutral-400"
        >
          Speak or type your symptoms, get real-time answers from AI, track your
          health, and access care like never before, all in one secure and
          intelligent assistant.
        </motion.p>
        <Link href={isSignedIn ? "/dashboard" : "/sign-in"}>
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.3,
              delay: 1,
            }}
            className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <button className="w-60 transform rounded-lg cursor-pointer bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
              Explore Now
            </button>
          </motion.div>
        </Link>
      </div>
    </div>
  );
}

const Navbar = () => {
  const { user } = useUser();

  return (
    <nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
      <div className="flex items-center gap-2 cursor-pointer">
        <div className="size-7 rounded-full bg-gradient-to-br from-blue-500 to-white" />
        <h1 className="text-base font-semibold md:text-2xl">Auracare AI</h1>
      </div>
      {!user ? (
        <Link href={"/sign-in"}>
          <button className="w-24 transform cursor-pointer rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 md:w-32 dark:bg-white dark:text-black dark:hover:bg-gray-200">
            Login
          </button>
        </Link>
      ) : (
        <div className="flex items-center gap-5">
          <Link href={"/dashboard"}>
            <Button className="cursor-pointer">Dashboard</Button>
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      )}
    </nav>
  );
};
