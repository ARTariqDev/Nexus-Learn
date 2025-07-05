'use client'

import { useState, useEffect } from 'react';
import { Monoton } from 'next/font/google';

const monoton = Monoton({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

const PDF = ({ name, size, link1, link2, text1, text2, id }) => {

  const sizeMap = {
    '1': 'text-xl',
    '2': 'text-2xl',
    '3': 'text-3xl',
    '4': 'text-4xl',
    '5': 'text-5xl',
    '6': 'text-6xl',
  };

  const fontSize = sizeMap[size] || 'text-5xl'; // fallback to text-5xl if size not found

  return (
    <div className="relative group bg-[#111111] border-2 border-[#6c6c6c] rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex flex-col justify-between h-[17rem] w-[20rem] transform">
      <h2
        className={`${monoton.className} ${fontSize} text-[#ffaa00] text-center mb-4 break-words leading-snug mt-4 group-hover:glow transition-all duration-300 py-5`}
      >
        {name}
      </h2>

      <div className="mt-auto flex flex-col gap-2 ">
        <a
          href={link1}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#ffaa00] text-black font-semibold px-6 py-2 rounded-xl hover:bg-transparent hover:text-[#ffaa00] hover:border-2 hover:border-[#ffaa00] transition-all text-center"
        >
          {text1}
        </a>

        {link2 && text2 && (
          <a
            href={link2}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#ffaa00] text-black font-semibold px-6 py-2 rounded-xl hover:bg-transparent hover:text-[#ffaa00] hover:border-2 hover:border-[#ffaa00] transition-all text-center"
          >
            {text2}
          </a>
        )}
      </div>
    </div>
  );
};

export default PDF;
