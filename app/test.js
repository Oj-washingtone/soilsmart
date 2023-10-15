import SoilAnalysis from "./utils/LocationBasedSoilProperties.js";

const form = document.getElementById("chat-form");
const responseDiv = document.getElementById("response");
const chatsWrapper = document.querySelector(".chats-wrapper");
const welcomeMessage = document.querySelector(".welcome-message");
const _userImage = "../assets/images/user.jpg";
const _botImage = "../assets/images/bot.png";
const submit_image_btn = document.querySelector("#submit-image-btn");
const chatWrapperSection = document.querySelector(".chats-wrapper");
const inputWrapper = document.querySelector(".chat-input-section");
const loadingIndicator = document.getElementById("loadingIndicator");

// Assuming questions.json is in the same directory as your HTML file
fetch("utils/questionSuggestions.json")
  .then((response) => response.json())
  .then((data) => {
    const rightSidebar = document.querySelector(".right-sidebar");

    // Create a container for the questions
    const questionsContainer = document.createElement("div");
    questionsContainer.classList.add("questions-container");

    // Loop through the questions and create elements for each
    for (const [index, question] of data.entries()) {
      const questionDiv = document.createElement("button");
      questionDiv.classList.add("question");
      questionDiv.classList.add("suggested-btn");
      questionDiv.textContent = question.question;

      questionDiv.addEventListener("click", () => {
        const suggestedText = questionDiv.textContent;
        form.elements.message.value = suggestedText;
        // submit form
        form.dispatchEvent(new Event("submit"));
      });

      questionsContainer.appendChild(questionDiv);
    }

    rightSidebar.appendChild(questionsContainer);
  })
  .catch((error) => {
    console.log("Error fetching questions:", error);
  });

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const userInput = event.target.elements.message.value;

  // check if user input is empty if so return
  if (userInput === "") return;

  // create message container
  const messageContainer = document.createElement("div");
  messageContainer.classList.add("message-container");
  const messageImage = document.createElement("img");
  messageImage.src = _userImage;
  messageImage.classList.add("message-image");
  messageContainer.appendChild(messageImage);

  // create message element
  const messageElement = document.createElement("p");
  messageElement.classList.add("message-sent", "message");
  messageElement.textContent = userInput;
  messageContainer.appendChild(messageElement);

  // hide welcome message
  welcomeMessage.style.display = "none";
  chatsWrapper.appendChild(messageContainer);
  event.target.elements.message.value = "";
  chatsWrapper.scrollTop = chatsWrapper.scrollHeight;

  const response = await fetch("/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: userInput }),
  });

  const responseData = await response.json();

  // format the response from the bot
  // const formattedResponse = formatMessage(responseData.message);
  // responseDiv.innerHTML += formattedResponse + "\t";

  // console.log(responseData);

  const responseContainer = document.createElement("div");
  responseContainer.classList.add("message-container");
  const responseImage = document.createElement("img");
  responseImage.src = _botImage;
  responseImage.classList.add("message-image");
  responseContainer.appendChild(responseImage);
  const responseElement = document.createElement("p");
  responseElement.classList.add("message-received", "message");
  responseContainer.appendChild(responseElement);
  chatsWrapper.appendChild(responseContainer);

  if (responseData && responseData.urls && responseData.urls.stream) {
    const source = new EventSource(responseData.urls.stream, {
      withCredentials: true,
    });

    source.addEventListener("output", (e) => {
      responseElement.innerHTML += e.data;

      // scroll to bottom
      chatsWrapper.scrollTop = chatsWrapper.scrollHeight;
    });

    source.addEventListener("error", (e) => {
      console.error("error", JSON.parse(e.data));
    });

    source.addEventListener("done", (e) => {
      source.close();
      console.log("done", JSON.parse(e.data));
    });
  }

  // responseDiv.innerHTML += responseData.text + "\t";
});

// file upload
const dropArea = document.getElementById("drop-area");

submit_image_btn.addEventListener("click", async (event) => {
  loadingIndicator.classList.toggle("hidden");
  submit_image_btn.classList.toggle("hidden");

  const soilAnalysis = new SoilAnalysis();
  const soilProperties = await soilAnalysis.getLocation();
  dropArea.classList.toggle("hidden");
  chatWrapperSection.classList.toggle("hidden");
  inputWrapper.classList.toggle("hidden");

  const message = `If my soil test returns the following results:
- Carbon Organic: ${soilProperties[0].property.carbon_organic[0].value.value} ${soilProperties[0].property.carbon_organic[0].value.unit}
- Fertility Capability Classification: ${soilProperties[1].property.fcc[0].value.value}
- Clay Content: ${soilProperties[2].property.clay_content[0].value.value} ${soilProperties[2].property.clay_content[0].value.unit}
- pH: ${soilProperties[3].property.ph[0].value.value}
\n
What are some suitable plantsto grow, an how would i improve my soil quality to grow them or even grow those that are not supported now.
`;

  form.elements.message.value = message;
  form.dispatchEvent(new Event("submit"));
  loadingIndicator.classList.toggle("hidden");
  submit_image_btn.classList.toggle("hidden");
});

// function to format the response from the bot
function formatMessage(rawText) {
  const markdown = new markdownit();
  return markdown.render(rawText);
}
