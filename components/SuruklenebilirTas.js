
import React, { useRef, useEffect, useState } from 'react';
import { Text, Animated, PanResponder, StyleSheet } from 'react-native';
import { cellSize } from '../components/Constants';

const SuruklenebilirTas = ({
  id,
  letter,
  puan,
  validDropZones,
  initialPosition,
  onDrop,
  scrollOffsetRef,
  isDraggable = true,
  setTasTahtasiTaslari,
  durumlar
}) => {
  const pan = useRef(new Animated.ValueXY(initialPosition)).current;
  const [isDragging, setIsDragging] = useState(false);
  const durumlarRef = useRef(durumlar);
  const validDropZonesRef = useRef(validDropZones);

  useEffect(() => {
    validDropZonesRef.current = validDropZones;
  }, [validDropZones]);

  useEffect(() => {
    pan.setValue(initialPosition);
  }, [initialPosition]);

  useEffect(() => {
    durumlarRef.current = durumlar;
  }, [durumlar]);

  const geriGonder = () => {
    setTasTahtasiTaslari(prev => {
      const yeniTaslar = prev.map((tas, index) => ({
        ...tas,
        initialPosition: {
          x: index * (cellSize + 5),
          y: 15,
        }
      }));

      const zatenVar = prev.some(t => t.id === id);
      if (zatenVar) return yeniTaslar;

      const yeniTas = {
        id,
        baslik: letter,
        puan: puan || 0,
        initialPosition: {
          x: yeniTaslar.length * (cellSize + 5),
          y: 15,
        }
      };

      return [...yeniTaslar, yeniTas];
    });
  };


  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isDraggable,
      onPanResponderGrant: () => {
        if (!isDraggable) return;
        setIsDragging(true);
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: isDraggable
        ? Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false })
        : null,
      onPanResponderRelease: (e, gesture) => {
        if (!isDraggable) return;
        setIsDragging(false);
        pan.flattenOffset();

        const offset = scrollOffsetRef.current;
        const dropX = gesture.moveX + offset.x;
        const dropY = gesture.moveY + offset.y;
        //console.log("offset",offset);

        //console.log("dropX",dropX);

        //console.log("dropY",dropY);

        //console.log("validDropZones",validDropZones);

        const matchedZone = validDropZonesRef.current.find(zone =>
          dropX >= zone.x &&
          dropX <= zone.x + zone.size &&
          dropY >= zone.y &&
          dropY <= zone.y + zone.size
        );
        //console.log("matchedZone", matchedZone)
        const kontrol = gesture.moveX >= 15 && gesture.moveX <= 375;
        const kontrol2 = gesture.moveY >= 150 && gesture.moveY <= 660;

        if (matchedZone && kontrol && kontrol2) {
          const newKey = `${matchedZone.row}/${matchedZone.col}`;
          const doluMu = durumlarRef.current?.[newKey] === 1;

          if (doluMu) {
            console.log("❌ Bu kare zaten dolu! Taş geri dönüyor.");
            geriGonder();
            return;
          }

          const isDropZoneValid = validDropZonesRef.current.some(zone => zone.key === newKey);
          
          //console.log("newKey", newKey)
          //console.log("isDropZoneValid", isDropZoneValid)
          if (!isDropZoneValid) {
            console.log("❌ Bu kare geçerli değil (drop zone dışı)!");
            geriGonder();
            return;
          }

          if (onDrop) onDrop(matchedZone.row, matchedZone.col, letter, id);
        } else {
          console.log("❌ Geçersiz konum! Taş geri dönüyor.");
          geriGonder();
        }
      }
    })
  ).current;

  return (
    <Animated.View
      style={[
        styles.tile,
        {
          transform: pan.getTranslateTransform(),
          position: 'absolute',
          left: initialPosition.x,
          top: initialPosition.y,
          zIndex: isDragging ? 9999  : 1,
          elevation: isDragging ? 1000 : 1,
        }
      ]}
      {...(isDraggable ? panResponder.panHandlers : {})}
    >
      <Text style={styles.letterText}>{letter}</Text>
      <Text style={styles.puanText}>{puan}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tile: {
    width: cellSize - 3,
    height: cellSize - 3,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    elevation: 15,
    zIndex: 999,
    position: 'absolute',
  },
  letterText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#004d00',
  },
  puanText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#666',
    position: 'absolute',
    bottom: 3,
    right: 5,
  },
});

export default SuruklenebilirTas;
