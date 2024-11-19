import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import eventsApi from '../api/eventsApi';
import { View, Text, StyleSheet,FlatList, TouchableOpacity } from 'react-native';

const aplicarEvento = ( {route}) =>
{
  const { token } = route.params;
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [form, setform] = useState([]);

   
   
   
    const decodeTokenManual = (token) => {
      try {
        const [header, payload, signature] = token.split('.');
        
        if (!payload) {
          throw new Error('Invalid token');
        }
        const base64Url = payload.replace(/_/g, '/').replace(/-/g, '+');
        const base64 = atob(base64Url);
        const user = JSON.parse(base64);
        return user;
      } catch (error) {
        console.error('Manual token decoding error:', error);
        return null;
      }
    };

   
      

    const getFilteredEvents = async () => {
      try {
        const async = await AsyncStorage.getItem('filteredEvents');
        
        if (async != null) {

          const events = JSON.parse(async);
          console.log("Eventos:", events);  
          const validatedEvents = await Promise.all(events.map(async (event) => {
            console.log("Validando evento:", event.name); 
            try {
              const isValid = await eventsApi.getMaxCapacity(parseInt(event.id_event_location));
              return isValid ? event : null; 
            } catch (error) {
              console.error(`Error validando evento ${event.name}:`, error);
              return null; 
            }
          }));
          const filteredValidEvents = validatedEvents.filter(event => event !== null);
          console.log("Eventos validados y filtrados:", filteredValidEvents);
          setFilteredEvents(filteredValidEvents);
        } else {
          console.warn("No se encontraron eventos en AsyncStorage");
        }
      } catch (e) {
        console.error("Error al leer los eventos filtrados:", e);
      }
    };

    useEffect(() => {
        getFilteredEvents();
    }, []);
  

    const applyforEvent = async (idEvent) =>
    {
        const storedToken = await AsyncStorage.getItem("storedToken");
        console.log("evento id" + idEvent);
      const user = decodeTokenManual(token);
        try
        {
            const response = await eventsApi.enrollment_event(storedToken,idEvent,user.id);
            console.log(response);
        }
        catch(e)
        { console.log(e)}
    }

    return (
        <View style = {styles.container}>

            <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.eventItem}>
            <Text style={styles.eventTitle}>{item.name}</Text>
            <Text style={styles.eventDate}>{item.description}</Text>
            <TouchableOpacity onPress={() => applyforEvent(item.id)}><Text>Incribirse</Text></TouchableOpacity>
          </View>
        )}
      />
        </View>
    );
}

export default aplicarEvento;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
      },
      eventItem: {
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        backgroundColor: '#fff',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      eventTitle: {
        fontSize: 18,
        fontWeight: 'bold',
      },
      eventDate: {
        fontSize: 14,
        color: '#666',
      },
})