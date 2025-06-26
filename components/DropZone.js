import React from "react";
import { View, StyleSheet } from "react-native";

const DropZone = ({ id, isHovered, onLayout }) => {
  const handleLayout = (event) => {
    const layout = event.nativeEvent.layout;
    onLayout(id, layout);
  };

  return (
    <View
      onLayout={handleLayout}
      style={[
        styles.kutu,
        isHovered && styles.hovered,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  kutu: {
    width: 100,
    height: 100,
    marginHorizontal: 10,
    backgroundColor: "#ccc",
    borderRadius: 10,
  },
  hovered: {
    borderColor: "yellow",
    borderWidth: 4,
  },
});

export default DropZone;
