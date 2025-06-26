import { StyleSheet, Text, View, TouchableOpacity, ScrollView  } from 'react-native'
import React from 'react'
import Rules from '../components/rules'
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';

export default function RulesScreen() {
  const navigation = useNavigation();
  return (
    <ScrollView  style={styles.Container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={[{ flexDirection: 'row', alignItems: 'center', borderRadius: 50, marginBottom:10 }]}
      >
        <AntDesign name="left" size={28} color="white" />
      </TouchableOpacity>
      <View style={styles.TitleContainer}>
        <Text style={styles.Title} >Kurallar</Text>
      </View>
      <View style={styles.kuralContainer}>
        <Rules KuralSiraSayisi="1"
        KuralIcerigi="İlk oyuncu bilgisayar tarafından rastgele belirlenir."/>
        <Rules KuralSiraSayisi="2"
        KuralIcerigi="İlk oyuncu en az iki harfli bir kelimeyi, soldan sağa veya yukarıdan aşağıya olacak şekilde ve bir harfi merkez kareye gelecek şekilde hamle yapar."/>
        <Rules KuralSiraSayisi="3"
        KuralIcerigi="Her hamleden sonra oyuncuların tahtalarındaki harfler bilgisayar tarafından rasgele olacak şekilde otomatik olarak 7 taşa tamamlanır."/>
        <Rules KuralSiraSayisi="4"
        KuralIcerigi="Bir oyuncu sırasını istediği kadar taşını (harfini) değiştirerek de kullanabilir. Oyuncu değiştirmek istediği taşları kendisi seçebilir ancak taşların tamamlanması bilgisayar tarafından otomatik olarak gerçekleştirilir. Oyuncu bu durumda puan alamaz. Oyun sırası rakibe geçer."/>
        <Rules KuralSiraSayisi="5"
        KuralIcerigi="Oyuncular herhangi bir işlem yapmadan (harf değiştirme veya hamle) 'Pas' butonuna basarak da sıralarını geçirebilirler."/>
        <Rules KuralSiraSayisi="6"
        KuralIcerigi="Çapraz, aşağıdan yukarıya ya da sağdan sola kelime yazılamaz."/>
        <Rules KuralSiraSayisi="7"
        KuralIcerigi="Bir kelime yazılması durumunda bitişiğinde oluşturduğu tüm kelimeler de anlamlı olmalıdır."/>
        <Rules KuralSiraSayisi="8"
        KuralIcerigi="Oyunda üç tane boş taş bulunur. Bu taşı çeken oyuncu taşı istediği herhangi bir taş yerine kullanabilir. Oyuncu taşı kullanırken taşı hangi harf yerine kullandığını belirtir ve bu hamleden sonra geçerli taş sadece o harf olarak kullanılabilir"/>
        <Rules KuralSiraSayisi="9"
        KuralIcerigi="Bir oyuncu 7 harfini de bir elde kullanırsa, aldığı puana ek olarak 50 puan alır."/>
        <Rules KuralSiraSayisi="10"
        KuralIcerigi="Oynanan harflerin yerleri değiştirilemez."/>
        <Rules KuralSiraSayisi="11"
        KuralIcerigi="Oyun torbadaki tüm harfler çekildikten sonra bir oyuncu tüm harflerini kullandığında biter."/>
        <Rules KuralSiraSayisi="12"
        KuralIcerigi="Oyuncular peş peşe üçer kere pas geçerse oyun bitmiş sayılır."/>
      </View>
    </ScrollView >
  )
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#004d00',
    paddingTop: 50,
    paddingBottom:50,
  },
  kuralContainer: {
    paddingRight: 40,
    paddingLeft: 40,
    paddingBottom:80,
  },
  TitleContainer:{
    alignItems: 'center',
    marginBottom: 20,
  },
  Title:{
    color:'#fff',
    fontSize:25,
    fontWeight: 'bold',
  },
});