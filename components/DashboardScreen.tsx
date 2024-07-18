import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput } from 'react-native';
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
  const [newFilmTitle, setNewFilmTitle] = useState('');
  const [newFilmDirector, setNewFilmDirector] = useState('');
  const [newFilmTime, setNewFilmTime] = useState('');

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
      const newFilmList = filmList.map(film =>
        film.id === currentFilm.id ? { ...currentFilm } : film
      );
      setFilmList(newFilmList);
      setModalVisible(false);
      setCurrentFilm(null);
    }
  };

  const handleAddFilm = () => {
    const newFilm: Film = {
      id: String(filmList.length + 1),
      title: newFilmTitle,
      director: newFilmDirector,
      time: newFilmTime,
    };
    setFilmList([...filmList, newFilm]);
    setModalVisible(false);
    setNewFilmTitle('');
    setNewFilmDirector('');
    setNewFilmTime('');
  };

  const renderItem = ({ item }: { item: Film }) => (
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
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
      </TouchableOpacity>
      <Text style={styles.header}>DASHBOARD</Text>
      <Text style={styles.subHeader}>FILMS</Text>
      <FlatList
        data={filmList}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <MaterialCommunityIcons name="plus" size={24} color="white" />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setCurrentFilm(null);
        }}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>
            {currentFilm ? 'Edit Film' : 'Add New Film'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={currentFilm ? currentFilm.title : newFilmTitle}
            onChangeText={text =>
              currentFilm
                ? setCurrentFilm({ ...currentFilm, title: text })
                : setNewFilmTitle(text)
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Director"
            value={currentFilm ? currentFilm.director : newFilmDirector}
            onChangeText={text =>
              currentFilm
                ? setCurrentFilm({ ...currentFilm, director: text })
                : setNewFilmDirector(text)
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Time"
            value={currentFilm ? currentFilm.time : newFilmTime}
            onChangeText={text =>
              currentFilm
                ? setCurrentFilm({ ...currentFilm, time: text })
                : setNewFilmTime(text)
            }
          />
          <TouchableOpacity
            style={styles.saveButton}
            onPress={currentFilm ? handleSave : handleAddFilm}>
            <Text style={styles.saveButtonText}>
              {currentFilm ? 'Save' : 'Add Film'}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
  backButton: {
    position: 'absolute',
    top: 70,
    left: 100,
    zIndex: 10,
  },
});

export default DashboardScreen;
