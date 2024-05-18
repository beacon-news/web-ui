import Link from "next/link";
import lightHouse from "./assets/lighthouse.png";
import Image from "next/image";
import clsx from "clsx";

const APP_TITLE = "Beacon";

export default function AppTitle({dark = false}: {dark?: boolean}) {

  return (
    <div className="ml-4 md:ml-0 flex gap-x-3 items-center">
      <Image
        src={lightHouse}
        alt="Beacon Logo"
        style={{ width: "1.8rem"}}
      />
      <h1 className={clsx(
        "font-bold text-black text-2xl",
        dark ? "text-gray-500" : "text-black",
      )}>
        <Link href={"/"}>{APP_TITLE}</Link>
      </h1>
    </div>
  );
}
