import ProductCard from "@/components/ProductCard";
import Newsletter from "@/components/Newsletter";
import { getProducts, CATEGORIES } from "@/lib/products";

export default function HomePage({ searchParams }) {
  const search = searchParams?.search || "";
  const category = searchParams?.category || "";
  const results = getProducts({ search, category });

  return (
    <>
      <section className="hero" data-testid="hero">
        <div className="container">
          <h1>Coffee worth the wait.</h1>
          <p>
            Small batch single origins and blends, roasted to order and shipped
            within 48 hours.
          </p>
        </div>
      </section>

      <div className="container">
        <form className="filters" method="get" data-testid="filter-form">
          <div className="field">
            <label htmlFor="search">Search</label>
            <input
              id="search"
              name="search"
              type="text"
              placeholder="Search coffee or origin"
              defaultValue={search}
              data-testid="search-input"
            />
          </div>
          <div className="field">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              defaultValue={category}
              data-testid="category-select"
            >
              <option value="">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <button className="btn" type="submit" data-testid="apply-filters">
            Apply
          </button>
          <a className="btn secondary" href="/" data-testid="clear-filters">
            Clear
          </a>
        </form>

        <p className="muted" data-testid="result-count">
          {results.length} product{results.length === 1 ? "" : "s"}
          {search ? ` matching "${search}"` : ""}
        </p>

        {results.length === 0 ? (
          <div className="empty" data-testid="no-results">
            No products match your search. Try a different term or clear the
            filters.
          </div>
        ) : (
          <div className="grid" data-testid="product-grid">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        <Newsletter />
      </div>
    </>
  );
}
