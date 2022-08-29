const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const thumbsupply = require("thumbsupply");
const helmet = require("helmet");

const videos = [
  {
    id: 0,
    poster: "/video/0/poster",
    duration: "3 mins",
    name: "Sample1",
  },
  {
    id: 1,
    poster: "/video/1/poster",
    duration: "5 mins",
    name: "Sample2",
  },
  {
    id: 2,
    poster: "/video/2/poster",
    duration: "2 mins",
    name: "Sample3",
  },
  {
    id: 3,
    poster: "/video/3/poster",
    duration: "12 mins",
    name: "Sample4",
  },
];

const app = express();

app.use(cors());
// app.use(
//   helmet({
//     crossOriginEmbedderPolicy: true,
//     crossOriginOpenerPolicy: { policy: "same-origin" },
//     crossOriginResourcePolicy: { policy: "same-origin" },
//   })
// );

app.get("/video/:id/data", (req, res) => {
  const id = parseInt(req.params.id, 10);
  res.status(200).json(videos[id]);
});

app.get("/videos", (req, res) => {
  res.status(200).json(videos);
});

app.get("/video/:id", (req, res) => {
  const videoPath = path.join(__dirname, `assets/${req.params.id}.mp4`);
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;

    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": `bytes`,
      "Content-Length": chunkSize,
      "Content-Type": `video/mp4`,
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const file = fs.createReadStream(videoPath);
    const head = {
      "Content-Length": fileSize,
      "Content-Type": `video/mp4`,
    };

    res.writeHead(200, head);
    file.pipe(res);
  }
});

// app.get("/video/:id/poster", (req, res) => {
//   thumbsupply
//     .generateThumbnail(path.join(__dirname, `assets/${req.params.id}.mp4`))
//     .then((thumb) => res.sendFile(thumb));
// });

app.listen(4000, () => console.log(`Server up on port 4000`));
