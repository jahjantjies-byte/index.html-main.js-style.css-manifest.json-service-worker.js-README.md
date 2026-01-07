// Preloaded weekly check-in dates
const preloadedDates = ["2026-01-08", "2026-01-15", "2026-01-22"];

const nextDateEl = document.getElementById("next-date");
const countdownEl = document.getElementById("countdown");
const statusEl = document.getElementById("status");
const checkinBtn = document.getElementById("checkin-btn");
const cameraContainer = document.getElementById("camera-container");
const cameraPreview = document.getElementById("camera-preview");
const captureBtn = document.getElementById("capture-btn");

let currentIndex = 0;

function updateNextCheckin() {
  const nextDate = new Date(preloadedDates[currentIndex]);
  const today = new Date();
  nextDateEl.textContent = nextDate.toDateString();
  const diff = nextDate - today;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  countdownEl.textContent = `${days} day(s) remaining`;
  if (days > 0) statusEl.textContent = "Status: On Track ✅";
  else if (days === 0) statusEl.textContent = "Status: Due Today ⚠️";
  else statusEl.textContent = "Status: Missed ❌";
}

updateNextCheckin();

checkinBtn.addEventListener("click", () => {
  cameraContainer.style.display = "block";
  startCamera();
});

function startCamera() {
  navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
    .then(stream => { cameraPreview.srcObject = stream; })
    .catch(err => { alert("Camera access failed: " + err.message); });
}

captureBtn.addEventListener("click", () => {
  const canvas = document.createElement("canvas");
  canvas.width = cameraPreview.videoWidth;
  canvas.height = cameraPreview.videoHeight;
  canvas.getContext("2d").drawImage(cameraPreview, 0, 0);
  const imageData = canvas.toDataURL("image/png");
  const checkinRecord = {
    date: preloadedDates[currentIndex],
    timestamp: new Date().toISOString(),
    selfie: imageData
  };
  localStorage.setItem(`checkin_${currentIndex}`, JSON.stringify(checkinRecord));
  cameraPreview.srcObject.getTracks().forEach(track => track.stop());
  cameraContainer.style.display = "none";
  currentIndex++;
  if (currentIndex >= preloadedDates.length) currentIndex = preloadedDates.length - 1;
  updateNextCheckin();
  alert("Check-in successful ✅");
});
// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('Service Worker registered', reg))
      .catch(err => console.log('Service Worker failed:', err));
  });
}
