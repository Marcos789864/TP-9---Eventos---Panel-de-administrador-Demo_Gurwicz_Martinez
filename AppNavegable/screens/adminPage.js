import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import eventsApi from '../api/eventsApi';
import { useNavigation } from '@react-navigation/native'; 
import Navbar from '../components/navbar';
import moment from 'moment'; 

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

const adminPage = ({ route }) => {
  const { token } = route.params;
  const [user, setUser] = useState({});
  const [currentEvents, setCurrentEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const navigation = useNavigation(); 

  useEffect(() => {
    if (token) {
      const decodedUser = decodeTokenManual(token);
      setUser(decodedUser);
    }
    
    const fetchEvents = async () => {
      try {
        const response = await eventsApi.get_Events();
        const eventsArray = Array.isArray(response.data) ? response.data : [];
        const currentDate = moment();

        const upcomingEvents = eventsArray.filter(event => {
          const eventDate = moment(event.start_date);
          return eventDate.isAfter(currentDate, 'day') || eventDate.isSame(currentDate, 'day');
        });

        const expiredEvents = eventsArray.filter(event => {
          const eventDate = moment(event.start_date);
          return eventDate.isBefore(currentDate, 'day');
        });
        console.log("upcomingevents" + JSON.stringify(upcomingEvents, null,2));
        setCurrentEvents(upcomingEvents);
        setPastEvents(expiredEvents);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };
    
    fetchEvents();
  }, [token]);


  const openModal = async (type, eventId) => {
    console.log( "id del evento" + eventId)
    try {
      if (type === 'detail') {
        
        const response = await eventsApi.eventDetail(eventId);
        setModalContent({ title: 'Detalle del Evento', data: response.data });
      } else if (type === 'participants') {
        console.log("data eventid" + eventId);
        const response = await eventsApi.usersFromEvent(eventId);
        setModalContent({ title: 'Participantes', data: response.data });
      }
      setModalVisible(true);
    } catch (error) {
      console.error('Error al cargar el modal:', error);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalContent(null);
  };

  const renderEvent = (event, isEditable) => (
    <View style={styles.eventItem}>
      <Text style={styles.eventTitle}>{event.name}</Text>
      <Text style={styles.eventDate}>{event.description}</Text>
      <TouchableOpacity 
        style={styles.detailButton} 
        onPress={() => openModal('detail', event.id)}>
        <Text style={styles.buttonText}>Ver Detalle</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.participantsButton} 
        onPress={() => openModal('participants', event.id)}>
        <Text style={styles.buttonText}>Ver Participantes</Text>
      </TouchableOpacity>
      
      {isEditable && (
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={() => navigation.navigate('editarEvento', { event, token })}>
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido, {user.username}!</Text>
      <Navbar />

      <Text style={styles.sectionTitle}>Eventos Vigentes</Text>
      <FlatList
        data={currentEvents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => renderEvent(item, true)}
      />

      <Text style={styles.sectionTitle}>Eventos Pasados</Text>
      <FlatList
        data={pastEvents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => renderEvent(item, false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'left',
  },
  eventItem: {
    padding: 10,
    marginVertical: 8,
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
  editButton: {
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  detailButton: {
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#28a745',
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  participantsButton: {
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#ffc107',
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default adminPage;