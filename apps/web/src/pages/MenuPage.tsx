import { useEffect, useMemo, useState } from 'react';
import SectionTitle from '../components/SectionTitle';
import MenuCard from '../components/MenuCard';
import { menuApi } from '../lib/api';
import type { MenuItem } from '../types';

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    menuApi.getAll()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => ['Tất cả', ...Array.from(new Set(items.map((item) => item.category)))], [items]);
  const filteredItems = activeCategory === 'Tất cả' ? items : items.filter((item) => item.category === activeCategory);

  return (
    <section className="section menu-page">
      <SectionTitle
        eyebrow="Menu Ốc Nguyễn"
        title="Hải sản tươi, sốt đậm vị, giá rõ ràng."
        description="Admin có thể thêm, xoá, sửa món ăn từ trang quản trị; khách xem menu được cập nhật ngay."
      />

      <div className="category-tabs">
        {categories.map((category) => (
          <button
            key={category}
            className={category === activeCategory ? 'active' : ''}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {loading ? <div className="screen-loader">Đang tải menu...</div> : (
        <div className="menu-grid">
          {filteredItems.map((item) => <MenuCard key={item.id} item={item} />)}
        </div>
      )}
    </section>
  );
}
