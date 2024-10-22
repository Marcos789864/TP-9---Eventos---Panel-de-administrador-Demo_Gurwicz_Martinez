import axios from "axios";
  
const baseURL = "http://localhost:3000/api";

const apiManager = async (method, headers, data, path) => {
  console.log('Headers:', headers);  
  try {
    const response = await axios({
      method: method,
      url: `${baseURL}/${path}`,
      data: data,
      headers: headers,
    });
    console.log('Response:', response);  
    return response;  
  } catch (error) {
    console.error(`Error en la solicitud POST a ${path}: ${error.message}`);
    throw new Error(`Error en la solicitud POST a ${path}: ${error.message}`);
  }
};

export default apiManager;