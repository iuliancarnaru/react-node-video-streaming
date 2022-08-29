import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

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
            <div className="col-md-4" key={video.id}>
              <Link to={`/player/${video.id}`}>
                <div className="card border-0 mb-3">
                  <img
                    style={{
                      width: "150px",
                      display: "flex",
                      alignSelf: "center",
                    }}
                    // src={`http://localhost:4000${video.poster}`}
                    src={`https://wearejde.com/wp-content/uploads/woocommerce-placeholder-600x600.png`}
                    alt={video.name}
                  />
                  <div className="card-body">
                    <p>{video.name}</p>
                    <p>{video.duration}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
