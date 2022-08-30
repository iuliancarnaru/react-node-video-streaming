import { useEffect } from "react";
import { useState } from "react";

import Card from "../components/Card";

function Home() {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getVideos() {
      try {
        const response = await fetch("http://localhost:4000/videos");
        const data = await response.json();
        setVideos(data);
      } catch (error) {
        setError(error.message);
      }
    }
    getVideos();
  }, []);

  return (
    <div className="App App-header">
      <div className="container">
        <div className="row">
          {videos?.map((video) => (
            <Card key={video.id} video={video} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
