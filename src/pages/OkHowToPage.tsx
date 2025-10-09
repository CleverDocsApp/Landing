import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import OkHowToHero from '../components/OkHowTo/OkHowToHero';
import SearchBar from '../components/OkHowTo/SearchBar';
import CategoryFilter from '../components/OkHowTo/CategoryFilter';
import VideoGrid from '../components/OkHowTo/VideoGrid';
import './OkHowToPage.css';

interface Category {
  slug: string;
  name: string;
  description: string;
}

interface Video {
  id: string | number;
  title: string;
  description: string;
  category: string;
  thumb: string;
  duration?: number;
}

interface OkHowToData {
  categories: Category[];
  videos: Video[];
}

const OkHowToPage: React.FC = () => {
  const [data, setData] = useState<OkHowToData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedVideoId, setExpandedVideoId] = useState<string | number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await import('../data/okhowto.json');
        setData(response.default);
      } catch (err) {
        console.error('Error loading video data:', err);
        setError('Failed to load videos. Please try again later.');
      }
    };

    loadData();
  }, []);

  const filterVideos = useCallback((): Video[] => {
    if (!data) return [];

    let filtered = data.videos;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((video) => video.category === selectedCategory);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (video) =>
          video.title.toLowerCase().includes(term) ||
          video.description.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [data, selectedCategory, searchTerm]);

  const handleVideoToggle = (videoId: string | number) => {
    setExpandedVideoId((prevId) => (prevId === videoId ? null : videoId));
  };

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    setExpandedVideoId(null);
  };

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setExpandedVideoId(null);
  }, []);

  const getVideoCounts = (): Record<string, number> => {
    if (!data) return {};

    const counts: Record<string, number> = {};
    data.categories.forEach((category) => {
      counts[category.slug] = data.videos.filter(
        (video) => video.category === category.slug
      ).length;
    });

    return counts;
  };

  if (error) {
    return (
      <div className="okhowto-page">
        <Header />
        <main className="okhowto-main">
          <div className="error-container">
            <h2 className="error-title">Oops! Something went wrong</h2>
            <p className="error-message">{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="okhowto-page">
        <Header />
        <main className="okhowto-main">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading videos...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const filteredVideos = filterVideos();
  const videoCounts = getVideoCounts();
  const hasActiveFilters = selectedCategory !== 'all' || searchTerm.trim() !== '';

  return (
    <div className="okhowto-page">
      <Header />
      <main className="okhowto-main">
        <OkHowToHero />

        <section className="okhowto-content">
          <div className="container mx-auto px-4 py-12">
            <SearchBar onSearch={handleSearch} />

            <CategoryFilter
              categories={data.categories}
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategoryChange}
              videoCounts={videoCounts}
            />

            {hasActiveFilters && (
              <div className="results-info">
                <p className="results-count">
                  {filteredVideos.length} {filteredVideos.length === 1 ? 'video' : 'videos'} found
                </p>
              </div>
            )}

            <VideoGrid
              videos={filteredVideos}
              expandedVideoId={expandedVideoId}
              onVideoToggle={handleVideoToggle}
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default OkHowToPage;
