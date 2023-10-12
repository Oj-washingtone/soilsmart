import Replicate from "replicate";
import dotenv from "dotenv";
const apiToken = dotenv.config();

class ReplicateResponseHandler {
  constructor() {
    this.apiToken = "r8_VRX6VTqBQtXAaPLuvS3L5SmFowJApZG1hkFna";
    this.model =
      "meta/llama-2-70b-chat:02e509c789964a7ea8736978a43525956ef40397be9033abf9fd2badfe68c9e3";
  }

  getResponse = async (userInput) => {
    // authenticate API
    const replicate = new Replicate({
      auth: this.apiToken,
    });

    const prediction = await replicate.predictions.create({
      version:
        "2c1608e18606fad2812020dc541930f2d0495ce32eee50074220b87300bc16e1",
      input: { prompt: userInput },
      stream: true,
    });

    return prediction;
  };
}

export default ReplicateResponseHandler;
