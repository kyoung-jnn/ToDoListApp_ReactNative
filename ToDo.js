import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInputComponent,
} from 'react-native';

import PropsTypes from 'prop-types';

//
const {width, height} = Dimensions.get('window');

export default class ToDo extends Component {
  constructor(props) {
    super(props);
    this.state = {isEditing: false, toDoValue: props.text};
  }

  static PropsTypes = {
    text: PropsTypes.string.isRequired,
    isCompleted: PropsTypes.bool.isRequired,
    deleteToDo: PropsTypes.func.isRequired,
    id: PropsTypes.string.isRequired,
    uncompleteToDo: PropsTypes.func.isRequired,
    completeToDo: PropsTypes.func.isRequired,
    updateToDo: PropsTypes.func.isCompleted
  };

  render() {
    const { isEditing, toDoValue} = this.state;
    const {text, id, deleteToDo,isCompleted} = this.props; // props 받아옴
    return (
      <View style={styles.container}>
        <View style={styles.column}>
          <TouchableOpacity onPress={this.toggleComplete}>
            <View
              style={[
                styles.circle,
                isCompleted ? styles.completedCircle : styles.uncompletedCircle,
              ]}></View>
          </TouchableOpacity>

          {isEditing ? (
            <View>
              <TextInput
                style={[
                  styles.text,
                  styles.input,
                  isCompleted ? styles.completedText : styles.uncompletedText, //완료면 줄 표시
                ]}
                value={toDoValue}
                multiline={true}
                onChangeText={this.whileEditing}
                onBlur={this.finishEditing}></TextInput>
            </View>
          ) : (
            <Text
              style={[
                styles.text,
                isCompleted ? styles.completedText : styles.uncompletedText, //완료면 줄 표시
              ]}>
              {text}
            </Text>
          )}
        </View>

        {isEditing ? (
          <View style={styles.actions}>
            <TouchableOpacity onPress={this.finishEditing}>
              <View style={styles.actionContainer}>
                <Text style={styles.actionText}>✅</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.actions}>
            <TouchableOpacity onPress={this.startEditing}>
              <View style={styles.actionContainer}>
                <Text style={styles.actionText}>📏</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteToDo(id)}>
              <View style={styles.actionContainer}>
                <Text style={styles.actionText}>❌</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  toggleComplete = () => {
    const {isCompleted, uncompleteToDo,completeToDo, id} = this.props;

    if(isCompleted){
      uncompleteToDo(id)
    }else{
      completeToDo(id)
    }
  };

  startEditing = () => {
    this.setState({
      isEditing: true,
    });
  };

  finishEditing = () => {
    const {toDoValue} = this.state;
    const { id,updateToDo} = this.props;
    updateToDo(id,toDoValue);
    this.setState({
      isEditing: false,
    });
  };

  whileEditing = (text) => {
    this.setState({
      toDoValue: text,
    });
  };
}

const styles = StyleSheet.create({
  container: {
    width: width - 50,
    borderBottomColor: '#bbb',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 3,
  },
  text: {
    fontSize: 25,
    fontWeight: 'bold',
    marginVertical: 20,
    marginLeft: 38,
  },

  completedCircle: {borderColor: '#bbb'},
  uncompletedCircle: {borderColor: '#3B3B98'},

  completedText: {color: '#bbb', textDecorationLine: 'line-through'},
  uncompletedText: {color: 'black'},

  column: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width / 2,
  },
  actions: {
    flexDirection: 'row',
  },
  actionContainer: {
    marginVertical: 10,
    marginHorizontal: 10,
  },
  input: {
    width: width / 2,
    marginVertical: 9,
    marginLeft: 38,
  },
});
