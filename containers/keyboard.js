import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity  } from 'react-native';
import { keyboardStyle } from '../styles';

export default class Keyboard extends React.Component {

    render() {
        const row1 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
        const row2 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
        const row3 = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];
        const allRows = [row1, row2, row3];
        const addKeyboardRow = (row, index) =>
            (<View style={keyboardStyle.keyboardRow} key={`row${index}`}>
                {
                    row.map(
                        elem =>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                key={elem}
                                onPress={() => this.props.addCharacter(elem)}
                                style={keyboardStyle.button}
                            >
                                <Text style={keyboardStyle.buttonLabel}>
                                    {elem.toUpperCase()}
                                </Text>
                            </TouchableOpacity>
                    )
                }
            </View>);

        return (
            <View
                style={keyboardStyle.keyboardWrapper}
            >
                {
                    allRows.map(
                        (row, index) => addKeyboardRow(row, index)
                    )
                }
                <View style={keyboardStyle.keyboardRow}>
                    <TouchableOpacity
                        title=' '
                        key='space'
                        style={keyboardStyle.space}
                        onPress={this.props.addSpace}
                    >
                        <Text style={keyboardStyle.buttonLabel}>
                            {' '}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        title=' '
                        key='bksp'
                        style={keyboardStyle.button}
                        onPress={this.props.removeCharacter}
                        onLongPress={this.props.resetMainState}
                    >
                        <Text style={keyboardStyle.buttonLabel}>
                            {'DEL'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}