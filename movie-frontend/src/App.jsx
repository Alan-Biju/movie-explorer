
import { Routes, Route } from "react-router-dom";

import MoviesList from "./pages/MoviesList";
import MovieDetails from "./pages/MovieDetails";
import './App.css'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<MoviesList />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
      </Routes>
    </>
  )
}

export default App
