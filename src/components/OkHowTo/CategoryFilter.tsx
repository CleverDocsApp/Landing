import React from 'react';
import './CategoryFilter.css';

interface Category {
  slug: string;
  name: string;
  description: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
  videoCounts: Record<string, number>;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  videoCounts,
}) => {
  const allCount = Object.values(videoCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="category-filter">
      <button
        className={`category-chip ${selectedCategory === 'all' ? 'active' : ''}`}
        onClick={() => onSelectCategory('all')}
        aria-label="Show all videos"
        aria-pressed={selectedCategory === 'all'}
      >
        All Videos
        <span className="count-badge">{allCount}</span>
      </button>

      {categories.map((category) => (
        <button
          key={category.slug}
          className={`category-chip ${selectedCategory === category.slug ? 'active' : ''}`}
          onClick={() => onSelectCategory(category.slug)}
          aria-label={`Filter by ${category.name}`}
          aria-pressed={selectedCategory === category.slug}
        >
          {category.name}
          <span className="count-badge">{videoCounts[category.slug] || 0}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
