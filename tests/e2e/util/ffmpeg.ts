const ffmpeg = require("fluent-ffmpeg");

export function scaleImages(imagesPattern: string) {
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(imagesPattern)
      .outputOptions(["-vf scale=200:200"])
      .output(imagesPattern)
      .on("end", resolve)
      .on("error", reject)
      .run();
  });
}

export function makeVideoFromImages(imagesPattern: string, videoPath: string) {
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(imagesPattern)
      .inputFPS(24)
      .videoFilters("pad=360:240", "format=yuv420p")
      .fps(24)
      .output(videoPath)
      .on("end", resolve)
      .on("error", reject)
      .run();
  });
}
