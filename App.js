import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity  } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { keyboardStyle, suggestionsStyle, viewStyle } from './styles';
import { Keyboard } from './containers';

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
    svgVisible: false,
    fingerTrace: [],
    fingerString: '',
};

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {...INIT_STATE};
    }

    resetDictionary = () => {
        this.setState({dictionary: fullDictionary.slice()});
    };

    upgradeCursorPosition = (position) => {
        this._textInput.setNativeProps(
            {
                selection:
                    {
                        end: position + 1,
                        start: position + 1,
                    },
            }
        );
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

    hideSvg = () => {
        this.setState({
            svgVisible: false,
        });
    };

    showSvg = () => {
        this.setState({
            svgVisible: true,
        });
    };

    handleSvgMove = (e, t) => {
        let trace = t.state.fingerTrace;
        const coords = Math.round(e.nativeEvent.pageX) + ' ' + Math.round(e.nativeEvent.pageY - 450) + ' ';
        trace.push(coords);
        // if (trace.length > 20) {
        //     trace.splice(0, 1);
        // }
        let points = 'M' + trace.reduce(
            (ac, el, ind, arr) => ind % 2 === 0
                ? ac + el
                : ind === arr.length - 1
                    ? ac + 'L' + el
                    : ac + 'Q' + el,
            ''
        );
        console.log(points);
        t.state.fingerTrace = trace;
        t.state.fingerString = points;
        // t.setState({ fingerTrace: trace, fingerString: points });
    };

    createSvgStyle = () => ({
        height: 192,
        borderColor: 'red',
        borderWidth: 5,
        width: 360,
        position: 'absolute',
        bottom: 0,
        left: 0,
        zIndex: this.state.svgVisible ? 100 : -100,
    });

    render() {
        const suggestions = this.state.currentWord ? this.state.dictionary.slice(0,3) : [];


        const createSuggButton = (word, index) => (
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
                <View style={suggestionsStyle.suggestions}>
                    {
                      suggestions.length > 1 ? createSuggButton(suggestions[1], 1) : null
                    }
                    {
                      suggestions.length > 0 ? createSuggButton(suggestions[0], 0) : null
                    }
                    {
                      suggestions.length > 2 ? createSuggButton(suggestions[2], 2) : null
                    }
                </View>
                <Svg
                    style={this.createSvgStyle()}
                >
                    <Path
                        d={this.state.fingerString}
                        fill="none"
                        stroke="red"
                        strokeWidth="5"
                    />
                </Svg>
                <View
                    style={keyboardStyle.keyboard}
                    onStartShouldSetResponder={
                        () => true
                    }
                    onMoveShouldSetResponder={
                        () => {
                            this.setState({ svgVisible: true });
                            return true;
                        }
                    }
                    onResponderMove={
                        (e) => {
                            this.handleSvgMove(e, this);
                        }
                    }
                    onResponderRelease={
                        () => {
                            this.setState({ svgVisible: false, fingerTrace: [], });
                        }
                    }
                >
                    <Keyboard />
                </View>
            </View>
        );
    }
}
