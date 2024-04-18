"use client";

import React, { useEffect } from 'react';

export default function ErrorComponent({ 
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {

  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-4/5">
      <p className="text-lg text-gray-800 mb-2">Something went wrong...</p>
      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 hover:cursor-pointer"
      onClick={() => reset()}>Refresh</button>
    </div>
  );
}