import { BASEML } from "../constants/endpoints";
export const speechToText = async (blob, language) => {
  const formData = new FormData();
  
  formData.append("file", blob); // Append the audio blob
  if (language) {
    formData.append("language", language); // Append the selected language if provided
  }

  try {
    console.log("Starting fetch request to transcribe audio...");

    const response = await fetch(`${BASEML}/transcribe`, {
      method: "POST",
      body: formData, // Send the form data containing the blob and language
    });

    // Check if the response is okay (status 200-299)
    if (!response.ok) {
      throw new Error(`Server responded with an error: ${response.statusText}`);
    }

    const data = await response.json(); // Parse the JSON response

    // Log the data for debugging
    console.log("Transcription response:", data);

    return data.transcript;
  } catch (error) {
    // Gracefully handle fetch errors without causing a runtime error
    console.error("Error in speechToText:", error.message || "Failed to fetch");

    // Optionally, return a default message or empty string to handle gracefully
    return "error";
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
  const response = await fetch(`${BASEML}/mcq-analysis/`, {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  console.log("data",data);
  const responseAnalysis = data.extracted_mcq_with_roll
  return responseAnalysis;
  
};

export const getAttendanceFromImage = async (blob) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return [1, 2, 4, 7];
};
