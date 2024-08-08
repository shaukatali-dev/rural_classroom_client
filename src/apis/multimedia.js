export const speechToText = async (blob) => {
  const formData = new FormData();
  formData.append("file", blob);
  const response = await fetch("https://btp-backend-n3xs.onrender.com/transcribe", {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  console.log(data);
  return data.transcript;
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
  const response = await fetch("https://btp-backend-n3xs.onrender.com/process", {
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
