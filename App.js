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
} from 'react-native';

import ToDo from './ToDo.js';
import uuid from 'uuid-random';

const {height, width} = Dimensions.get('window'); // 현재 화면의 가로 세로 값 가져오기

export default class App extends Component {
  state = {newToDo: '', toDos: {}};

  render() {
    const {newToDo, toDos} = this.state;

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content"></StatusBar>
        <Text style={styles.title}>Todo List</Text>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="New To Do"
            value={newToDo}
            onChangeText={this.changeToDo}
            onSubmitEditing={this.addToDo}></TextInput>
          <ScrollView contentContainerStyle={styles.toDos}>
            {Object.values(toDos).map((toDo) => (
              <ToDo
                key={toDo.id}
                {...toDo}
                deleteToDo={this._deleteToDo}
                uncompleteToDo = {this._uncompleteToDo}
                completeToDo = {this._completeToDo}
                updateToDo = {this._updateToDo}></ToDo>
            ))}
          </ScrollView>
        </View>
      </View>
    );

   
  }

  changeToDo = (text) => {
    this.setState({
      newToDo: text,
    });
  };
  addToDo = () => {
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
        return {...newState};
      });
    }
  };

  _deleteToDo = (id) => {
    console.log(id);
    this.setState((prevState) => {
      const toDos = prevState.toDos;
      console.log(prevState);
      delete toDos[id];

      const newState = {
        ...prevState,
        ...toDos
      };

      console.log(newState);

      return {...newState};
    });
  };

  _uncompleteToDo = (id) =>{
    this.setState(prevState =>{
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: false
          }
        }
      }
      return {...newState}
    })
  }

  _completeToDo =(id) =>{
    this.setState(prevState =>{
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: true
          }
        }
      }
      return {...newState}
    })
  }

  _updateToDo = (id, text) =>{
    this.setState(prevState =>{
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            text: text
          }
        }
      }
      return {...newState}
    })
  }
  _saveToDos = (newToDos) =>{

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3B3B98',
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
