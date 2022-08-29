import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Player from "./components/Player";

import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { useState } from "react";
import { useEffect } from "react";

const ffmpeg = createFFmpeg({
  log: true,
});

function App() {
  const [ready, setReady] = useState(false);

  const loadFFmpeg = async () => {
    await ffmpeg.load();
    setReady(true);
  };

  useEffect(() => {
    loadFFmpeg();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/player/:id" element={<Player />} />
    </Routes>
  );
}

export default App;
