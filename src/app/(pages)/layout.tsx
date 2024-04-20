"use client";

import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";

const links = [
  { 
    name: "Articles", 
    href: "/articles" 
  },
  { 
    name: "Topics", 
    href: "/topics" 
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {

  const pathName = usePathname();

  console.log(pathName);
  

  return (
    <>
      <header className="flex flex-col items-center my-4 md:mt-8 md:mb-6 gap-y-4 md:gap-y-8">
        <h1 className="font-bold text-black text-3xl">Title here</h1>
        <nav className="flex w-full justify-center gap-x-4 md:gap-x-8">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                'text-md text-gray-800 bg-blue-100 px-4 py-1 rounded-lg outline outline-1 outline-gray-200 hover:bg-blue-300 transition-colors',
                {
                  'bg-blue-300': pathName === link.href,
                }
              )}
            >{link.name}</Link> 
          ))}
        </nav>
      </header>
      <main className="w-full h-full flex flex-col mx-auto max-w-5xl px-4 py-2">
        {children}
      </main>
    </>
  );
}