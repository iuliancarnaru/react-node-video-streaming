import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Player from "./components/Player";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/player/:id" element={<Player />} />
    </Routes>
  );
}

export default App;
