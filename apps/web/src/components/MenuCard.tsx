import { Sparkles } from 'lucide-react';
import { formatMoney } from '../lib/api';
import type { MenuItem } from '../types';

export default function MenuCard({ item }: { item: MenuItem }) {
  return (
    <article className="menu-card reveal-up">
      <div className="menu-image-wrap">
        <img
          src={item.imageUrl || 'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1200&q=80'}
          alt={item.name}
          className="menu-image"
        />
        {item.isSignature && <span className="signature-badge"><Sparkles size={14} /> Signature</span>}
      </div>
      <div className="menu-card-body">
        <div>
          <p className="menu-category">{item.category}</p>
          <h3>{item.name}</h3>
        </div>
        <p>{item.description}</p>
        <div className="menu-card-bottom">
          <strong>{formatMoney(item.price)}</strong>
          <span className={item.isAvailable ? 'status-pill available' : 'status-pill'}>
            {item.isAvailable ? 'Còn món' : 'Tạm hết'}
          </span>
        </div>
      </div>
    </article>
  );
}
