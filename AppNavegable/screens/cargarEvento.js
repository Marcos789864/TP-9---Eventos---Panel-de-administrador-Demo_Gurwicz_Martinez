import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Picker, Switch, Alert, Modal, TouchableOpacity } from 'react-native';
import categoryApi from '../api/categoryApi';
import locationsApi from '../api/locationsApi';
import eventsApi from '../api/eventsApi';


const CargarEvento = ({ route, navigation }) => {
  const { token } = route.params;
  const [form, setForm] = useState({
    name: '',
    description: '',
    id_event_category: '',
    id_event_location: '',
    start_date: '',
    duration_in_minutes: '',
    price: '',
    enabled_for_enrollment: false,
    max_assistance: '',
    id_creator_user: '',
  });

  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [errors, setErrors] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false); 

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryApi.get_Category();
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    const fetchLocations = async () => {
      try {
        const response = await locationsApi.get_Locations(token);
        setLocations(response.data);
      } catch (error) {
        console.error('Failed to fetch locations:', error);
      }
    };

    fetchCategories();
    fetchLocations();
  }, [token]);

  const handleInputChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = 'Name is required';
    if (!form.description) newErrors.description = 'Description is required';
    if (!form.id_event_category) newErrors.id_event_category = 'Event category is required';
    if (!form.id_event_location) newErrors.id_event_location = 'Event location is required';
    if (!form.start_date) newErrors.start_date = 'Start date is required';
    if (!form.duration_in_minutes || isNaN(form.duration_in_minutes) || form.duration_in_minutes <= 0)
      newErrors.duration_in_minutes = 'Duration must be a positive number';
    if (!form.price || isNaN(form.price) || form.price <= 0) newErrors.price = 'Price must be a positive number';
    if (!form.max_assistance || isNaN(form.max_assistance) || form.max_assistance <= 0)
      newErrors.max_assistance = 'Max assistance must be a positive number';
    if (!form.id_creator_user || isNaN(form.id_creator_user)) newErrors.id_creator_user = 'Creator user ID is required' ;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {

      setModalVisible(true);
    }
  };

  const handleConfirm = async () => {
    try {
      console.log( typeof(form.id_creator_user))
      const response = await eventsApi.create_Events(form, token);
      console.log('Event creation response:', response);
      setModalVisible(false);
      setSuccessModalVisible(true); 
    } catch (error) {
      console.error('Error creating event:', error);
      Alert.alert('Error', 'There was an error creating the event.');
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleSuccessClose = () => {
    setSuccessModalVisible(false);
  };

  return (
    <View style={styles.container}>
     <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Home", { token })}>
  <Text style={styles.backButtonText}>Back</Text>
</TouchableOpacity>

      <Text style={styles.title}>Event Form</Text>

      <Text>Name:</Text>
      <TextInput
        style={styles.input}
        value={form.name}
        onChangeText={(text) => handleInputChange('name', text)}
      />
      {errors.name && <Text style={styles.error}>{errors.name}</Text>}

      <Text>Description:</Text>
      <TextInput
        style={styles.input}
        value={form.description}
        onChangeText={(text) => handleInputChange('description', text)}
      />
      {errors.description && <Text style={styles.error}>{errors.description}</Text>}

      <Text>Event Category:</Text>
      <Picker
        selectedValue={form.id_event_category}
        style={styles.picker}
        onValueChange={(itemValue) => handleInputChange('id_event_category', itemValue)}
      >
        <Picker.Item label="Select a category" value="" />
        {categories.map((category) => (
          <Picker.Item key={category.id} label={category.name} value={ parseInt(category.id)} />
        ))}
      </Picker>
      {errors.id_event_category && <Text style={styles.error}>{errors.id_event_category}</Text>}

      <Text>Event Location:</Text>
      <Picker
        selectedValue={form.id_event_location}
        style={styles.picker}
        onValueChange={(itemValue) => handleInputChange('id_event_location', itemValue)}
      >
        <Picker.Item label="Select a location" value="" />
        {locations.map((location) => (
          <Picker.Item key={location.id} label={location.name} value={location.id} />
        ))}
      </Picker>
      {errors.id_event_location && <Text style={styles.error}>{errors.id_event_location}</Text>}

      <Text>Start Date:</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={form.start_date}
        onChangeText={(text) => handleInputChange('start_date', text)}
      />
      {errors.start_date && <Text style={styles.error}>{errors.start_date}</Text>}

      <Text>Duration (in minutes):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={form.duration_in_minutes}
        onChangeText={(text) => handleInputChange('duration_in_minutes',  text ? parseInt(text, 10) : '')}
      />
      {errors.duration_in_minutes && <Text style={styles.error}>{errors.duration_in_minutes}</Text>}

      <Text>Price:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={form.price}
        onChangeText={(value) => handleInputChange('price',  value ? parseInt(value, 10) : '')}
      />
      {errors.price && <Text style={styles.error}>{errors.price}</Text>}

      <Text>Enabled for Enrollment:</Text>
      <Switch
        value={form.enabled_for_enrollment}
        onValueChange={(value) => handleInputChange('enabled_for_enrollment', value)}
      />

      <Text>Max Assistance:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={form.max_assistance}
        onChangeText={(value) => handleInputChange('max_assistance',  value ? parseInt(value, 10) : '' )}
      />
      {errors.max_assistance && <Text style={styles.error}>{errors.max_assistance}</Text>}

      <Text>Creator User ID:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={form.id_creator_user}
        onChangeText={(value) => handleInputChange('id_creator_user', value ? parseInt(value, 10) : '')}
      />
      {errors.id_creator_user && <Text style={styles.error}>{errors.id_creator_user}</Text>}

      <Button title="Submit" onPress={handleSubmit} />
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Event Creation</Text>
            <Text>Name: {form.name}</Text>
            <Text>Description: {form.description}</Text>
            <Text>Category: {categories.find(cat => cat.id === form.id_event_category)?.name}</Text>
            <Text>Location: {locations.find(loc => loc.id === form.id_event_location)?.name}</Text>
            <Text>Start Date: {form.start_date}</Text>
            <Text>Duration: {form.duration_in_minutes} minutes</Text>
            <Text>Price: ${form.price}</Text>
            <Text>Enabled for Enrollment: {form.enabled_for_enrollment ? 'Yes' : 'No'}</Text>
            <Text>Max Assistance: {form.max_assistance}</Text>
            <Text>Creator User ID: {form.id_creator_user}</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleConfirm}>
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleCancel}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={successModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleSuccessClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Evento creado exitosamente</Text>
            <Text>Tu evento fue creado exitosamente.</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleSuccessClose}>
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 20,
  },
  modalButton: {
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
  backButton: {
    backgroundColor: '#007bff',
    borderRadius: 5,            
    padding: 10,                
    alignItems: 'center',       
    marginBottom: 20,           
  },
  
  backButtonText: {
    color: 'white',             
    fontSize: 16,               
    fontWeight: 'bold',         
  },
});

export default CargarEvento;