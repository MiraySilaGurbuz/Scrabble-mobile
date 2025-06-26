import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { getDatabase, ref as dbRef, onValue, update } from 'firebase/database';
import { useNavigation, useRoute } from '@react-navigation/native';
import { changeUsersPassive } from '../services/userService';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [kullaniciVerisi, setKullaniciVerisi] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editKey, setEditKey] = useState(null);
  const [isim, setIsim] = useState('');
  const [soyisim, setSoyisim] = useState('');
  const [telefon, setTelefon] = useState('');
  const [profilResmi, setProfilResmi] = useState('');

  const uid = auth.currentUser?.uid;

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
    if (!uid) return;
    const db = getDatabase();
    const usersRef = dbRef(db, 'users');
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const entries = Object.entries(data);
        const currentUserEntry = entries.find(([_, user]) => user.UserId === uid);
        if (currentUserEntry) {
          const [key, userData] = currentUserEntry;
          setEditKey(key);
          setKullaniciVerisi(userData);
          setIsim(userData.Isim || '');
          setSoyisim(userData.Soyisim || '');
          setTelefon(userData.Telefon || '');
          setProfilResmi(userData.profilResmi || '');
        }
      }
    });
  }, [uid]);

  useEffect(() => {
    if (route.params?.toggleEdit) {
      setEditMode(true);
      navigation.setParams({ toggleEdit: false });
    }
  }, [route.params?.toggleEdit]);

  const handleSave = async () => {
    if (!editKey) return;
    const db = getDatabase();
    const userRef = dbRef(db, `users/${editKey}`);
    await update(userRef, {
      Isim: isim,
      Soyisim: soyisim,
      Telefon: telefon,
      profilResmi: profilResmi,
    });
    setEditMode(false);
  };

  const handleLogout = () => {
  const uid = auth.currentUser?.uid;
  auth.signOut()
    .then(() => {
      if (uid) {
        changeUsersPassive(uid);
      }
      navigation.navigate('Startup');
    })
    .catch((error) => console.log("Çıkış Hatası:", error.message));
};


  return (
    <View style={styles.container}>
      {kullaniciVerisi && (
        <>
          <Image
            style={styles.profilResmi}
            source={getImageSource(profilResmi)}
          />

          {editMode ? (
            <>
              <TextInput style={styles.input} value={isim} onChangeText={setIsim} placeholder="İsim" />
              <TextInput style={styles.input} value={soyisim} onChangeText={setSoyisim} placeholder="Soyisim" />
              <TextInput style={styles.input} value={telefon} onChangeText={setTelefon} placeholder="Telefon" keyboardType="phone-pad" />
              <Text style={styles.label}>Profil Resmi Seç</Text>
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
              <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <Text style={styles.saveText}>Kaydet</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.infoCard}><Text style={styles.label}>İsim</Text><Text style={styles.value}>{kullaniciVerisi.Isim || '-'}</Text></View>
              <View style={styles.infoCard}><Text style={styles.label}>Soyisim</Text><Text style={styles.value}>{kullaniciVerisi.Soyisim || '-'}</Text></View>
              <View style={styles.infoCard}><Text style={styles.label}>Telefon</Text><Text style={styles.value}>{kullaniciVerisi.Telefon || '-'}</Text></View>
              <View style={styles.infoCard}><Text style={styles.label}>Email</Text><Text style={styles.value}>{kullaniciVerisi.Email}</Text></View>
            </>
          )}

          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Çıkış Yap</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, paddingTop: 60, alignItems: 'center', backgroundColor: '#f4f4f4'
  },
  profilResmi: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  infoCard: {
    width: '85%', backgroundColor: '#ffffff', padding: 12,
    borderRadius: 8, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: '#004d00',
  },
  label: { fontSize: 12, color: '#666', marginBottom: 4 },
  value: { fontSize: 15, fontWeight: '600', color: '#333' },
  input: {
    width: '85%', backgroundColor: '#fff', padding: 10,
    borderRadius: 8, marginBottom: 10, borderColor: '#ccc', borderWidth: 1,
  },
  saveButton: {
    marginTop: 10, backgroundColor: '#004d00',
    paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8,
  },
  saveText: { color: '#fff', fontWeight: 'bold' },
  imageSelectionContainer: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginVertical: 10,
  },
  imageOption: {
    margin: 5, padding: 2, borderRadius: 10,
  },
  selectedImage: {
    borderWidth: 2, borderColor: '#004d00',
  },
  imageThumbnail: {
    width: 60, height: 60, borderRadius: 10,
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: '#990000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
