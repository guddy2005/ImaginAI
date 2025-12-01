import React from 'react';
import { download } from '../assets';
import { downloadImage } from '../utils';

const Card = ({ _id, name, prompt, photo }) => (
  <div className="rounded-xl group relative shadow-lg hover:shadow-2xl transition-all duration-300 card border border-slate-700 hover:border-purple-500 overflow-hidden">
    {/* Image */}
    <img
      className="w-full h-auto object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
      src={photo}
      alt={prompt}
    />

    {/* Hover Overlay (Glass Effect) */}
    <div className="group-hover:flex flex-col max-h-[94.5%] hidden absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-md m-2 p-4 rounded-lg border border-white/10 animate-slide-up">
      <p className="text-white text-sm overflow-y-auto prompt font-light tracking-wide">{prompt}</p>

      <div className="mt-5 flex justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          {/* User Avatar */}
          <div className="w-8 h-8 rounded-full object-cover bg-gradient-to-r from-purple-500 to-pink-500 flex justify-center items-center text-white text-xs font-bold shadow-md">
            {name[0].toUpperCase()}
          </div>
          <p className="text-white text-sm font-medium">{name}</p>
        </div>

        {/* Download Button */}
        <button 
          type="button" 
          onClick={() => downloadImage(_id, photo)} 
          className="outline-none bg-transparent border-none hover:scale-110 transition-transform"
        >
          <img src={download} alt="download" className="w-6 h-6 object-contain invert" />
        </button>
      </div>
    </div>
  </div>
);

export default Card;