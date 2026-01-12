import React, { useState, useEffect, useCallback } from 'react';
import Footer from '../components/Footer/Footer';
import OkHowToHeader from '../components/OkHowTo/OkHowToHeader';
import OkHowToHero from '../components/OkHowTo/OkHowToHero';
import SearchBar from '../components/OkHowTo/SearchBar';
import CategoryFilter from '../components/OkHowTo/CategoryFilter';
import VideoGrid from '../components/OkHowTo/VideoGrid';
import VideoLightbox from '../components/OkHowTo/VideoLightbox';
import { FEED_URL, isRemoteModeEnabled, onRemoteModeChange } from '../config/okhowto.runtime';
import { normalizeList } from '../utils/okhowto/normalize';
import localDataImport from '../data/okhowto.json';
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
  const [lightboxVideoId, setLightboxVideoId] = useState<string | number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRemoteFeed, setIsRemoteFeed] = useState<boolean>(false);

  const loadData = useCallback(async () => {
    let cancelled = false;
    try {
      const remoteEnabled = isRemoteModeEnabled();

      if (remoteEnabled) {
        try {
          const url = `${FEED_URL}?ts=${Date.now()}`;
          const res = await fetch(url, { cache: 'no-store' as RequestCache });

          if (!res.ok) {
            throw new Error(`Feed request failed with status ${res.status}`);
          }

          const remoteData = await res.json();
          const normalizedVideos = normalizeList(remoteData);

          if (!cancelled) {
            console.log('[OK How To] Source=remote, count=', normalizedVideos.length);
            setIsRemoteFeed(true);
            setData({
              categories: localDataImport.categories,
              videos: normalizedVideos.length > 0 ? normalizedVideos : normalizeList(localDataImport.videos),
            });

            if (normalizedVideos.length === 0) {
              console.log('[OK How To] Remote feed empty, using local fallback');
            }
          }
        } catch (remoteFetchError) {
          console.warn('[OK How To] Remote feed failed, falling back to local data:', remoteFetchError);
          if (!cancelled) {
            setIsRemoteFeed(false);
            setData({
              categories: localDataImport.categories,
              videos: normalizeList(localDataImport.videos),
            });
          }
        }
      } else {
        console.log('[OK How To] Source=local, count=', localDataImport.videos.length);
        if (!cancelled) {
          setIsRemoteFeed(false);
          setData({
            categories: localDataImport.categories,
            videos: normalizeList(localDataImport.videos),
          });
        }
      }
    } catch (err) {
      console.error('Error loading video data:', err);
      if (!cancelled) {
        setError('Failed to load videos. Please try again later.');
      }
    }

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const cleanup = onRemoteModeChange((enabled) => {
      console.log('[OK How To] Remote mode changed:', enabled);
      loadData();
    });

    return cleanup;
  }, [loadData]);

  const getCategoryPriority = useCallback((categorySlug: string): number => {
    if (!data) return 999;
    const index = data.categories.findIndex(cat => cat.slug === categorySlug);
    return index === -1 ? 999 : index;
  }, [data]);

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
      // When searching, return results in relevance order (no sorting)
      return filtered;
    }

    // Apply sorting based on context
    if (selectedCategory === 'all') {
      // Sort by category first, then alphabetically by title
      filtered.sort((a, b) => {
        const categoryDiff = getCategoryPriority(a.category) - getCategoryPriority(b.category);
        if (categoryDiff !== 0) return categoryDiff;
        return a.title.localeCompare(b.title);
      });
    } else {
      // Sort alphabetically by title only
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    return filtered;
  }, [data, selectedCategory, searchTerm, getCategoryPriority]);

  const handleOpenLightbox = (videoId: string | number) => {
    setLightboxVideoId(videoId);
  };

  const handleCloseLightbox = () => {
    setLightboxVideoId(null);
  };

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
  };

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
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
        <OkHowToHeader videoCount={0} />
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
        <OkHowToHeader videoCount={0} />
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
  const lightboxVideo = lightboxVideoId !== null
    ? data?.videos.find(v => v.id === lightboxVideoId)
    : null;

  return (
    <div className="okhowto-page">
      <OkHowToHeader videoCount={data.videos.length} />
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
              onOpenLightbox={handleOpenLightbox}
            />
          </div>
        </section>
      </main>
      <Footer />

      {lightboxVideo && (
        <VideoLightbox
          video={lightboxVideo}
          onClose={handleCloseLightbox}
        />
      )}
    </div>
  );
};

export default OkHowToPage;
