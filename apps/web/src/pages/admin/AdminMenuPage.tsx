import { FormEvent, useEffect, useMemo, useState } from "react";
import { Edit2, Filter, Plus, Search, Trash2, X } from "lucide-react";
import { menuApi } from "../../lib/api";
import type { MenuItem } from "../../types";
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=1200&q=80";

const DEFAULT_CATEGORIES = [
  "Ốc đặc sản",
  "Món nướng",
  "Hải sản nóng",
  "Món hấp",
  "Món xào",
  "Lẩu hải sản",
  "Đồ uống",
];

const emptyForm = {
  name: "",
  description: "",
  price: 0,
  category: "Ốc đặc sản",
  imageUrl: "",
  isAvailable: true,
  isSignature: false,
};

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Tất cả");
  const [statusFilter, setStatusFilter] = useState("Tất cả");

  const [customCategories, setCustomCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem("oc-nguyen-custom-categories");
    return saved ? JSON.parse(saved) : [];
  });

  const categories = useMemo(() => {
    const categoriesFromItems = items
      .map((item) => item.category)
      .filter(Boolean);

    return Array.from(
      new Set([
        ...DEFAULT_CATEGORIES,
        ...customCategories,
        ...categoriesFromItems,
      ]),
    );
  }, [items, customCategories]);

  const loadItems = async () => {
    try {
      setError("");
      const data = await menuApi.getAll();
      setItems(data);
    } catch {
      setError("Không tải được danh sách món ăn");
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const keyword = searchText.trim().toLowerCase();

      const matchSearch =
        !keyword ||
        item.name.toLowerCase().includes(keyword) ||
        item.category.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword);

      const matchCategory =
        categoryFilter === "Tất cả" || item.category === categoryFilter;

      const matchStatus =
        statusFilter === "Tất cả" ||
        (statusFilter === "Còn món" && item.isAvailable) ||
        (statusFilter === "Hết món" && !item.isAvailable) ||
        (statusFilter === "Signature" && item.isSignature);

      return matchSearch && matchCategory && matchStatus;
    });
  }, [items, searchText, categoryFilter, statusFilter]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleAddCategory = () => {
    const value = prompt("Nhập tên danh mục mới:");
    const newCategory = value?.trim();

    if (!newCategory) return;

    const existed = categories.some(
      (category) => category.toLowerCase() === newCategory.toLowerCase(),
    );

    if (existed) {
      setForm((prev) => ({ ...prev, category: newCategory }));
      return;
    }

    const nextCategories = [...customCategories, newCategory];

    setCustomCategories(nextCategories);
    localStorage.setItem(
      "oc-nguyen-custom-categories",
      JSON.stringify(nextCategories),
    );

    setForm((prev) => ({ ...prev, category: newCategory }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setError("");

      const payload = {
        ...form,
        price: Number(form.price),
      };

      if (editingId) {
        await menuApi.update(editingId, payload);
      } else {
        await menuApi.create(payload);
      }

      await loadItems();
      resetForm();
    } catch {
      setError("Không lưu được món ăn");
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      imageUrl: item.imageUrl ?? "",
      isAvailable: item.isAvailable,
      isSignature: item.isSignature,
    });
  };

  const handleDelete = async (id: number) => {
    const ok = confirm("Xoá món ăn này?");
    if (!ok) return;

    try {
      setError("");
      await menuApi.remove(id);
      await loadItems();

      if (editingId === id) {
        resetForm();
      }
    } catch {
      setError("Không xoá được món ăn");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-heading">
        <span>Menu</span>
        <h1>Quản lý món ăn</h1>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="menu-admin-tools">
        <label className="admin-search">
          <Search size={18} />
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Tìm theo tên món, danh mục hoặc mô tả..."
          />
        </label>

        <label className="admin-filter">
          <Filter size={18} />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="Tất cả">Tất cả danh mục</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="admin-filter">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="Tất cả">Tất cả trạng thái</option>
            <option value="Còn món">Còn món</option>
            <option value="Hết món">Hết món</option>
            <option value="Signature">Món signature</option>
          </select>
        </label>
      </div>

      <div className="admin-split">
        <div className="admin-table">
          {filteredItems.length === 0 ? (
            <div className="admin-empty">
              <h3>Không tìm thấy món phù hợp</h3>
              <p>Thử đổi từ khoá tìm kiếm hoặc bộ lọc danh mục.</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div className="admin-row" key={item.id}>
                <img src={item.imageUrl ?? FALLBACK_IMAGE} alt={item.name} />

                <div>
                  <strong>{item.name}</strong>
                  <small>
                    {item.category} • {item.price.toLocaleString("vi-VN")} đ
                  </small>
                  <small>
                    {item.isAvailable ? "Còn món" : "Hết món"}
                    {item.isSignature ? " • Signature" : ""}
                  </small>
                </div>

                <div className="row-actions">
                  <button onClick={() => handleEdit(item)} title="Sửa món">
                    <Edit2 size={16} />
                  </button>

                  <button
                    className="danger"
                    onClick={() => handleDelete(item.id)}
                    title="Xoá món">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="admin-panel sticky-panel">
          <h2>{editingId ? "Sửa món ăn" : "Thêm món mới"}</h2>

          <form className="admin-form" onSubmit={handleSubmit}>
            <label>
              Tên món
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </label>

            <label>
              Mô tả
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                required
              />
            </label>

            <label>
              Giá
              <input
                type="number"
                value={form.price}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    price: Number(e.target.value),
                  }))
                }
                min={0}
                required
              />
            </label>

            <label>
              Danh mục
              <div className="category-select-row">
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  className="category-add-btn"
                  onClick={handleAddCategory}
                  title="Thêm danh mục mới">
                  <Plus size={18} />
                </button>
              </div>
            </label>

            <button
              type="button"
              className="btn btn-ghost add-category-line"
              onClick={handleAddCategory}>
              <Plus size={18} />
              Thêm danh mục mới
            </button>

            <label>
              Ảnh URL
              <input
                value={form.imageUrl}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    imageUrl: e.target.value,
                  }))
                }
                placeholder="https://..."
                required
              />
            </label>

            <label className="checkbox">
              <input
                type="checkbox"
                checked={form.isAvailable}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    isAvailable: e.target.checked,
                  }))
                }
              />
              Còn món
            </label>

            <label className="checkbox">
              <input
                type="checkbox"
                checked={form.isSignature}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    isSignature: e.target.checked,
                  }))
                }
              />
              Món signature
            </label>

            <button className="btn" type="submit">
              <Plus size={18} />
              {editingId ? "Lưu thay đổi" : "Thêm món"}
            </button>

            {editingId && (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={resetForm}>
                <X size={18} />
                Huỷ sửa
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
