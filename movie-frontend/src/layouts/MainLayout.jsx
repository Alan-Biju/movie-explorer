import Header from "../components/Header";
import "../styles/MainLayout.scss";

function MainLayout({ children, hideSearch = false }) {
  return (
    <div className="main-layout">
      <Header hideSearch={hideSearch} />

      <main className="content">
        {children}
      </main>
    </div>
  );
}

export default MainLayout;
