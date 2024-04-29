import { Suspense } from "react";
import Header from "../ui/header";

export const links = [
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

  return (
    <>
      <Header />
      <main className="w-full h-full flex flex-col mx-auto max-w-7xl px-4 mt-8 md:mt-14">
        <Suspense fallback={<div className="w-full h-full mx-auto text-lg">Loading...</div>}>
          {children}
        </Suspense>
      </main>
    </>
  );
}
