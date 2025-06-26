# Scrabble-mobile
Türkçe Scrabble Benzeri Mobil Oyun (React Native & Firebase)
Projenin çalışabilmesi için öncelikle Firebase Realtime Database oluşturulması gerekmektedir. oluşturduğunuz veri tabanının  bilgilerini firebase.js dosyasındaki 

const firebaseConfig = {
  apiKey: "your_apiKey",
  authDomain: "your_authDomain.firebaseapp.com",
  projectId: "your_projectId",
  storageBucket: "your_storageBucket.firebasestorage.app",
  messagingSenderId: "your_messagingSenderId",
  appId: "your_appId"
};

alanının olduğu kısma yapıştırmalısınız. Daha sonrasında veritabanınızın url bilgisini services klasörü altındaki dosyaların içerisindeki  
