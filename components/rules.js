import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

export default function Rules({ KuralSiraSayisi, KuralIcerigi }) {
  return (
    <View style={{ marginVertical: 5 }}>
      <Text style={styles.kuralText}>
        <Text style={styles.SiraSayisiText}>{KuralSiraSayisi}. </Text>
        {KuralIcerigi}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  kuralText: {
    fontSize: 18,
    color: '#fff',
  },
  SiraSayisiText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
});
