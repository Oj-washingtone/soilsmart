const dropArea = document.getElementById("drop-area");
const fileInput = document.getElementById("fileInput");
const preview = document.getElementById("preview");
const previewWrapper = document.querySelector(".preview-wrapper");
const selectImageBtn = document.querySelector("#select-image-btn");
const attachBtn = document.querySelector("#attach");
const welcomeMessageWrapper = document.querySelector(".welcome-message");
const submitImageButton = document.querySelector("#submit-image-btn");
const chatWrapperSection = document.querySelector(".chats-wrapper");
const inputWrapper = document.querySelector(".chat-input-section");
let floatingActionBtn = document.querySelector("#fab");
const cancelBtn = document.querySelector("#cancel-btn");

attachBtn.addEventListener("click", () => {
  dropArea.classList.toggle("hidden");
  chatWrapperSection.classList.toggle("hidden");
  inputWrapper.classList.toggle("hidden");
  floatingActionBtn.style.display = "none";
});

cancelBtn.addEventListener("click", () => {
  dropArea.classList.toggle("hidden");
  chatWrapperSection.classList.toggle("hidden");
  inputWrapper.classList.toggle("hidden");
  floatingActionBtn.style.display = "flex";
});

selectImageBtn.addEventListener("click", () => {
  fileInput.click();
});

// Prevent default behavior for drag-and-drop events
["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
  dropArea.addEventListener(eventName, (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
});

// Highlight the drop area when a file is dragged over
["dragenter", "dragover"].forEach((eventName) => {
  dropArea.addEventListener(eventName, () => {
    dropArea.classList.add("highlight");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  dropArea.addEventListener(eventName, () => {
    dropArea.classList.remove("highlight");
  });
});

// Handle the dropped file
dropArea.addEventListener("drop", (e) => {
  const file = e.dataTransfer.files[0];
  handleFile(file);
});

// Handle the selected file when the input is used
fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  handleFile(file);
});

function handleFile(file) {
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();

    reader.onload = function (e) {
      preview.src = e.target.result;
    };

    reader.readAsDataURL(file);
    previewWrapper.classList.remove("hidden");
    submitImageButton.classList.remove("hidden");
  } else {
    alert("Please select a valid image file.");
  }
}

const dropArea2 = document.getElementById("drop-area-2");
const fileInput2 = document.getElementById("fileInput-2");
const preview2 = document.getElementById("preview-2");
const submitImageButton2 = document.getElementById("submit-image-btn-2");
const cancelBtn2 = document.getElementById("cancel-btn-2");
const attachBtn2 = document.getElementById("crop-disease-btn");

attachBtn2.addEventListener("click", () => {
  dropArea2.classList.toggle("hidden");
  chatWrapperSection.classList.toggle("hidden");
  inputWrapper.classList.toggle("hidden");
  floatingActionBtn.style.display = "none";
});

cancelBtn2.addEventListener("click", () => {
  dropArea2.classList.toggle("hidden");
  chatWrapperSection.classList.toggle("hidden");
  inputWrapper.classList.toggle("hidden");
  floatingActionBtn.style.display = "flex";
});

// Prevent default behavior for drag-and-drop events
["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
  dropArea2.addEventListener(eventName, (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
});

// Highlight the drop area when a file is dragged over
["dragenter", "dragover"].forEach((eventName) => {
  dropArea2.addEventListener(eventName, () => {
    dropArea2.classList.add("highlight");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  dropArea2.addEventListener(eventName, () => {
    dropArea2.classList.remove("highlight");
  });
});

// Handle the dropped file
dropArea2.addEventListener("drop", (e) => {
  const file = e.dataTransfer.files[0];
  handleFile2(file);
});

// Handle the selected file when the input is used
fileInput2.addEventListener("change", (e) => {
  const file = e.target.files[0];
  handleFile2(file);
});

function handleFile2(file) {
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();

    reader.onload = function (e) {
      preview2.src = e.target.result;
    };

    reader.readAsDataURL(file);
    previewWrapper.classList.remove("hidden");
    submitImageButton2.classList.remove("hidden");
  } else {
    alert("Please select a valid image file.");
  }
}
