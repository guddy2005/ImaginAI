import React, { useEffect, useState } from 'react';
import { Card, FormField, Loader } from '../components';

const RenderCards = ({ data, title }) => {
  if (data?.length > 0) {
    return data.map((post) => <Card key={post._id} {...post} />);
  }
  return (
    <h2 className="mt-5 font-bold text-[#6469ff] text-xl uppercase tracking-widest">{title}</h2>
  );
};

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchedResults, setSearchedResults] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      // LIVE BACKEND URL (Deploy karne ke baad yahan live link aayega)
      // Abhi ke liye localhost
      const response = await fetch('http://localhost:8080/api/v1/post', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const result = await response.json();
        setAllPosts(result.data.reverse());
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);
    setSearchTimeout(
      setTimeout(() => {
        const searchResult = allPosts.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()) || item.prompt.toLowerCase().includes(searchText.toLowerCase()));
        setSearchedResults(searchResult);
      }, 500),
    );
  };

  return (
    <section className="max-w-7xl mx-auto min-h-screen">
      
      {/* HERO SECTION - Different from Create Page */}
      <div className="text-center py-16 px-4 bg-[#1e293b]/50 rounded-3xl mb-10 border border-slate-700 shadow-2xl">
        <h1 className="font-extrabold text-white text-[48px] md:text-[60px] leading-tight">
          The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">Global Art Gallery</span>
        </h1>
        <p className="mt-4 text-slate-300 text-[18px] max-w-2xl mx-auto font-light">
          Discover thousands of AI-generated masterpieces created by the <span className="font-semibold text-white">ImaginAI</span> community.
        </p>

        {/* SEARCH BAR - Integrated in Hero */}
        <div className="mt-10 max-w-xl mx-auto">
          <FormField
            labelName=""
            type="text"
            name="text"
            placeholder="🔍 Search for robots, space, cats..."
            value={searchText}
            handleChange={handleSearchChange}
          />
        </div>
      </div>

      {/* GALLERY GRID */}
      <div className="mt-10">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : (
          <>
            {searchText && (
              <h2 className="font-medium text-slate-400 text-xl mb-6 ml-2">
                Showing results for <span className="text-white font-bold">"{searchText}"</span>
              </h2>
            )}
            
            <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-6">
              {searchText ? (
                <RenderCards data={searchedResults} title="No Art Found" />
              ) : (
                <RenderCards data={allPosts} title="No Posts Yet" />
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Home;