import SearchBar from "../ui/search-input";

export default async function Layout({ children }: { children: React.ReactNode }) {

  return (
    <div className="flex h-screen flex-col">
      <nav className="">
        <div>Articles</div>
        <div>Topics</div>
      </nav>
      <main className="w-full h-full mx-auto max-w-5xl px-4 py-2">
        {children}
      </main>
    </div>
  );
}