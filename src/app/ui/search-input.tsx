export default function SearchBar({ setQuery }: { setQuery: (query: string) => void }) {

  return (
    <div className="flex items-center">
      <input
        type="text"
        placeholder="Search..."
        className="border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
        onChange={e => setQuery(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg"
      >
        Search
      </button>
    </div>
  );
};
