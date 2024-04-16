import SettingsCog from "./icons/settings-cog";

export default function SearchBar({ onInputChanged }: { onInputChanged: (query: string) => void }) {

  return (
    <div className="flex items-center bg-gray-50 outline outline-1 shadow-md shadow-gray-200 outline-gray-200 rounded-lg px-4 py-2 mx-12 w-80 md:w-3/5">
      <input 
        type="text" 
        className="w-full outline-none bg-gray-50" 
        placeholder="Search"
        onChange={e => onInputChanged(e.target.value)}
      />
      <button className="ml-2">
        <SettingsCog className="text-black w-5 h-5" />
      </button>
    </div>
  );
};
