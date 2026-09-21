import products from "@/data/products.json";

export const CATEGORIES = [
  { value: "single-origin", label: "Single Origin" },
  { value: "blends", label: "Blends" },
  { value: "decaf", label: "Decaf" },
  { value: "equipment", label: "Equipment" },
];

export function categoryLabel(value) {
  const found = CATEGORIES.find((c) => c.value === value);
  return found ? found.label : value;
}

export function getProducts({ search = "", category = "" } = {}) {
  const term = String(search || "").trim().toLowerCase();
  const cat = String(category || "").trim().toLowerCase();

  return products.filter((p) => {
    const matchesSearch =
      !term ||
      p.name.toLowerCase().includes(term) ||
      p.origin.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term);
    const matchesCategory = !cat || p.category === cat;
    return matchesSearch && matchesCategory;
  });
}

export function getProduct(id) {
  return products.find((p) => p.id === id || p.slug === id) || null;
}

export function formatPrice(value) {
  return `$${Number(value).toFixed(2)}`;
}
