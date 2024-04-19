"use client";

import { useState } from "react";

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
        <Tag text={text} key={index} selected={selected?.[index]} onToggled={(toggled) => onToggled?.(index, text, toggled)} />
        // <p 
        // key={index} 
        // className={`text-sm text-gray-600 bg-slate-300 px-2 py-1 rounded-md 
        // ${onToggled !== undefined ? "hover:cursor-pointer hover:bg-teal-800 hover:text-white" : ""}`} 
        // onClick={() => onToggled?.(index, text)}>{text}</p>
      ))}
    </div> 
  )
};

export function Tag({
  text,
  selected = false,
  onToggled = () => {},
} : {
  text: string,
  selected?: boolean,
  onToggled?: (toggled: boolean) => void,
}) {

  return (
    <p 
    className={`text-sm ${selected ? "bg-teal-800 text-white outline-teal-900" : "text-gray-600 bg-slate-300"}
    px-2 py-1 rounded-md
    hover:cursor-pointer hover:bg-teal-800 hover:text-white hover:opacity-90`} 
    onClick={
      () => {
        onToggled(!selected)
      }
    }>{text}</p>
  );
}
