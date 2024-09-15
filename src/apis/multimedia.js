import { BASEML } from "../constants/endpoints";
export const speechToText = async (blob, language) => {
  const formData = new FormData();
  
  formData.append("file", blob); // Append the audio blob
  if (language) {
    formData.append("language", language); // Append the selected language if provided
  }

  // Log the formData contents for debugging
  console.log("FormData created:", formData);
  
  try {
    // Log the start of the API request
    console.log("Starting fetch request to transcribe audio...");

    // Send the request to your speech-to-text API
    const response = await fetch(`${BASEML}/transcribe`, {
      method: "POST",
      body: formData, // Send the form data containing the blob and language
    });

    // Log the response object for debugging
    console.log("Fetch response:", response);

    // Check if the response is okay (status 200-299)
    if (!response.ok) {
      throw new Error(`Failed to transcribe audio: ${response.statusText}`);
    }

    // Log the successful response before parsing it
    console.log("Successfully received response, parsing JSON...");

    const data = await response.json(); // Parse the JSON response

    // Log the data for debugging
    console.log("Parsed data:", data);

    // Return the transcript from the data
    return data.transcript;
  } catch (error) {
    // Log any errors encountered
    console.error("Error in speechToText function:", error);
    throw error; // Rethrow the error for handling in the calling function
  }
};


export const getDoubtsFromImage = async (blob) => {
  //   const formData = new FormData();
  //   formData.append("image", blob);
  //   const response = await fetch("https://speech-to-text-demo.ng.bluemix.net/api/v1/recognize", {
  //     method: "POST",
  //     body: formData,
  //   });
  //   const data = await response.json();
  //   return data.results[0].alternatives[0].transcript;

  // dummy 1 second response
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return 20;
};

export const getFilteredMessages = async (messages) => {
  const rawData = {
    texts: messages.map((message) => message.text),
  };
  const response = await fetch(`${BASEML}/process`, {
    method: "POST",
    body: JSON.stringify(rawData),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
};

export const getResponsesFromImage = async (blob) => {
  const formData = new FormData();
  formData.append("file", blob);
  const response = await fetch("https://a4f5-203-110-242-13.ngrok-free.app/uploadfile/", {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  return data.text
    .filter((element) => element.split(" ").length === 2)
    .map((element) => {
      const [roll, response] = element.split(" ");
      return {
        roll: parseInt(roll),
        response,
      };
    });
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  // return [
  //   {
  //     roll: 1,
  //     response: "B",
  //   },
  //   {
  //     roll: 2,
  //     response: "B",
  //   },
  //   {
  //     roll: 3,
  //     response: "C",
  //   },
  //   {
  //     roll: 4,
  //     response: "C",
  //   },
  //   {
  //     roll: 5,
  //     response: "D",
  //   },
  //   {
  //     roll: 6,
  //     response: "D",
  //   },
  //   {
  //     roll: 7,
  //     response: "A",
  //   },
  // ];
};

export const getAttendanceFromImage = async (blob) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return [1, 2, 4, 7];
};
