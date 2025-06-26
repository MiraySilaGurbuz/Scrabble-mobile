import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './screens/HomeScreen';
import GameScreen from './screens/GameScreen';
import RulesScreen from './screens/RulesScreen';
import StartupScreen from './screens/StartupScreen';
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';
import AntDesign from '@expo/vector-icons/AntDesign';
import Foundation from '@expo/vector-icons/Foundation';
import { useNavigation } from '@react-navigation/native';
import ScoreScreen from './screens/ScoreScreen';
import MyGamesScreen from './screens/MyGamesScreen';
import FriendsScreen from './screens/FriendsScreen';
import { addMultipleBoards } from './services/boardService';
import { addMultipleEnglishLetters } from './services/LetterService';
import { addMultipleTurkishLetters } from './services/LetterService';
import { addStaticGameBoardSquare } from './services/gameService';
import { Feather } from '@expo/vector-icons';


const Stack = createNativeStackNavigator();

//addMultipleBoards();
//addMultipleEnglishLetters();
//addMultipleTurkishLetters();
//addStaticGameBoardSquare();

//getRandomUnusedTurkishLetter(1);
//addStaticHarfOyuncuMap();
//getActiveLetterCountForPlayer(1, '7Og7biF9KqfbrMTKdy2DbUvzkxV2');

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Startup">
        <Stack.Screen options={{headerShown: false}} name="Startup" component={StartupScreen} />
        <Stack.Screen options={({ route }) => ({
            headerTitle: () => (
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                {route.params?.mode === 'register' ? 'Kayıt Ol' : 'Giriş Yap'}
              </Text>
            )
          })} name="Login" component={LoginScreen} />
        <Stack.Screen options={{headerShown: false}} name="AnaSayfa" component={HomeScreen} />
        <Stack.Screen options={{headerShown: false}} name="OyunSayfasi" component={GameScreen} />        
        <Stack.Screen options={{headerShown: false}} name="KurallarSayfasi" component={RulesScreen} />
        <Stack.Screen
          name="ProfilSayfasi"
          component={ProfileScreen}
          options={({ navigation }) => ({
            headerTitleAlign: 'center',
            headerTitle: () => (
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Profil</Text>
            ),
            headerLeft: () => <GoBackButton />,
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.setParams({ toggleEdit: true })} style={{ marginRight: 10 }}>
                <Feather name="edit-3" size={22} color="#004d00" />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen options={{headerShown: false}} name="Skorlar" component={ScoreScreen} />
        <Stack.Screen options={{headerShown: false}} name="Oyunlarim" component={MyGamesScreen} />
        <Stack.Screen  options={{headerShown: false}} name="Arkadaslarim" component={FriendsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  
});

function SettingButton({ onPress }) {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={{ padding: 10 }}
    >
      <Foundation name="pencil" size={24} color="black" />
    </TouchableOpacity>
  );
}

function GoBackButton({ onPress }) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity 
      onPress={() => navigation.goBack()}  
      style={{ padding: 10 }}
    >
      <AntDesign name="left" size={24} color="black" />
    </TouchableOpacity>
  );
}