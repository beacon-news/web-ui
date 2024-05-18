import AppTitle from "./app-title";


export default function Footer() {

  return (
    <footer className="w-full h-18 bg-slate-700 bottom-0">
      <div className="flex justify-between items-center w-full h-full p-4">
        <AppTitle dark={true}/> 
        <div className="flex flex-col text-gray-400 text-xs">
          <p className="text-gray-300">Attributions:</p>
          <a 
            href="https://www.flaticon.com/free-icons/lighthouse" 
            title="lighthouse icons"
          >Lighthouse icon created by WiLLee CcC - Flaticon
          </a>
        </div>
      </div>
    </footer>
  )
}
