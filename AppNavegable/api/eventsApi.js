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

  const enrollment_event = async (token,eventid,userid) =>
  {
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "ngrok-skip-browser-warning": true,  
    };
  const data = {}
    console.log("TOKEN:", token);
  
    try {
      const result = await apiManager('POST', headers, data, `event/${eventid}/${userid}/enrollment`);
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
  const getAll_Events = async () => {
    const headers = {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": true,  
    };
    const data = {}
    try {
      console.log
      const result = await apiManager('GET', headers, data, 'event/getAll');
      console.log(result);
      return result;
    } catch (error) {
      console.error('Error en la solicitud:', error);
      return { error: error.message };
    }
  };
  

  const updateEvent = async (token,data) => {
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "ngrok-skip-browser-warning": true,  
    };
    console.log("data" + JSON.stringify(data));
    try {
      console.log
      const result = await apiManager('PATCH', headers, data, 'event');
      console.log(result);
      return result;
    } catch (error) {
      console.error('Error en la solicitud:', error);
      return { error: error.message };
    }
  };

  const eventDetail = async (token,idEvento) => {
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "ngrok-skip-browser-warning": true,  
    };
    console.log("id Evento antes de enviar "+ idEvento);
    const data= {};
    try {
      console.log
      const result = await apiManager('GET', headers, data, `event/getDetail/${idEvento}`);
      console.log(result);
      return result;
    } catch (error) {
      console.error('Error en la solicitud:', error);
      return { error: error.message };
    }
  };

  const usersFromEvent = async (token,idEvent) => {
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "ngrok-skip-browser-warning": true,  
    };
    console.log("id Evento antes de enviar "+ idEvent);
    const data = {};
    try {
      console.log
      const result = await apiManager('GET', headers, data, `event/${idEvent}/enrollment`);
      console.log(result);
      return result;
    } catch (error) {
      console.error('Error en la solicitud:', error);
      return { error: error.message };
    }
  };

  const deleteEvent = async (token,idUser,idEvento) => {
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "ngrok-skip-browser-warning": true,  
    };
    console.log("id Evento antes de enviar "+ idEvento);
    const data= {};
    try {
      console.log
      const result = await apiManager('DELETE', headers, data, `event/${idEvento}/${idUser}/del`);
      console.log(result);
      return result;
    } catch (error) {
      console.error('Error en la solicitud:', error);
      return { error: error.message };
    }
  };




export default { get_Events,create_Events, enrollment_event, getMaxCapacity,getAll_Events, updateEvent,eventDetail,usersFromEvent,deleteEvent};