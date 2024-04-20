"use client";

import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { ChevronUp } from './chevrons';


export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false)

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility)

    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [])

  return (
    <div 
      className={clsx(
        "fixed bottom-4 right-4 transition-all",
        isVisible ? "visible" : "invisible"
      )}
    >
      <button
        type="button"
        onClick={scrollToTop}
      >
        <ChevronUp 
          className="h-12 w-12 p-1 text-gray-500 rounded-md bg-gray-200 
          shadow-lg shadow-gray-300 hover:bg-gray-400 hover:cursor-pointer hover:text-white" 
        />
      </button>
    </div>
  )
}