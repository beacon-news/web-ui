
export default function Tags({texts} : {texts: string[]}) {
  return (
    <div className="text-sm text-gray-600 flex flex-row">
      {texts.map(text => (
        <p className="bg-slate-300 text-sm px-2 py-1 m-2 rounded-md">{text}</p>
      ))}
    </div> 
  )
};