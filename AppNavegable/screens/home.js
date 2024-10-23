import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import eventsApi from '../api/eventsApi';
import { useNavigation } from '@react-navigation/native'; 
import Navbar from '../components/navbar';
import moment from 'moment'; 
import AsyncStorage from '@react-native-async-storage/async-storage';


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

const Home = ({ route }) => {
  const { token } = route.params;
  const [user, setUser] = useState({});
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation(); 

  useEffect( () => {
    if (token) {
      const decodedUser = decodeTokenManual(token);
      setUser(decodedUser);
    }
    
    const fetchEvents = async () => {
      try {
          const response = await eventsApi.get_Events();
          console.log('Response:', response); 
  
          const eventsArray = Array.isArray(response.data) ? response.data : [];
          const currentDate = moment();
          const filteredEvents = eventsArray.filter(event => {
              const eventDate = moment(event.start_date);
              return eventDate.isAfter(currentDate, 'day') || eventDate.isSame(currentDate, 'day'); 
          });
  
  
          await AsyncStorage.setItem('filteredEvents', JSON.stringify(filteredEvents));
  
          setEvents(filteredEvents);
      } catch (error) {
          console.error('Failed to fetch events:', error);
      } 
  };
    
    fetchEvents();;
  }, [token]);

  

  return (
    <View style={styles.container}>
     
      <Text style={styles.title}>Bienvenido, {user.username}!</Text>
    <Navbar></Navbar>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.eventItem}>
            <Text style={styles.eventTitle}>{item.name}</Text>
            <Text style={styles.eventDate}>{item.description}</Text>
          </View>
        )}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('CargarEvento', { token })} 
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20, 
    alignSelf: 'center', 
    position: 'relative', 
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default Home;

