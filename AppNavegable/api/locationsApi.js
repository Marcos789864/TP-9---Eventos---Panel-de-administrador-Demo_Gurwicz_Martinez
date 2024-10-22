import apiManager from "./ApiManager";


const get_Locations = async (token) => {
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
    "ngrok-skip-browser-warning": true,  
  };
  const data = {}
  try {
    console.log
    const result = await apiManager('Get', headers, data, 'event-location/getAll');
    console.log(result);
    return result;
  } catch (error) {
    console.error('Error en la solicitud:', error);
    return { error: error.message };
  }
};



export default { get_Locations};