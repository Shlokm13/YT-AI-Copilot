let currentUrl = location.href;


// ==========================
// CREATE IFRAME
// ==========================

const iframe = document.createElement("iframe");

iframe.src = "https://yt-ai-copilot.vercel.app";
//iframe.src = "http://localhost:3000";

iframe.style.position = "fixed";
iframe.style.top = "0";
iframe.style.right = "0";
iframe.style.width = "450px";
iframe.style.height = "100vh";
iframe.style.zIndex = "999999";
iframe.style.border = "none";
iframe.style.background = "transparent";

document.body.appendChild(iframe);


// ==========================
// CREATE TOGGLE BUTTON
// ==========================

const toggleButton = document.createElement("button");

toggleButton.innerHTML = `
  <div style="
    display:flex;
    align-items:center;
    justify-content:center;
    width:100%;
    height:100%;
    font-size:22px;
    font-weight:600;
  ">
    ✦
  </div>
`;

toggleButton.style.position = "fixed";

toggleButton.style.top = "50%";

toggleButton.style.right = "470px";

toggleButton.style.transform = "translateY(-50%)";

toggleButton.style.width = "45px";

toggleButton.style.height = "45px";

toggleButton.style.borderRadius = "18px";

toggleButton.style.border = "1px solid rgba(255,255,255,0.08)";

toggleButton.style.background = "rgba(15,15,15,0.92)";

toggleButton.style.backdropFilter = "blur(12px)";

toggleButton.style.webkitBackdropFilter = "blur(12px)";

toggleButton.style.color = "white";

toggleButton.style.cursor = "pointer";

toggleButton.style.zIndex = "1000000";

toggleButton.style.boxShadow = `
  0 8px 30px rgba(0,0,0,0.45),
  0 0 20px rgba(99,102,241,0.25)
`;

toggleButton.style.transition = "all 0.25s ease";


// ==========================
// HOVER EFFECT
// ==========================

toggleButton.onmouseenter = () => {

  toggleButton.style.transform = "translateY(-50%) scale(1.08)";

  toggleButton.style.boxShadow = `
    0 10px 35px rgba(0,0,0,0.55),
    0 0 25px rgba(99,102,241,0.45)
  `;

};

toggleButton.onmouseleave = () => {

  toggleButton.style.transform = "translateY(-50%) scale(1)";

  toggleButton.style.boxShadow = `
    0 8px 30px rgba(0,0,0,0.45),
    0 0 20px rgba(99,102,241,0.25)
  `;

};


// IMPORTANT: ADD BUTTON TO PAGE

document.body.appendChild(toggleButton);


// ==========================
// TOGGLE SIDEBAR
// ==========================

let isOpen = true;

toggleButton.onclick = () => {

  if (isOpen) {

    iframe.style.display = "none";

    toggleButton.style.right = "10px";

  } else {

    iframe.style.display = "block";

    toggleButton.style.right = "470px";

  }

  isOpen = !isOpen;

};


// ==========================
// SEND URL FUNCTION
// ==========================

function sendVideoUrl() {

  iframe.contentWindow.postMessage(

    {
      type: "YOUTUBE_URL",
      url: location.href,
    },

    "https://yt-ai-copilot.vercel.app"
    //"http://localhost:3000"

  );

}


// ==========================
// WAIT FOR IFRAME LOAD
// ==========================

iframe.onload = () => {

  sendVideoUrl();

};

let currentVideoId = new URL(location.href).searchParams.get("v");


// ==========================
// DETECT VIDEO CHANGE
// ==========================

setInterval(() => {

  const newVideoId = new URL(location.href).searchParams.get("v");

  if (newVideoId && newVideoId !== currentVideoId) {

    currentVideoId = newVideoId;

    console.log("Video changed:", location.href);

    sendVideoUrl();

  }

}, 1500);