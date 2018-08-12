import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity  } from 'react-native';
import { keyboardStyle, suggestionsStyle, viewStyle } from './styles';
import Keyboard from "./containers/keyboard";
import FingerTracer from "./containers/finger-tracer";

let inwokacja = 'Litwo! Ojczyzno moja! Ty jesteś jak zdrowie, Ile cię trzeba cenić, ten tylko się dowie, Kto cię stracił. Dziś piękność twą w całej ozdobie Widzę i opisuję, bo tęsknię po tobie Panno święta, co Jasnej bronisz Częstochowy I w Ostrej świecisz Bramie! Ty, co gród zamkowy Nowogródzki ochraniasz z jego wiernym ludem! Jak mnie dziecko do zdrowia powróciłaś cudem, (Gdy od płaczącej matki pod Twoją opiekę Ofiarowany, martwą podniosłem powiekę';
inwokacja = inwokacja.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
inwokacja = inwokacja.toLowerCase();
inwokacja = inwokacja.split(' ');
inwokacja = inwokacja.filter((word, index, arr) => arr.indexOf(word) === index);
const fullDictionary = inwokacja.sort((a,b) => a.length - b.length );

const INIT_STATE = {
    text: '',
    cursorPosition: 0,
    dictionary: fullDictionary.slice(),
    currentWord: '',
    svgVisible: true,
};

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {...INIT_STATE};
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
        this.setState({
            text: output,
            cursorPosition: position + 1,
            currentWord: '',
            dictionary: fullDictionary.slice(),
        });
    };

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

        this.upgradeCursorPosition(position);
    };

    render() {
        const suggestions = this.state.currentWord ? this.state.dictionary.slice(0,3) : [];

        return (
            <View style={viewStyle.container}>
                <View style={viewStyle.preview}>
                    <TextInput
                        style={viewStyle.inputField}
                        value={this.state.text}
                        onChangeText={(text) => this.setState(text)}
                        onSelectionChange={(event) => { this.setState({ cursorPosition: event.nativeEvent.selection.start }) }}
                        ref={component => this._textInput = component}
                        multiline
                        disabled
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
                        { suggestions.length > 1 ? createSuggButton(suggestions[1], 1) : null }
                        { suggestions.length > 0 ? createSuggButton(suggestions[0], 0) : null }
                        { suggestions.length > 2 ? createSuggButton(suggestions[2], 2) : null }
                    </View>
                        <Keyboard
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
