import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity  } from 'react-native';
import { keyboardStyle, suggestionsStyle, viewStyle } from './styles';
import MyKeyboard from "./containers/keyboard";
import FingerTracer from "./containers/finger-tracer";
import { Suggestions } from "./containers/suggestions";
import { Keyboard } from 'react-native';
import { dictionary } from './dictionary';

let fullDictionary = [];


const arrToObj = (arr) =>
    arr.reduce((acc, word) => {
        let pointer = acc;
        [...word].forEach((letter) => {
            if (pointer[letter] === undefined) {
                pointer[letter] = {};
            }
            pointer = pointer[letter];
        });
        pointer['0'] = word;
        return acc;
    }, {});

const INIT_STATE = {
    text: 'asdgag',
    cursorPosition: 0,
    dictionary: fullDictionary.slice(),
    currentWord: '',
    svgVisible: true,
};
const suggestions = [];

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {...INIT_STATE};
    }

    componentDidMount() {
        setTimeout(() => this.setState({
            dictionary: fullDictionary
        }), 1000);
    }

    handleKeyboardSetState = (args) => {
        this.setState({ ...args });
    };

    resetMainState = () => {
        this.setState(INIT_STATE);
    };

    removeCharacter = () => {
        const {
            text,
            cursorPosition,
        } = this.state;

        const output = text.substr(0, cursorPosition - 1) + text.substr(cursorPosition);

        this.setState({
            text: output,
            cursorPosition: cursorPosition - 1,
            currentWord: '',
            dictionary: fullDictionary.slice(),
        });
    };

    updateCursorPosition = (position) => {
        this._textInput.setNativeProps({
            selection: {
                end: position,
                start: position ,
            },
        });
    };

    chooseSuggestion = (word) => {
        const {
            currentWord,
            cursorPosition,
            text,
        } = this.state;

        const partOfWordToAdd = word.substr(currentWord.length);

        const newText = text.substr(0, cursorPosition) + partOfWordToAdd + ' ' + text.substr(cursorPosition);
        const position = cursorPosition + partOfWordToAdd.length + 1;

        this.updateCursorPosition(position);

        this.setState({
            dictionary: fullDictionary.slice(),
            text: newText,
            cursorPosition: position,
            currentWord: '',
        });
    };

    prepareDictionary = () => {
        fullDictionary = arrToObj(dictionary
            .slice(0,4)
            .map(dict => dict.default)
            .reduce((acc,dict) => acc.concat(dict), [])
        );
    };

    render() {
        if (dictionary && fullDictionary.length === 0) { this.prepareDictionary(); }
        const suggestions = this.state.currentWord ? this.state.dictionary.slice(0,3) : [];
        return (
            <View style={viewStyle.container}>
                <View style={viewStyle.preview}>
                    {/*<TextInput*/}
                        {/*style={viewStyle.inputField}*/}
                        {/*value={this.state.text}*/}
                        {/*selectTextOnFocus={false}*/}
                        {/*// onFocus={() => { Keyboard.dismiss(); }}*/}
                        {/*readOnly*/}
                        {/*onSelectionChange={(event) => { this.setState({ cursorPosition: event.nativeEvent.selection.start }); }}*/}
                        {/*ref={component => this._textInput = component}*/}
                        {/*multiline*/}
                    {/*/>*/}
                    <Text>{this.state.text}</Text>
                </View>
                <FingerTracer
                    dictionary={fullDictionary}
                    visible={this.state.svgVisible}
                    ref={(fingerTracer) => this.fingerTracer = fingerTracer}
                />
                <View
                    style={keyboardStyle.keyboard}
                    onStartShouldSetResponder={() => true}
                    onMoveShouldSetResponder={() => true}
                    onResponderGrant={() => { this.fingerTracer.handleFingerDown(); }}
                    onResponderMove={(e) => { this.fingerTracer.handleMove(e); }}
                    onResponderRelease={() => { this.fingerTracer.handleFingerUp(); }}
                >
                    <Suggestions
                        onChooseSuggestion={this.chooseSuggestion}
                    />
                    <MyKeyboard
                        removeCharacter={this.removeCharacter}
                        setContainerState={this.handleKeyboardSetState}
                        text={this.state.text}
                        cursorPosition={this.state.cursorPosition}
                        dictionary={this.state.dictionary}
                        currentWord={this.state.currentWord}
                        textInput={this._textInput}
                        resetMainState={this.resetMainState}
                        updateCursorPosition={this.updateCursorPosition}
                    />
                </View>
            </View>
        );
    }
}
