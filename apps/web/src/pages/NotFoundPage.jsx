import { Link } from "react-router-dom";
import "./NotFoundPage.css";

function NotFoundPage() {
  return (
    <section className="not-found__container page__container">
      <h1 className="not-found__code">404</h1>
      <p className="not-found__message">We couldn&apos;t find the page you were looking for.</p>
      <Link to="/" className="not-found__link">
        Back to the catalog
      </Link>
    </section>
  );
}

export default NotFoundPage;
