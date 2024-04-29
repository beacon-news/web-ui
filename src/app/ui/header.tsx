"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { links } from "../(pages)/layout";
import Link from "next/link";
import clsx from "clsx";


export default function Header() {

  const pathName = usePathname();

  const [navVisible, setNavVisible] = useState(false);

  return (
    <>
      <header 
        className="flex flex-no-wrap relative top-0 w-full z-10 bg-neutral-100
        shadow-md shadow-black/5 justify-between px-4 pt-4 pb-4"
      >
        <div className="flex items-center justify-between gap-x-2">
          <HamburgerMenu 
            open={navVisible}
            onClick={() => setNavVisible(!navVisible)} 
          />

          <h1 className="font-bold text-black text-3xl ml-4 md:ml-0">Title here</h1>
        </div>

        <nav className="hidden md:flex md:justify-center md:gap-x-4">
          <NavLinks links={links} currentPath={pathName} />
        </nav>
      </header>

      {/* mobile navbar displayed outside of the header */}
      {navVisible &&
        <MobileNav>
          <NavLinks links={links} currentPath={pathName} />
        </MobileNav>
      }
    </>
  );
}

export const NavLinks = ({ links, currentPath }: { links: { name: string, href: string }[], currentPath: string }) => {
  return (
    <>
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className={clsx("text-md px-4 py-1 rounded-md hover:text-blue-600 transition-colors",
            {
              "text-blue-600": currentPath === link.href,
              "text-gray-700": currentPath !== link.href,
            }
          )}
        >{link.name}</Link> 
      ))}
    </>
  )
}

export const HamburgerMenu: React.FC<{ open: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>> = (
  { 
    open,
    ...props
  }
) => {

  return(
    <>
      <button
        className="flex flex-col justify-center items-center gap-y-1 md:hidden transition-all"
        {...props}
      >
        <span className={clsx(
          "w-6 h-1 bg-black transition-transform",
          open && "rotate-45 translate-y-2"
        )}>
        </span>
        <span className={clsx(
          "w-6 h-1 bg-black transition-transform",
          open && "invisible"
        )}>
        </span>
        <span className={clsx(
          "w-6 h-1 bg-black transition-transform",
          open && "-rotate-45 -translate-y-2"
        )}>
        </span>
      </button>
    </>
  )
};

export function MobileNav({ children }: { children: React.ReactNode }) {

  return (
    <nav 
      className="flex flex-col items-center gap-y-2 py-3 text-lg bg-neutral-100 md:hidden"
    >
      {children}
    </nav>
  );
}