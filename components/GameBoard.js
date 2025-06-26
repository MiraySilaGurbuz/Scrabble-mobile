import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { boardSize, cellSize } from '../components/Constants';
import { getAllBoards } from '../services/boardService';
import { getGameBoardByOyunId } from '../services/gameService';
import SuruklenebilirTas from './SuruklenebilirTas';
import { onValue, ref } from "firebase/database";
import { db } from "../firebase";

const GameBoard = ({ setDropZones, scrollOffsetRef, onRetrieveLetter, droppedLetter, validDropZones, kareBasliklari, setKareBasliklari, durumlar, setDurumlar, oyunId }) => {
  const [boardData, setBoardData] = useState([]);
  const [gameBoardData, setGameBoardData] = useState([]);
  const [kareRenkleri, setKareRenkleri] = useState({});
  const cellRefs = useRef([]);
  const scrollViewRef = useRef(null);
  const anaDegerMap = useRef({});
  const orijinalKareVerileri = useRef({});
  const [boardDataState, setBoardDataState] = useState([]);


  useEffect(() => {
    if (!oyunId || boardDataState.length === 0) return;

    const boardRef = ref(db, `GameBoard/${oyunId}`);
    const unsubscribe = onValue(boardRef, (snapshot) => {
      const boardData = snapshot.val();
      const parsed = Object.values(boardData || {});
      setGameBoardData(parsed);
    });

    return () => unsubscribe();
  }, [oyunId, boardDataState]);


  useEffect(() => {
    const fetchBoardData = async () => {
      const allBoardsRaw = await getAllBoards();
      const allBoards = Object.values(allBoardsRaw);
      setBoardData(allBoards);
      setBoardDataState(allBoards);
    };
    fetchBoardData();
  }, []);


  useEffect(() => {
    const fetchGameBoard = async () => {
      const gameBoards = await getGameBoardByOyunId(oyunId);
      setGameBoardData(gameBoards);
    };
    fetchGameBoard();
  }, []);

  useEffect(() => {
    if (gameBoardData.length > 0) {
      const updatedDurumlar = {};
      const updatedBasliklar = {};

      gameBoardData.forEach(item => {
        const key = item.yerDegeri;
        const letter = item.baslik || item.letter;

        if (letter && letter !== 'Normal') {
          updatedDurumlar[key] = 1;
          updatedBasliklar[key] = { letter, puan: item.puan, fromBoard: false };
        }
      });

      setDurumlar(prev => ({ ...prev, ...updatedDurumlar }));
      setKareBasliklari(prev => ({ ...prev, ...updatedBasliklar }));
    }
  }, [gameBoardData]);

  const measureDropZones = () => {
    const promises = cellRefs.current.map((ref, index) =>
      new Promise((resolve) => {
        if (!ref) return resolve(null);
        ref.measure((fx, fy, width, height, px, py) => {
          const row = Math.floor(index / boardSize);
          const col = index % boardSize;
          const offset = scrollOffsetRef.current;
          const key = `${row}/${col}`;
          const squareData = boardData.find(x => x.yerDegeri === key);
          const durumId = durumlar[key] ?? squareData?.durumId ?? 0;

          resolve({
            x: px + offset.x,
            y: py + offset.y,
            size: width,
            row,
            col,
            anaDeger: anaDegerMap.current[index],
            durumId,
            key,
          });
        });
      })
    );

    Promise.all(promises).then((zones) => {
      const validZones = zones.filter(zone => zone && zone.durumId === 0);
      //console.log(validZones)
      setDropZones(validZones);
    });
  };

  useEffect(() => {
    if (boardData.length === 0) return;

    boardData.forEach((square, i) => {
      const row = Math.floor(i / boardSize);
      const col = i % boardSize;
      const key = `${row}/${col}`;
      const index = row * boardSize + col;
      anaDegerMap.current[index] = square.anaDeger;
    });

    setTimeout(() => {
      measureDropZones();
      scrollViewRef.current?.scrollTo({
        x: (boardSize * cellSize) / 2 - 200,
        y: (boardSize * cellSize) / 2 - 300,
        animated: true,
      });
    }, 500);
  }, [boardData]);

  useEffect(() => {
   // console.log("burdayyiiimmmm")
    measureDropZones();
  }, [durumlar]);

  //console.log("✅ Güncellenen droppedLetter:", droppedLetter);
  //console.log("🔒 Mevcut durumlar:", durumlar);

  useEffect(() => {
    if (droppedLetter) {
      const { row, col, letter, id, puan, anaDeger } = droppedLetter;
      const key = `${row}/${col}`;
      setKareBasliklari(prev => ({
        ...prev,
        [key]: { id, letter, puan, anaDeger, fromBoard: true }
      }));
      setDurumlar(prev => ({ ...prev, [key]: 1 }));
    }
  }, [droppedLetter]);
  

  const createBoard = () => {
    let board = [];
    let AnaDeger = 1;

    for (let row = 0; row < boardSize; row++) {
      let rowCells = [];
      for (let col = 0; col < boardSize; col++) {
        const index = row * boardSize + col;
        const key = `${row}/${col}`;
        const defaultSquare = {
          baslik: 'Normal',
          carpanDegeri: 1,
          renkKodu: '#339933',
          yerDegeri: key,
          anaDeger: AnaDeger,
          durumId: 0,
        };

        let squareData = boardData.find(x => x.yerDegeri === key) ?? defaultSquare;
        const durumId = durumlar[key] ?? squareData.durumId ?? 0;
        const kareBilgisi = kareBasliklari[key];
        const kareBaslik = typeof kareBilgisi === 'string' ? kareBilgisi : kareBilgisi?.letter;
        const baslikToShow = durumId === 1 && kareBaslik
          ? kareBaslik
          : orijinalKareVerileri.current[key]?.baslik ?? squareData.baslik;

        const showSuruklenebilir = durumId === 1 && kareBilgisi;
        const backgroundColor = kareRenkleri[key] ?? squareData.renkKodu;

        anaDegerMap.current[index] = squareData.anaDeger;
        orijinalKareVerileri.current[key] = {
          renkKodu: squareData.renkKodu,
          baslik: squareData.baslik,
        };

        rowCells.push(
          <TouchableOpacity
            key={key}
            ref={(el) => (cellRefs.current[index] = el)}
            onPress={() => {
              if (kareBilgisi?.fromBoard && durumId === 1) {
                onRetrieveLetter?.({ id: kareBilgisi.id });

                setKareBasliklari(prev => {
                  const updated = { ...prev };
                  delete updated[key];
                  return updated;
                });

                setKareRenkleri(prev => {
                  const updated = { ...prev };
                  updated[key] = orijinalKareVerileri.current[key]?.renkKodu ?? '#339933';
                  return updated;
                });

                setDurumlar(prev => ({ ...prev, [key]: 0 }));
              }
            }}
            style={{ position: 'relative', zIndex: 1  }}
          >
            <View style={[styles.cell, { backgroundColor , zIndex: 0}]}>
              {squareData.anaDeger === 113 && (
                <View style={styles.redCircle} />
              )}
              {showSuruklenebilir ? (
                <SuruklenebilirTas
                  letter={kareBaslik}
                  puan={kareBilgisi?.puan ?? 0}
                  initialPosition={{ x: 0, y: 0 }}
                  scrollOffsetRef={scrollOffsetRef}
                  validDropZones={validDropZones}
                  isDraggable={kareBilgisi?.fromBoard === true}
                  durumlar={durumlar}
                  onDrop={(newRow, newCol, letter) => {
                    const newKey = `${newRow}/${newCol}`;
                    //console.log("tabikiiiii")
                    if (durumlar[newKey] === 1) {
                      //console.log("yesss");
                    }
                    const oldKey = key;
                    setKareBasliklari(prev => {
                      const updated = { ...prev };
                      delete updated[oldKey];
                      updated[newKey] = { letter, fromBoard: true };
                      return updated;
                    });

                    setKareRenkleri(prev => {
                      const updated = { ...prev };
                      updated[oldKey] = orijinalKareVerileri.current[oldKey]?.renkKodu ?? '#339933';
                      return updated;
                    });

                    setDurumlar(prev => {
                      const updated = { ...prev };
                      updated[oldKey] = 0;
                      updated[newKey] = 1;
                      return updated;
                    });
                  }}
                />
              ) : (
                <Text style={styles.cellText}>
                  {baslikToShow !== 'Normal' ? baslikToShow : ''}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        );

        AnaDeger++;
      }
      board.push(<View key={row} style={[styles.row, { zIndex: 0}]}>{rowCells}</View>);
    }

    return board;
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      style={[styles.scrollContainer, { maxHeight: '60%' }]}
      onScroll={(e) => {
        scrollOffsetRef.current.x = e.nativeEvent.contentOffset.x;
      }}
      scrollEventThrottle={16}
    >
      <View>
        <ScrollView
          onScroll={(e) => {
            scrollOffsetRef.current.y = e.nativeEvent.contentOffset.y;
          }}
          scrollEventThrottle={16}
        >
          <View style={styles.board}>{createBoard()}</View>
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flex: 1 },
  board: { padding: 20, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row' },
  cell: {
    width: cellSize,
    height: cellSize,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    fontSize: 10,
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  redCircle: {
  position: 'absolute',
  width: 48,
  height: 48,
  borderRadius: 30,
  backgroundColor: 'red',
  top: '50%',
  left: '50%',
  marginLeft: -24,
  marginTop: -24,
  zIndex: 0,
  opacity: 0.8,
},
});

export default GameBoard;
