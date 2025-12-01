import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { preview } from '../assets';
import { getRandomPrompt } from '../utils';
import { FormField, Loader } from '../components';

const CreatePost = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', prompt: '', photo: '' });
  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- LOGIC: Generate Image from Local Backend ---
  const generateImage = async () => {
    if (form.prompt) {
      try {
        setGeneratingImg(true);
        const response = await fetch('http://localhost:8080/api/v1/dalle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: form.prompt }),
        });

        const data = await response.json();
        setForm({ ...form, photo: data.photo });
      } catch (err) {
        alert("Backend Error: Ensure Server is running on port 8080");
      } finally {
        setGeneratingImg(false);
      }
    } else {
      alert('Please provide a prompt first');
    }
  };

  // --- LOGIC: Share to Community (Save to DB) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.prompt && form.photo) {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/v1/post', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form }),
        });
        await response.json();
        navigate('/');
      } catch (err) {
        alert(err);
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please generate an image first');
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };

  return (
    <section className="max-w-7xl mx-auto flex flex-col items-center">
      <div className="text-center mb-10">
        <h1 className="font-extrabold text-[#222328] text-[32px]">Create with <span className="text-[#6469ff]">ImaginAI</span></h1>
        <p className="mt-2 text-[#666e75] text-[16px] max-w-[500px]">
          Turn your wildest imagination into reality. Enter a prompt and let AI do the magic.
        </p>
      </div>

      <form className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-xl border border-gray-100" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <FormField
            labelName="Your Name"
            type="text"
            name="name"
            placeholder="Ex., Guddy Thakur"
            value={form.name}
            handleChange={handleChange}
          />

          <FormField
            labelName="Prompt"
            type="text"
            name="prompt"
            placeholder="A futuristic city with flying cars in neon lights..."
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />

          {/* IMAGE PREVIEW BOX - IMPROVED DESIGN */}
          <div className="relative bg-gray-50 border-2 border-dashed border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 w-full h-80 flex justify-center items-center overflow-hidden transition-all hover:border-[#6469ff]">
            {form.photo ? (
              <img src={form.photo} alt={form.prompt} className="w-full h-full object-contain" />
            ) : (
              <img src={preview} alt="preview" className="w-1/3 object-contain opacity-40" />
            )}

            {generatingImg && (
              <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] backdrop-blur-sm rounded-xl">
                <Loader />
              </div>
            )}
          </div>
        </div>

        {/* BUTTONS */}
        <div className="mt-8 flex gap-5 justify-center">
          <button
            type="button"
            onClick={generateImage}
            className="text-white bg-green-600 font-bold rounded-full text-sm w-full sm:w-auto px-8 py-3 text-center hover:bg-green-700 shadow-lg transition-transform active:scale-95"
          >
            {generatingImg ? 'Generating...' : 'Generate Image 🎨'}
          </button>
        </div>

        <div className="mt-8 text-center border-t pt-6">
          <p className="text-[#666e75] text-[14px]">** Happy with the result? Share it with the world! **</p>
          <button
            type="submit"
            className="mt-4 text-white bg-[#6469ff] font-bold rounded-full text-sm w-full sm:w-auto px-8 py-3 text-center hover:bg-[#5359e6] shadow-md transition-transform active:scale-95"
          >
            {loading ? 'Sharing...' : 'Share with Community 🚀'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;