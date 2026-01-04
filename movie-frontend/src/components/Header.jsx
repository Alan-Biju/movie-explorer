import { Link, useSearchParams } from "react-router-dom";
import Filters from "./Filters";
import "./Header.scss";

function Header({ hideSearch }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("name") || "";

  const handleChange = (e) => {
    const value = e.target.value;

    if (value) {
      setSearchParams({ name: value });
    } else {
      setSearchParams({});
    }
  };

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">
          Movie Explorer
        </Link>

        {!hideSearch && (
          <div className="header-filters">
            <input
              type="text"
              placeholder="Search movies..."
              value={query}
              onChange={handleChange}
              className="search-input"
            />
            <Filters />
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
