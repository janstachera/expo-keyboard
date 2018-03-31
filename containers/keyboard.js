import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity  } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { keyboardStyle, suggestionsStyle, viewStyle } from '../styles';

export default class Keyboard extends React.Component {

    inputCharacter = (character) => {
        const text = this.props.text;
        const position = this.props.cursorPosition;
        const output = text.substr(0, position) + character + text.substr(position);

        this.upgradeCursorPosition(position);

        if (character === ' ') {
            this.props.setMainContainerState({
                currentWord: '',
                text: output,
                cursorPosition: position + 1
            });
        } else {
            const currrentWord = `${this.props.currentWord}${character}`;
            const newCandWords = this.props.dictionary.filter((word) => word.indexOf(currrentWord) === 0);
            this.props.setMainContainerState({
                currentWord: currrentWord,
                dictionary: newCandWords,
                text: output,
                cursorPosition: position + 1
            });
        }

    };

    render() {
        const row1 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
        const row2 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
        const row3 = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];
        const allRows = [row1, row2, row3];
        const addKeyboardRow = (row, index) =>
            (<View style={keyboardStyle.keyboardRow} key={`row${index}`}>
                {
                    index === 1
                        ? <View style={keyboardStyle.row2spacer}/>
                        : index === 2
                        ? <View style={keyboardStyle.row3spacer}/>
                        : null
                }
                {
                    row.map(
                        elem =>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                key={elem}
                                onPress={() => this.inputCharacter(elem)}
                                style={keyboardStyle.button}
                            >
                                <Text style={keyboardStyle.buttonLabel}>
                                    {elem.toUpperCase()}
                                </Text>
                            </TouchableOpacity>
                    )
                }
                {
                    index === 1
                        ? <View style={keyboardStyle.row2spacer}/>
                        : index === 2
                        ? <View style={keyboardStyle.row3spacer}/>
                        : null
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
                        onPress={() => this.inputCharacter(' ')}
                    >
                        <Text style={keyboardStyle.buttonLabel}>
                            {' '}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        title=' '
                        key='bksp'
                        style={keyboardStyle.button}
                        onPress={() => this.removeCharacter()}
                        onLongPress={() => this.props.setMainContainerState({...INIT_STATE})}
                    >
                        <Text style={keyboardStyle.buttonLabel}>
                            {'bksp'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}