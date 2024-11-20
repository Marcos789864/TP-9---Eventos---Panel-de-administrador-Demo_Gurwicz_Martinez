import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Picker, Switch, Alert, Modal, TouchableOpacity, ScrollView } from 'react-native';
import categoryApi from '../api/categoryApi';
import locationsApi from '../api/locationsApi';
import eventsApi from '../api/eventsApi';

const EditarEvento = ({ route, navigation }) => {
  const { token, event } = route.params;

  const [form, setForm] = useState({
    id: event.id || '',
    name: event.name || '',
    description: event.description || '',
    id_event_category: event.id_event_category || '',
    id_event_location: event.id_event_location || '',
    start_date: event.start_date || '',
    duration_in_minutes: event.duration_in_minutes || '',
    price: event.price || '',
    enabled_for_enrollment: event.enabled_for_enrollment || false,
    max_assistance: event.max_assistance || '',
    id_creator_user: event.id_creator_user || '',
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
        console.log("token" + token);
      const response = await eventsApi.updateEvent(token,form);
      console.log('Event update response:', response);
      setModalVisible(false);
      setSuccessModalVisible(true);
    } catch (error) {
      console.error('Error updating event:', error);
      Alert.alert('Error', 'There was an error updating the event.');
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleSuccessClose = () => {
    setSuccessModalVisible(false);
    navigation.navigate('Home', { token });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("adminPage", { token })}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Edit Event</Text>
      
  
      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={styles.input}
        value={form.name}
        onChangeText={(text) => handleInputChange('name', text)}
      />
      {errors.name && <Text style={styles.error}>{errors.name}</Text>}

      {/* Description */}
      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={styles.input}
        value={form.description}
        onChangeText={(text) => handleInputChange('description', text)}
      />
      {errors.description && <Text style={styles.error}>{errors.description}</Text>}

      {/* Category */}
      <Text style={styles.label}>Event Category:</Text>
      <Picker
        selectedValue={form.id_event_category}
        style={styles.picker}
        onValueChange={(value) => handleInputChange('id_event_category', value)}
      >
        <Picker.Item label="Select a category" value="" />
        {categories.map((cat) => (
          <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
        ))}
      </Picker>
      {errors.id_event_category && <Text style={styles.error}>{errors.id_event_category}</Text>}

      {/* Location */}
      <Text style={styles.label}>Event Location:</Text>
      <Picker
        selectedValue={form.id_event_location}
        style={styles.picker}
        onValueChange={(value) => handleInputChange('id_event_location', value)}
      >
        <Picker.Item label="Select a location" value="" />
        {locations.map((loc) => (
          <Picker.Item key={loc.id} label={loc.name} value={loc.id} />
        ))}
      </Picker>
      {errors.id_event_location && <Text style={styles.error}>{errors.id_event_location}</Text>}

      {/* Other Fields */}
      <Text style={styles.label}>Start Date:</Text>
      <TextInput
        style={styles.input}
        value={form.start_date}
        onChangeText={(text) => handleInputChange('start_date', text)}
      />
      {errors.start_date && <Text style={styles.error}>{errors.start_date}</Text>}

      <Text style={styles.label}>Duration (minutes):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={form.duration_in_minutes.toString()}
        onChangeText={(text) => handleInputChange('duration_in_minutes', text)}
      />
      {errors.duration_in_minutes && <Text style={styles.error}>{errors.duration_in_minutes}</Text>}

      <TouchableOpacity style={styles.submitButton} onPress={handleConfirm}>
        <Text style={styles.submitButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
  picker: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  error: {
    color: 'red',
    fontSize: 12,
  },
  backButton: {
    marginVertical: 10,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: '#007bff',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default EditarEvento;