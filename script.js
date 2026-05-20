const API_URL = "http://localhost:3000/get-upload-url";

async function uploadVideo() {
  const file = document.getElementById("videoInput").files[0];

  if (!file) {
    alert("Video tanlang");
    return;
  }

  // backenddan signed url olish
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type
    })
  });

  const data = await res.json();

  // S3 upload
  const xhr = new XMLHttpRequest();
  xhr.open("PUT", data.uploadUrl);
  xhr.setRequestHeader("Content-Type", file.type);

  xhr.upload.onprogress = (e) => {
    const percent = (e.loaded / e.total) * 100;
    document.getElementById("progressBar").style.width = percent + "%";
  };

  xhr.onload = () => {
    if (xhr.status === 200) {
      const video = document.createElement("video");
      video.src = data.videoUrl;
      video.controls = true;

      document.getElementById("videos").prepend(video);

      alert("Upload tugadi!");
    }
  };

  xhr.send(file);
}
