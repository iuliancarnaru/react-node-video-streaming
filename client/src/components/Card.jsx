import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Card({ video }) {
  const [thumbnail, setThumbnail] = useState(null);
  const [error, setError] = useState("");

  async function blobToDataURL(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.onabort = () => reject(new Error("Read aborted"));
      reader.readAsDataURL(blob);
    });
  }

  useEffect(() => {
    async function getThumbnail() {
      try {
        const response = await fetch(
          `http://localhost:4000/video/${video.id}/poster`
        );

        const thumbnailBlob = await response.blob();
        const thumbnail = await blobToDataURL(thumbnailBlob);
        console.log(thumbnail);

        setThumbnail(thumbnail);
      } catch (error) {
        setError(error.message);
      }
    }
    getThumbnail();
  }, [video]);

  console.log(thumbnail);

  return (
    <div className="col-md-4">
      <Link to={`/player/${video.id}`}>
        <div style={{ width: "400px" }} className="card border-0 mb-3">
          <img
            style={{
              width: "350px",
              display: "flex",
              alignSelf: "center",
            }}
            src={thumbnail}
            alt={video.name}
          />
          <div className="card-body">
            <p>{video.name}</p>
            <p>{video.duration}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default Card;
