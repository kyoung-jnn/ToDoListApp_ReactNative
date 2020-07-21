/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Fragment, Component} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  Dimensions,
  AsyncStorage,
} from 'react-native';

import ToDo from './ToDo.js';
import uuid from 'uuid-random';
import SplashScreen from 'react-native-splash-screen';

const {height, width} = Dimensions.get('window'); // 현재 화면의 가로 세로 값 가져오기

export default class App extends Component {
  state = {newToDo: '', toDos: {}, loadedToDos: false};

  componentDidMount = () => {
    this._loadToDos();
  };

  render() {
    const {newToDo, toDos, loadedToDos} = this.state;
    if (!loadedToDos) {
      console.log('data loading...');
      setTimeout(() => {
        SplashScreen.hide();
      }, 1000);
    }

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content"></StatusBar>
        <Text style={styles.title}>To Do List</Text>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="New To Do"
            value={newToDo}
            onChangeText={this._changeToDo}
            onSubmitEditing={this._addToDo}></TextInput>
          <ScrollView contentContainerStyle={styles.toDos}>
            {Object.values(toDos)
              .reverse()
              .map((toDo) => (
                <ToDo
                  key={toDo.id}
                  {...toDo}
                  deleteToDo={this._deleteToDo}
                  uncompleteToDo={this._uncompleteToDo}
                  completeToDo={this._completeToDo}
                  updateToDo={this._updateToDo}></ToDo>
              ))}
          </ScrollView>
        </View>
      </View>
    );
  }

  _loadToDos = async () => {
    try {
      // 비동기 처리
      const toDos = await AsyncStorage.getItem('toDos');
      const parsedToDos = JSON.parse(toDos); // string -> obj
      console.log('불러오기');
      console.log(parsedToDos);
      this.setState({loadedToDos: true, toDos: parsedToDos || {}});
    } catch (e) {
      console.log(e);
    }
  };

  _saveToDos = (newToDos) => {
    console.log('저장');
    console.log(JSON.stringify(newToDos));
    try {
      const saveToDos = AsyncStorage.setItem('toDos', JSON.stringify(newToDos)); // string 형식으로 저장
    } catch (e) {
      console.log(e);
    }
  };

  _changeToDo = (text) => {
    this.setState({
      newToDo: text,
    });
  };

  _addToDo = () => {
    const {newToDo} = this.state;
    if (newToDo !== '') {
      this.setState((prevState) => {
        const ID = uuid();

        const newToDoObj = {
          [ID]: {
            id: ID,
            isCompleted: false,
            text: newToDo,
            createAt: Date.now(),
          },
        };

        const newState = {
          ...prevState,
          newToDo: '',
          toDos: {
            ...prevState.toDos,
            ...newToDoObj,
          },
        };
        this._saveToDos(newState.toDos);

        return {...newState};
      });
    }
  };

  _deleteToDo = (id) => {
    this.setState((prevState) => {
      const toDos = prevState.toDos;
      delete toDos[id];

      const newState = {
        ...prevState,
        ...toDos,
      };

      this._saveToDos(newState.toDos);

      return {...newState};
    });
  };

  _uncompleteToDo = (id) => {
    this.setState((prevState) => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: false,
          },
        },
      };
      this._saveToDos(newState.toDos);

      return {...newState};
    });
  };

  _completeToDo = (id) => {
    this.setState((prevState) => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: true,
          },
        },
      };
      this._saveToDos(newState.toDos);

      return {...newState};
    });
  };

  _updateToDo = (id, text) => {
    this.setState((prevState) => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            text: text,
          },
        },
      };
      this._saveToDos(newState.toDos);
      return {...newState};
    });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#74b9ff',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 30,
    marginTop: 25,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: 'white',
    flex: 1,
    width: width - 25,
    marginBottom: 0,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    ...Platform.select({
      ios: {
        shadowColor: 'rgb(50,50,100)',
      },
      android: {
        elevation: 5,
      },
    }),
  },
  input: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#bbb',
    fontSize: 25,
  },
  toDos: {
    alignItems: 'center',
  },
});
