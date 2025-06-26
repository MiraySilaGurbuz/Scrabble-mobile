import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getDatabase, ref as dbRef, push } from 'firebase/database';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isim, setIsim] = useState('');
  const [soyisim, setSoyisim] = useState('');
  const [telefon, setTelefon] = useState('');
  const [profilResmi, setProfilResmi] = useState('profiller1.jpg');

  const navigation = useNavigation();
  const route = useRoute();
  const mode = route.params?.mode || 'login';

  const profilResimListesi = [
    'profiller1.jpg',
    'profiller2.jpg',
    'profiller3.jpg',
    'profiller4.jpg',
    'profiller5.jpg',
  ];

  const getImageSource = (filename) => {
    switch (filename) {
      case 'profiller1.jpg': return require('../assets/profiller/profiller1.jpg');
      case 'profiller2.jpg': return require('../assets/profiller/profiller2.jpg');
      case 'profiller3.jpg': return require('../assets/profiller/profiller3.jpg');
      case 'profiller4.jpg': return require('../assets/profiller/profiller4.jpg');
      case 'profiller5.jpg': return require('../assets/profiller/profiller5.jpg');
      default: return require('../images/profile.jpg');
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate('AnaSayfa');
      }
    });

    return unsubscribe;
  }, []);

  const handleSignUp = async () => {
  try {
    const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredentials.user;

    // @ öncesini al
    const userNameFromEmail = email.split('@')[0];

    const dbInstance = getDatabase();
    const usersRef = dbRef(dbInstance, 'users');
    await push(usersRef, {
      Email: user.email,
      UserId: user.uid,
      UserName: userNameFromEmail,        // ← otomatik üretilen kullanıcı adı
      Isim: isim,                          // ← girilen ad
      Soyisim: soyisim,                    // ← girilen soyad
      Telefon: telefon,                    // ← girilen telefon
      profilResmi: profilResmi,            // ← seçilen dosya adı
      IsActive: true,
      createdAt: new Date().toISOString(),
    });

    console.log('✅ Kullanıcı başarıyla kaydedildi ve veritabanına eklendi.');
  } catch (error) {
    console.log('🛑 Kayıt hatası:', error.message);
  }
};


  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log('Giriş başarılı:', user.email);
      })
      .catch((error) => console.log(error.message));
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View>
        <Image style={styles.Logo} source={require('../images/Logo3.png')} />
      </View>

      {mode === 'register' && (
        <>
          <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>
            Profil Fotoğrafı Seç
          </Text>
          <View style={styles.imageSelectionContainer}>
            {profilResimListesi.map((resim) => (
              <TouchableOpacity
                key={resim}
                onPress={() => setProfilResmi(resim)}
                style={[
                  styles.imageOption,
                  profilResmi === resim && styles.selectedImage,
                ]}
              >
                <Image source={getImageSource(resim)} style={styles.imageThumbnail} />
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Şifre"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />

        {mode === 'register' && (
          <>
            <TextInput
              style={styles.input}
              placeholder="İsim"
              value={isim}
              onChangeText={(text) => setIsim(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Soyisim"
              value={soyisim}
              onChangeText={(text) => setSoyisim(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Telefon"
              keyboardType="phone-pad"
              value={telefon}
              onChangeText={(text) => setTelefon(text)}
            />
          </>
        )}
      </View>

      <View style={styles.buttonContainer}>
        {mode === 'login' && (
          <TouchableOpacity onPress={handleLogin} style={styles.button}>
            <Text style={styles.buttonText}>Giriş Yap</Text>
          </TouchableOpacity>
        )}

        {mode === 'register' && (
          <TouchableOpacity
            onPress={handleSignUp}
            style={[styles.button, styles.outlineButton]}
          >
            <Text style={styles.outlineButtonText}>Kayıt Ol</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Logo: {
    width: 110,
    height: 110,
    borderRadius: 60,
    marginBottom: 30,
  },
  imageSelectionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  imageOption: {
    margin: 5,
    padding: 2,
    borderRadius: 10,
  },
  selectedImage: {
    borderWidth: 2,
    borderColor: '#004d00',
  },
  imageThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  inputContainer: {
    width: '80%',
  },
  buttonContainer: {
    width: '60%',
    marginTop: 40,
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 5,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#004d00',
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  outlineButton: {
    backgroundColor: 'white',
    marginTop: 5,
  },
  outlineButtonText: {
    color: '#004d00',
    fontSize: 16,
    fontWeight: '700',
  },
});

/*import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { getDatabase, ref as dbRef, push  } from 'firebase/database';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isim, setIsim] = useState('');
  const [soyisim, setSoyisim] = useState('');
  const [telefon, setTelefon] = useState('');
  const [profilResmi, setProfilResmi] = useState(null);

  const navigation = useNavigation();
  const route = useRoute();
  const mode = route.params?.mode || 'login';

 useEffect(() => {
  (async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const galleryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (
      cameraPermission.status !== 'granted' ||
      galleryPermission.status !== 'granted'
    ) {
      Alert.alert(
        "İzin Gerekli",
        "Profil fotoğrafı seçebilmek için hem kamera hem de galeri izinleri gereklidir."
      );
    }
  })();

  const unsubscribe = auth.onAuthStateChanged((user) => {
    if (user) {
      navigation.navigate('AnaSayfa');
    }
  });

  return unsubscribe;
}, []);


  const pickImage = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    alert("Galeri izni verilmedi.");
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  aspect: [1, 1],
  quality: 1,
});


  console.log("📂 Seçim sonucu:", result);

  if (!result.canceled && result.assets && result.assets.length > 0) {
    setProfilResmi(result.assets[0].uri);
  }
};




 const uploadImageToFirebase = async (uri, fileName) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();

    const user = auth.currentUser; // ✅ doğrudan kullan
    const idToken = await user.getIdToken();

    const firebaseProjectId = "scrabbleyeni"; // 🔁 kendi projenin ID'si
    const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseProjectId}.appspot.com/o?uploadType=media&name=profilResimleri/${fileName}`;

    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'image/jpeg',
        'Authorization': `Bearer ${idToken}`,
      },
      body: blob,
    });

    const data = await uploadResponse.json();

    if (!uploadResponse.ok) {
      throw new Error(data.error?.message || "Yükleme başarısız");
    }

    const downloadURL = `https://firebasestorage.googleapis.com/v0/b/${firebaseProjectId}.appspot.com/o/profilResimleri%2F${fileName}?alt=media`;
    return downloadURL;
  } catch (err) {
    console.error("🔥 Resim yükleme hatası:", err.message);
    throw err;
  }
};



    
  const handleSignUp = async () => {
  try {
    const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredentials.user;
    let imageUrl = '';

    if (profilResmi) {
      imageUrl = await uploadImageToFirebase(profilResmi, `${user.uid}.jpg`);
    }

    const dbInstance = getDatabase();
    const usersRef = dbRef(dbInstance, 'users');
    await push(usersRef, {
      Email: user.email,
      UserId: user.uid,
      UserName: isim + " " + soyisim,
      IsActive: true,
      profilResmi: imageUrl,
      createdAt: new Date().toISOString(),
    });

    console.log('✅ Kullanıcı başarıyla kaydedildi ve veritabanına eklendi.');
  } catch (error) {
    console.log('🛑 Kayıt hatası:', error.message);
  }
};



  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log('Giriş başarılı:', user.email);
      })
      .catch((error) => console.log(error.message));
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View>
        <Image style={styles.Logo} source={require('../images/Logo3.png')} />
      </View>

      {mode === 'register' && (
        <TouchableOpacity onPress={pickImage} style={{ marginBottom: 20,
    padding: 10,
    backgroundColor: '#e6f2e6',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#004d00',
    alignItems: 'center', }}>
          <Text style={{ color: '#004d00', fontWeight: 'bold' }}>
            Profil Fotoğrafı Seç
          </Text>
        </TouchableOpacity>
      )}

      {profilResmi && (
        <Image source={{ uri: profilResmi }} style={styles.profilImage} />
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Şifre"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />

        {mode === 'register' && (
          <>
            <TextInput
              style={styles.input}
              placeholder="İsim"
              value={isim}
              onChangeText={(text) => setIsim(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Soyisim"
              value={soyisim}
              onChangeText={(text) => setSoyisim(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Telefon"
              keyboardType="phone-pad"
              value={telefon}
              onChangeText={(text) => setTelefon(text)}
            />
          </>
        )}
      </View>

      <View style={styles.buttonContainer}>
        {mode === 'login' && (
          <TouchableOpacity onPress={handleLogin} style={styles.button}>
            <Text style={styles.buttonText}>Giriş Yap</Text>
          </TouchableOpacity>
        )}

        {mode === 'register' && (
          <TouchableOpacity
            onPress={handleSignUp}
            style={[styles.button, styles.outlineButton]}
          >
            <Text style={styles.outlineButtonText}>Kayıt Ol</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Logo: {
    width: 110,
    height: 110,
    borderRadius: 60,
    marginBottom: 30,
  },
  profilImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  inputContainer: {
    width: '80%',
  },
  buttonContainer: {
    width: '60%',
    marginTop: 40,
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 5,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#004d00',
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  outlineButton: {
    backgroundColor: 'white',
    marginTop: 5,
  },
  outlineButtonText: {
    color: '#004d00',
    fontSize: 16,
    fontWeight: '700',
  },
});*/
