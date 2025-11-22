const fileInput = document.getElementById("fileInput");
const preview = document.getElementById("preview");

fileInput.addEventListener("change", (e) => {
  const files = Array.from(e.target.files);
  preview.innerHTML = ""; // Xoá ảnh cũ

  files.forEach((file) => {
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.src = event.target.result;
      img.style.maxWidth = "150px";
      img.style.margin = "5px";
      preview.appendChild(img);

      // Nếu muốn convert WebP → PNG ngay khi upload
      img.onload = function () {
        if (file.type === "image/webp") {
          convertWebPtoPNG(img, file.name.replace(/\..+$/, ".png"));
        }
      };
    };
    reader.readAsDataURL(file);
  });
});

// Hàm convert WebP → PNG và tự download
function convertWebPtoPNG(img, filename) {
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);

  canvas.toBlob((blob) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
  }, "image/png");
}

const videoInput = document.getElementById("videoInput");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

videoInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  const video = document.createElement("video");
  video.src = url;
  video.crossOrigin = "anonymous";
  video.muted = true;
  video.play();

  // Khi video sẵn sàng
  video.addEventListener("loadeddata", () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Vẽ frame đầu tiên lên canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas sang PNG và download
    canvas.toBlob((blob) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "frame.png";
      a.click();
    }, "image/png");
  });
});

const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({ log: true });

const movInput = document.getElementById("movInput");
const convertBtn = document.getElementById("convertBtn");
const status = document.getElementById("status");
const downloadLink = document.getElementById("downloadLink");

convertBtn.addEventListener("click", async () => {
  const file = movInput.files[0];
  if (!file) {
    alert("Vui lòng chọn file MOV!");
    return;
  }

  convertBtn.disabled = true;
  status.textContent = "Đang tải FFmpeg...";

  // Load ffmpeg.js (WebAssembly)
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }

  status.textContent = "Đang convert MOV → MP4...";

  // Ghi file vào FS ảo
  ffmpeg.FS("writeFile", "input.mov", await fetchFile(file));

  // Chạy convert
  await ffmpeg.run(
    "-i",
    "input.mov",
    "-c:v",
    "libx264",
    "-c:a",
    "aac",
    "output.mp4"
  );

  // Lấy kết quả
  const data = ffmpeg.FS("readFile", "output.mp4");

  // Tạo URL download
  const url = URL.createObjectURL(
    new Blob([data.buffer], { type: "video/mp4" })
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name.replace(/\.mov$/i, ".mp4");
  a.textContent = "Download MP4";
  downloadLink.innerHTML = "";
  downloadLink.appendChild(a);

  status.textContent = "Hoàn tất!";
  convertBtn.disabled = false;
});
