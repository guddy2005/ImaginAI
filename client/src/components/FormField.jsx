import React from 'react';

const FormField = ({
  labelName,
  type,
  name,
  placeholder,
  value,
  handleChange,
  isSurpriseMe,
  handleSurpriseMe,
}) => (
  <div>
    <div className="flex items-center gap-2 mb-2">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-300 tracking-wide"
      >
        {labelName}
      </label>
      {isSurpriseMe && (
        <button
          type="button"
          onClick={handleSurpriseMe}
          className="font-semibold text-xs bg-[#6469ff]/20 text-[#6469ff] py-1 px-2 rounded-[5px] hover:bg-[#6469ff] hover:text-white transition-colors border border-[#6469ff]/50"
        >
          Surprise me ✨
        </button>
      )}
    </div>
    
    {/* Modern Dark Input Field */}
    <input
      type={type}
      id={name}
      name={name}
      className="bg-[#1e293b] border border-slate-600 text-white text-sm rounded-xl focus:ring-[#6469ff] focus:border-[#6469ff] outline-none block w-full p-4 placeholder-slate-500 shadow-sm transition-all focus:shadow-[#6469ff]/20"
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      required
    />
  </div>
);

export default FormField;