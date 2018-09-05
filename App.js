import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity  } from 'react-native';
import { keyboardStyle, suggestionsStyle, viewStyle } from './styles';
import MyKeyboard from "./containers/keyboard";
import FingerTracer from "./containers/finger-tracer";
import { Keyboard } from 'react-native';
import { dictionary } from './dictionary';

let fullDictionary = [];

const INIT_STATE = {
    text: '',
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
        setTimeout(() => this.setState({ dictionary: fullDictionary }), 1000);
    }

    handleKeyboardSetState = (args) => {
        this.setState({ ...args });
    };

    resetDictionary = () => {
        this.setState({ dictionary: fullDictionary.slice() });
    };

    removeCharacter = () => {
        const text = this.state.text;
        const position = this.state.cursorPosition;
        const output = text.substr(0, position - 1) + text.substr(position);
        console.log(text, position, output);
        this.setState({
            text: output,
            cursorPosition: position - 1,
            currentWord: '',
            dictionary: fullDictionary.slice(),
        });
    };

    createSuggButton = (word, index) => (
        <TouchableOpacity
            key={`sugg${index}`}
            style={suggestionsStyle.suggButton}
            onPress={() => this.chooseSuggestion(word)}
        >
            <Text style={suggestionsStyle.suggButtonLabel} >
                {word}
            </Text>
        </TouchableOpacity>
    );

    chooseSuggestion = (word) => {
        const textToTheLeft = this.state.text.slice(0, this.state.cursorPosition);
        const startOfWord = textToTheLeft.lastIndexOf(this.state.currentWord);
        const newText = this.state.text.substr(0, startOfWord) + word + ' ' + this.state.text.substr(this.state.cursorPosition);
        const position = startOfWord + word.length + 1;

        this.setState({
            dictionary: fullDictionary.slice(),
            text: newText,
            cursorPosition: position,
            currentWord: '',
        });

        // this.upgradeCursorPosition(position);
    };

    render() {
        if (dictionary) { fullDictionary = dictionary.slice(0,4).map(dict => dict.default).reduce((acc,dict) => acc.concat(dict), []); }
        const suggestions = this.state.currentWord ? this.state.dictionary.slice(0,3) : [];
        return (
            <View style={viewStyle.container}>
                <View style={viewStyle.preview}>
                    <TextInput
                        style={viewStyle.inputField}
                        value={this.state.text}
                        onChangeText={(text) => {
                            this.setState(text);
                            this._textInput.focus();
                        }}
                        // onFocus={() => { Keyboard.dismiss(); }}
                        onSelectionChange={(event) => { this.setState({ cursorPosition: event.nativeEvent.selection.start }) }}
                        ref={component => this._textInput = component}
                        multiline
                    />
                </View>
                <FingerTracer
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
                    <View style={suggestionsStyle.suggestions}>
                        { suggestions.length > 1 ? this.createSuggButton(suggestions[1], 1) : null }
                        { suggestions.length > 0 ? this.createSuggButton(suggestions[0], 0) : null }
                        { suggestions.length > 2 ? this.createSuggButton(suggestions[2], 2) : null }
                    </View>
                        <MyKeyboard
                            removeCharacter={this.removeCharacter}
                            setContainerState={this.handleKeyboardSetState}
                            text={this.state.text}
                            cursorPosition={this.state.cursorPosition}
                            dictionary={this.state.dictionary}
                            currentWord={this.state.currentWord}
                            textInput={this._textInput}
                        />
                </View>
            </View>
        );
    }
}
