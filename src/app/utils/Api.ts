import axios from "axios";

const getImageFromText = async (payload: any, setDesignLoading: any) => {
  const config = {
    headers: {
      "api-key": `d1e2250410344c07a98d8cdda127d822`, // Replace with your actual token
      "x-ms-api-devportal": "dalle-3", // This is usually the default for POST requests with JSON, but it's good practice to include it
      Accept: "*",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "cross-site",
      Origin: "https://tlx-ai-hackathon-2024.developer.azure-api.net",
    },
  };

  return axios
    .post("http://localhost:8087/api/dalle", payload)
    .then((response: any) => {
      // Handle the response
      console.log(response, " response ");
      return response?.data?.url;
    })
    .catch((error) => {
      return error;
    })
    .finally(()=>{
      setDesignLoading(false)
    })
    ;
};

export { getImageFromText };
