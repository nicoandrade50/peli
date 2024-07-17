import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ListRenderItem, Modal, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/StackNavigator';


type Film = {
  id: string;
  title: string;
  director: string;
  time: string;
};

const initialFilms: Film[] = [
  { id: '1', title: 'Rocky', director: 'John G. Avildsen', time: '1976' },
  { id: '2', title: 'Rocky II', director: 'Sylvester Stallone', time: '1979' },
  { id: '3', title: 'Rocky III', director: 'Sylvester Stallone', time: '1982' },
  { id: '4', title: 'Rocky IV', director: 'Sylvester Stallone', time: '1985' },
  { id: '5', title: 'Rocky V', director: 'John G. Avildsen', time: '1990' },
  { id: '6', title: 'Rocky Balboa', director: 'Sylvester Stallone', time: '2006' },
];

type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<DashboardScreenNavigationProp>();
  const [filmList, setFilmList] = useState(initialFilms);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentFilm, setCurrentFilm] = useState<Film | null>(null);

  const handleEdit = (film: Film) => {
    setCurrentFilm(film);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    const newFilmList = filmList.filter(film => film.id !== id);
    setFilmList(newFilmList);
  };

  const handleSave = () => {
    if (currentFilm) {
      const newFilmList = filmList.map(film => (film.id === currentFilm.id ? currentFilm : film));
      setFilmList(newFilmList);
      setModalVisible(false);
      setCurrentFilm(null);
    }
  };

  const renderItem: ListRenderItem<Film> = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('Scenes')}>
      <View style={styles.card}>
        <View>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardSubtitle}>{item.director}</Text>
          <Text style={styles.cardSubtitle}>{item.time}</Text>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity onPress={() => handleEdit(item)}>
            <MaterialCommunityIcons name="pencil" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <MaterialCommunityIcons name="delete" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>DASHBOARD</Text>
      <Text style={styles.subHeader}>FILMS</Text>
      <FlatList
        data={filmList}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Scenes')}>
        <MaterialCommunityIcons name="plus" size={24} color="white" />
      </TouchableOpacity>
      {currentFilm && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
            setCurrentFilm(null);
          }}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Edit Film</Text>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={currentFilm.title}
              onChangeText={(text) => setCurrentFilm({ ...currentFilm, title: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Director"
              value={currentFilm.director}
              onChangeText={(text) => setCurrentFilm({ ...currentFilm, director: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Time"
              value={currentFilm.time}
              onChangeText={(text) => setCurrentFilm({ ...currentFilm, time: text })}
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
  },
  header: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  list: {
    paddingBottom: 80,
  },
  card: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 14,
    color: 'black',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 60,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#800F2F',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#800F2F',
    padding: 10,
    borderRadius: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default DashboardScreen;
