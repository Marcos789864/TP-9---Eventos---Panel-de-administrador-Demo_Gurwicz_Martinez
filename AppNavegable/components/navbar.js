import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 

const Navbar = () => {

  const navigation = useNavigation();
  return (

    <View style={styles.navbar}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("aplicarEvento")}><Text style={styles.navItem}>Inscripciones</Text> </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create( {
    navbar: {
      display: 'flex',
      justifyContent: 'space-between',
      backgroundColor: '#93c7ba', 
      padding: '10px',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 1,
      fontFamily: 'Arial, sans-serif',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    },
    logo: {
      height: '80px',
      width: 'auto', 
      maxWidth: '100%',
      objectFit: 'contain',
    },
    navItems: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginRight: '2%',
    },
    navItem: {
      color: '#ffffff',
      textDecoration: 'none',
      fontSize: '18px',
      fontWeight: '600',
      padding: '10px 15px',
      borderRadius: '4px',
      transition: 'background-color 0.3s',
    },
  });
  
  export default Navbar;