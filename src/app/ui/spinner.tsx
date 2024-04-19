import React from "react";

const Spinner: React.FC<React.HTMLAttributes<HTMLDivElement>> = () => {
  return ( 
    <div
    className="border-gray-300 h-8 w-8 rounded-full border-4 border-t-gray-700 animate-spin"
    ></div>
  );
}

export default Spinner;