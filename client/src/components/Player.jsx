import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";

function Player() {
  const [videoData, setVideoData] = useState({});
  const [error, setError] = useState("");

  let { id } = useParams();

  useEffect(() => {
    async function getVideo() {
      try {
        const response = await fetch(`http://localhost:4000/video/${id}`);
        const data = await response.json();
        setVideoData(data);
      } catch (error) {
        setError(error.message);
      }
    }
    getVideo();
  }, []);

  return (
    <div className="App">
      <div style={{ width: "800px" }} className="App-header">
        <video
          style={{ width: "100%", height: "100%" }}
          controls
          autoPlay
          crossOrigin="anonymous"
        >
          <source
            src={`http://localhost:4000/video/${id}`}
            type="video/mp4"
          ></source>
          <h1>{videoData.name}</h1>
        </video>
      </div>
    </div>
  );
}

export default Player;
