import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function TasTahtasi({ children }) {
  return (
    <View style={styles.tahtaContainer}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  tahtaContainer: {
    position: 'relative',
    height: 100,
    backgroundColor: '#004d00',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    margin: 6,
    marginTop:10,
  },
});
