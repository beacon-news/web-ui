"use client";

import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

const links = [
  { 
    name: "Articles", 
    href: "/articles" 
  },
  { 
    name: "Topics", 
    href: "/topics" 
  },
  {
    name: "Topic Batches",
    href: "/topic-batches",
  },
];

export const makeTopicArticlesLink = (topic: { id: string }) => {
  return `/topics/${topic.id}/articles`;
}

export default function Layout({ children }: { children: React.ReactNode }) {

  const pathName = usePathname();

  console.log(pathName);
  

  return (
    <>
      <header className="flex flex-no-wrap fixed top-0 w-full z-10 bg-white shadow-md shadow-black/5 justify-between px-4 pt-4 pb-4">
        <h1 className="font-bold text-black text-3xl">Title here</h1>
        <nav className="flex justify-center gap-x-4">
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
      <main className="w-full h-full flex flex-col mx-auto max-w-7xl px-4 md:mt-28">
        <Suspense fallback={<div className="w-full h-full mx-auto text-lg">Loading...</div>}>
        {children}
        </Suspense>
      </main>
    </>
  );
}