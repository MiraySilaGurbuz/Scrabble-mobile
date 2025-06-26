import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'

export default function StartupScreen({navigation}) {
  return (
    <View style={styles.container}>
      <Image
          style={styles.Logo}
          source={require('../images/Logo3.png')}
        />
      <Text style={styles.title}>Scrabble</Text>
          
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('Login', { mode: 'register' })}
      >
        <Text style={styles.buttonText}>Kayıt Ol</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('Login', { mode: 'login' })}
      >
        <Text style={styles.buttonText}>Kullanıcı Girişi</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('AnaSayfa')}
      >
        <Text style={styles.buttonText}>Misafir Girişi</Text>
      </TouchableOpacity>*/}
      
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#004d00',
  },
  Logo: {
    width: 110,
    height: 110,
    borderRadius: 60,
    marginBottom: 30,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#004d00',
    fontWeight: 'bold',
  },
});