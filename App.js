import React from 'react';
import { Text, View, TextInput  } from 'react-native';
import { keyboardStyle, viewStyle } from './styles';
import MyKeyboard from "./containers/keyboard";
import FingerTracer, { resetCandidates } from "./containers/finger-tracer";
import { Suggestions, setSuggestions } from "./containers/suggestions";
import { dictionary } from './dictionary';

let fullDictionary = {};

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
    text: '',
    svgVisible: true,
};

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {...INIT_STATE};
    }

    componentDidMount() {
        if (dictionary && Object.keys(fullDictionary).length === 0) {
            this.prepareDictionary();
        }
    }

    resetMainState = () => {
        this.setState(INIT_STATE);
    };

    addSpace = () => this.addCharacter(' ');

    addCharacter = (char) => {
        this.setState(({ text }) => ({ text: `${text}${char}` }));
    };

    removeCharacter = () => {
        const {
            text,
        } = this.state;

        const output = text.substr(0, text.length - 1);

        this.setState({
            text: output,
        }, () => setSuggestions([]));
    };

    chooseSuggestion = (word) => {
        const { text } = this.state;

        const newText = `${text}${word} `;

        this.setState({
            text: newText,
        }, () => {
            setSuggestions([]);
            resetCandidates();
        });
    };

    prepareDictionary = () => {
        fullDictionary = arrToObj(dictionary
            .slice(0,4)
            .map(dict => dict.default)
            .reduce((acc,dict) => acc.concat(dict), [])
        );

        this.forceUpdate();

    };

    render() {

        return (
            <View style={viewStyle.container}>
                <View style={viewStyle.preview}>
                    <Text>{`${this.state.text}|`}</Text>
                </View>
                <FingerTracer
                    addCharacter={this.addCharacter}
                    dictionary={fullDictionary}
                    visible={this.state.svgVisible}
                    ref={(fingerTracer) => this.fingerTracer = fingerTracer}
                />
                <Suggestions
                    onChooseSuggestion={this.chooseSuggestion}
                />
                <View
                    style={keyboardStyle.keyboard}
                    onStartShouldSetResponder={() => true}
                    onMoveShouldSetResponder={() => true}
                    onResponderGrant={() => { this.fingerTracer.handleFingerDown(); }}
                    onResponderMove={(e) => { this.fingerTracer.handleMove(e); }}
                    onResponderRelease={() => { this.fingerTracer.handleFingerUp(); }}
                >
                    <MyKeyboard
                        addCharacter={this.addCharacter}
                        addSpace={this.addSpace}
                        removeCharacter={this.removeCharacter}
                        text={this.state.text}
                        resetMainState={this.resetMainState}
                    />
                </View>
            </View>
        );
    }
}
