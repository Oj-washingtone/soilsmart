import SoilAnalysis from "../../../utils/LocationBasedSoilProperties.js";

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
const soil_analysis_shortcut_btn = document.querySelector(
  "#soil_analysis_shortcut_btn"
);
let floatingActionBtn = document.querySelector("#fab");
const new_message_btn = document.querySelector("#new-message-btn");

// Assuming questions.json is in the same directory as your HTML file
fetch("../utils/questionSuggestions.json")
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
  const chatId = event.target.elements.chatId.value;

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
  if (welcomeMessage) {
    welcomeMessage.style.display = "none";
  }

  chatsWrapper.appendChild(messageContainer);
  event.target.elements.message.value = "";
  chatsWrapper.scrollTop = chatsWrapper.scrollHeight;

  const response = await fetch("/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: userInput, chatId: chatId }),
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
      const botMessage = responseElement.innerText;

      fetch("/save/bot/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ botMessage: botMessage, chatId: chatId }),
      }).then((response) => {
        console.log(response);
      });

      console.log("done", JSON.parse(e.data));
    });
  }

  // responseDiv.innerHTML += responseData.text + "\t";
});

// file upload

const dropArea = document.getElementById("drop-area");

if (soil_analysis_shortcut_btn) {
  soil_analysis_shortcut_btn.addEventListener("click", () => {
    dropArea.classList.toggle("hidden");
    chatWrapperSection.classList.toggle("hidden");
    inputWrapper.classList.toggle("hidden");
  });
}

submit_image_btn.addEventListener("click", async (event) => {
  loadingIndicator.classList.toggle("hidden");
  submit_image_btn.classList.toggle("hidden");

  const soilAnalysis = new SoilAnalysis();
  const soilProperties = await soilAnalysis.getLocation();
  dropArea.classList.toggle("hidden");
  floatingActionBtn.style.display = "flex";
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

const dropArea2 = document.getElementById("drop-area-2");
const fileInput2 = document.getElementById("fileInput-2");
const submit_crop_image_btn = document.querySelector("#submit-image-btn-2");
const loadingIndicator2 = document.getElementById("loadingIndicator-2");

submit_crop_image_btn.addEventListener("click", async (event) => {
  loadingIndicator.classList.toggle("hidden");
  submit_crop_image_btn.classList.toggle("hidden");

  // Get the selected image file
  const selectedFile = fileInput2.files[0];

  if (selectedFile) {
    // Read the selected image file
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Image = event.target.result;

      // Send the image for disease identification
      const data = {
        api_key: "kJ6BEPx2tSZC6v8cWl2s3BQmOOAKacqTrowSV0j3iLdtmQA5Rs",
        images: [base64Image],
        modifiers: ["crops_fast", "similar_images"],
        language: "en",
        disease_details: [
          "cause",
          "common_names",
          "classification",
          "description",
          "treatment",
          "url",
        ],
      };

      try {
        const response = await fetch(
          "https://api.plant.id/v2/health_assessment",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        if (response.ok) {
          const responseData = await response.json();
          console.log("Disease identification response:", responseData);
          // You can handle the disease identification results here
          dropArea2.classList.toggle("hidden");
          loadingIndicator.classList.toggle("hidden");
          submit_image_btn.classList.toggle("hidden");
          floatingActionBtn.style.display = "flex";
          chatWrapperSection.classList.toggle("hidden");
          inputWrapper.classList.toggle("hidden");

          let message = ``;

          // Extract details from health_assessment
          const healthAssessment = responseData.health_assessment;
          if (healthAssessment) {
            const diseases = healthAssessment.diseases;
            if (diseases && diseases.length > 0) {
              message = "Detected Diseases:\n";

              diseases.forEach((disease, index) => {
                const diseaseName = disease.name;
                const probability = disease.probability;
                message += `${
                  index + 1
                }. ${diseaseName} (Probability: ${probability})\n`;

                // Add more information as needed
                const description = disease.disease_details.description;
                const treatment = disease.disease_details.treatment;
                message += `Description: ${description}\n`;

                // Handle the treatment details
                if (treatment) {
                  const chemicalTreatment = treatment.chemical;
                  const biologicalTreatment = treatment.biological;
                  const prevention = treatment.prevention;

                  if (chemicalTreatment) {
                    message += `Chemical Treatment: ${chemicalTreatment.join(
                      ", "
                    )}\n`;
                  }

                  if (biologicalTreatment) {
                    message += `Biological Treatment: ${biologicalTreatment.join(
                      ", "
                    )}\n`;
                  }

                  if (prevention) {
                    message += `Prevention: ${prevention.join(", ")}\n`;
                  }
                }
              });
            }
          }

          form.elements.message.value = message;
          form.dispatchEvent(new Event("submit"));
          loadingIndicator.classList.toggle("hidden");
          submit_image_btn.classList.toggle("hidden");
        } else {
          console.error("Error in disease identification:", response.status);
          // Handle the error here
        }
      } catch (error) {
        console.error("Error in disease identification:", error);
        // Handle the error here
      }
    };

    reader.readAsDataURL(selectedFile);
  } else {
    console.error("No image selected.");
    // Handle the case where no image is selected
  }

  loadingIndicator.classList.toggle("hidden");
  submit_crop_image_btn.classList.toggle("hidden");
});

// function to format the response from the bot
function formatMessage(rawText) {
  const markdown = new markdownit();
  return markdown.render(rawText);
}

new_message_btn.addEventListener("click", createNewMessage);
floatingActionBtn.addEventListener("click", createNewMessage);

function createNewMessage() {
  fetch("/new-chat", {
    method: "POST",
  })
    .then((response) => {
      if (response.redirected) {
        window.location.href = response.url;
      }
    })
    .catch((error) => {
      console.error("Error creating a new chat:", error);
    });
}
