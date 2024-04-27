import clsx from "clsx";

export default function Tags({
  texts, 
  selected = undefined,
  onToggled = undefined,
} : {
  texts: string[],
  selected: boolean[] | undefined,
  onToggled: ((index: number, text: string, toggled: boolean) => void) | undefined,
}) {

  return (
    <div className="flex flex-row gap-3 flex-wrap">
      {texts.map((text, index) => (
        <Tag 
          text={text} 
          key={index} 
          selected={selected?.[index]} 
          onToggled={onToggled ? (toggled) => onToggled(index, text, toggled) : undefined} />
      ))}
    </div> 
  )
};

export function Tag({
  text,
  selected = false,
  onToggled = undefined,
} : {
  text: string,
  selected?: boolean,
  onToggled?: (toggled: boolean) => void,
}) {

  return (
    <p 
    className={clsx("text-sm px-2 py-1 rounded-md", 
    selected ? "bg-teal-800 text-white outline-teal-900" : "text-gray-600 bg-slate-300",
    {
      "hover:cursor-pointer hover:bg-teal-800 hover:text-white hover:opacity-90" : onToggled !== undefined
    },
    )}
    onClick={
      () => {
        onToggled?.(!selected)
      }
    }>{text}</p>
  );
}
