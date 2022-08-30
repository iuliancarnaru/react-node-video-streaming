import express from "express";
import { statSync, createReadStream } from "fs";
import { join } from "path";
import cors from "cors";
import helmet from "helmet";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import path from "path";
import PQueue from "p-queue";

const __dirname = path.resolve();

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

const ffmpegInstance = createFFmpeg({ log: true });
let ffmpegLoadingPromise = ffmpegInstance.load();
const requestQueue = new PQueue({ concurrency: 1 });

async function getFFmpeg() {
  if (ffmpegLoadingPromise) {
    await ffmpegLoadingPromise;
    ffmpegLoadingPromise = undefined;
  }

  return ffmpegInstance;
}

const app = express();

app.use(cors());
app.use(
  helmet({
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: { policy: "same-origin" },
    crossOriginResourcePolicy: { policy: "same-origin" },
  })
);

app.get("/video/:id/data", (req, res) => {
  const id = parseInt(req.params.id, 10);
  res.status(200).json(videos[id]);
});

app.get("/videos", (req, res) => {
  res.status(200).json(videos);
});

app.get("/video/:id", (req, res) => {
  const videoPath = join(__dirname, `src/assets/${req.params.id}.mp4`);
  const stat = statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;

    const file = createReadStream(videoPath, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": `bytes`,
      "Content-Length": chunkSize,
      "Content-Type": `video/mp4`,
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const file = createReadStream(videoPath);
    const head = {
      "Content-Length": fileSize,
      "Content-Type": `video/mp4`,
    };

    res.writeHead(200, head);
    file.pipe(res);
  }
});

app.get("/video/:id/poster", async (req, res) => {
  try {
    const ffmpeg = await getFFmpeg();

    const inputFileName = `input-video.mp4`;
    const outputFileName = `output-image.png`;
    let outputData = null;

    await requestQueue.add(async () => {
      ffmpeg.FS(
        "writeFile",
        inputFileName,
        await fetchFile(join(__dirname, `src/assets/${req.params.id}.mp4`))
      );

      await ffmpeg.run(
        "-i",
        inputFileName,
        "-filter:v",
        "thumbnail",
        "-frames:v",
        "1",
        outputFileName
      );

      outputData = ffmpeg.FS("readFile", outputFileName);
      ffmpeg.FS("unlink", inputFileName);
      ffmpeg.FS("unlink", outputFileName);
    });

    res.writeHead(200, {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment;filename=${outputFileName}`,
      "Content-Length": outputData.length,
    });
    res.end(Buffer.from(outputData, "binary"));
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.listen(4000, () => console.log(`Server up on port 4000`));
