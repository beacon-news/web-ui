import "react-datepicker/dist/react-datepicker.css";


export default function SearchBar({
  setQuery,
  optionsOpen = false,
  optionsClicked,
}: { 
  setQuery: (query: string) => void,
  optionsOpen: boolean,
  optionsClicked: () => void,
}) {

  return (
    <div className="w-full flex items-center bg-gray-50 outline outline-1 shadow-md shadow-gray-200 outline-gray-200 rounded-lg px-4 py-2">
      <input 
        type="text" 
        className="w-full outline-none bg-gray-50" 
        placeholder="Search"
        onChange={e => setQuery(e.target.value)}
      />
      <button 
        className={`ml-2 px-2 py-1 text-sm ${optionsOpen ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-500"} rounded-md hover:bg-blue-500 hover:text-white`}
        onClick={() => optionsClicked()}
      >
        Options
      </button>
    </div>
  );
};

