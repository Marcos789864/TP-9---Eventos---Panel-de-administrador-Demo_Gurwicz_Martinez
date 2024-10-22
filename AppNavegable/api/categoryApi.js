import apiManager from "./ApiManager";
import AsyncStorage from "@react-native-async-storage/async-storage";
const get_Category = async () => {
  const headers = {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": true,  
  };
  const data = {}
  try {
    console.log
    const result = await apiManager('Get', headers, data, 'event-category/getAll');
    console.log(result);
    return result;
  } catch (error) {
    console.error('Error en la solicitud:', error);
    return { error: error.message };
  }
};



export default { get_Category};