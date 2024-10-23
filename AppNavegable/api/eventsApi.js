import apiManager from "./ApiManager";
import userApi from "./userApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
const get_Events = async () => {
  const headers = {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": true,  
  };
  const data = {}
  try {
    console.log
    const result = await apiManager('GET', headers, data, 'event');
    console.log(result);
    return result;
  } catch (error) {
    console.error('Error en la solicitud:', error);
    return { error: error.message };
  }
};
const create_Events = async (data, token) => {
    if (typeof token !== 'string') {
      console.error('Token should be a string.');
      return { error: 'Invalid token' };
    }

    console.log( "mostrar data antes de mandar " + JSON.stringify(data,null,2))
  
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "ngrok-skip-browser-warning": true,  
    };
  
    console.log("TOKEN:", token);
  
    try {
      const result = await apiManager('POST', headers, data, 'event/createEvent');
      console.log(result);
      return result;
    } catch (error) {
      console.error('Error en la solicitud:', error);
      return { error: error.message };
    }
  };

  const enrollment_event = async (token,eventid) =>
  {
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "ngrok-skip-browser-warning": true,  
    };
  const data = {}
    console.log("TOKEN:", token);
  
    try {
      const result = await apiManager('POST', headers, data, `event/${eventid}/enrollment`);
      console.log(result);
      return result;
    } catch (error) {
      console.error('Error en la solicitud:', error);
      return { error: error.message };
    }
  }

  const getMaxCapacity = async (token, idLocation) =>
  {
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "ngrok-skip-browser-warning": true,  
    };
  const data = {}
    console.log("TOKEN:", token);
  
    try {
      const result = await apiManager('POST', headers, data, `event/${idLocation}`);
      console.log(result);
      return result;
    } catch (error) {
      console.error('Error en la solicitud:', error);
      return { error: error.message };
    }
  }





export default { get_Events,create_Events, enrollment_event, getMaxCapacity};