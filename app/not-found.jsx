import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container">
      <div className="panel" data-testid="not-found">
        <h1>Page not found</h1>
        <p className="muted">
          We could not find what you were looking for.
        </p>
        <p>
          <Link className="btn" href="/">Back to shop</Link>
        </p>
      </div>
    </div>
  );
}
