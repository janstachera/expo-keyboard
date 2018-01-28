import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity  } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { keyboardStyle, suggestionsStyle, viewStyle } from './styles';

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

    inputCharacter = (character) => {
        const text = this.state.text;
        const position = this.state.cursorPosition;
        const output = text.substr(0, position) + character + text.substr(position);

        this.upgradeCursorPosition(position);

        if (character === ' ') {
            this.setState({
                currentWord: '',
                dictionary: fullDictionary.slice(),
                text: output,
                cursorPosition: position + 1
            });
        } else {
            const currrentWord = `${this.state.currentWord}${character}`;
            const newCandWords = this.state.dictionary.filter((word) => word.indexOf(currrentWord) === 0);
            this.setState({
                currentWord: currrentWord,
                dictionary: newCandWords,
                text: output,
                cursorPosition: position + 1
            });
        }

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

    handleSvgMove = (e) => {
            console.log('SVG -> x: ',Math.round(e.nativeEvent.pageX),' y: ', Math.round(e.nativeEvent.pageY));
    };

    drawOnSvg = () => {
        return (<Polyline
            points="10,10 20,12 30,20 40,60 60,70 95,90"
            fill="none"
            stroke="black"
            strokeWidth="3"
        />);
    };

    createSvgStyle = () => ({
        height: 192,
        width: 360,
        position: 'absolute',
        bottom: 0,
        left: 0,
        zIndex: this.state.svgVisible ? 100 : -100,
    });

    render() {
        const suggestions = this.state.currentWord ? this.state.dictionary.slice(0,3) : [];

        console.log(suggestions);
        const row1 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
        const row2 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
        const row3 = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];
        const allRows = [row1, row2, row3];

        const addKeyboardRow = (row, index) =>
            (<View style={keyboardStyle.keyboardRow} key={`row${index}`}>
                {
                    index === 1
                        ? <View style={keyboardStyle.row2spacer} />
                        : index === 2
                            ? <View style={keyboardStyle.row3spacer} />
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
                              <Text style={keyboardStyle.buttonLabel} >
                                  {elem.toUpperCase()}
                              </Text>
                            </TouchableOpacity>
                    )
                }
                {
                    index === 1
                        ? <View style={keyboardStyle.row2spacer} />
                        : index === 2
                            ? <View style={keyboardStyle.row3spacer} />
                            : null
                }
            </View>);

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
                    onSelectionChange={(event) => { this.setState({ cursorPosition: event.nativeEvent.selection.start}) }}
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
                  onStartShouldSetResponder={()=>{ console.log('SVG shouldSetResp'); return true;}}
                  onMoveShouldSetResponder={()=>{ console.log('SVG onMoveShouldSetResp'); return true;}}
                  onResponderMove={this.handleSvgMove}
              >
                  <Polyline
                      points="10,10 20,12 30,20 40,60 60,70 95,90"
                      fill="none"
                      stroke="black"
                      strokeWidth="2"
                  />
              </Svg>
              <View
                  style={keyboardStyle.keyboard}
                  onStartShouldSetResponder={()=>{ console.log('Keyboard shouldSetResp'); return true;}}
                  onMoveShouldSetResponder={()=>{ console.log('Keyboard onMoveShouldSetResp'); return true;}}
                  onResponderMove={(e)=>{
                      !this.state.svgVisible ? this.setState({ svgVisible: true }) : this.handleSvgMove(e);
                  }}
                  onResponderRelease={() => { this.setState({ svgVisible: false }) }}
              >
                  {allRows.map((row, index) => addKeyboardRow(row,index))}
                <View style={keyboardStyle.keyboardRow}>
                  <TouchableOpacity
                      title=' '
                      key='space'
                      style={keyboardStyle.space}
                      onPress={() => this.inputCharacter(' ')}
                  >
                    <Text style={keyboardStyle.buttonLabel} >
                        {' '}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                      title=' '
                      key='bksp'
                      style={keyboardStyle.button}
                      onPress={() => this.removeCharacter()}
                      onLongPress={() => this.setState({ ...INIT_STATE })}
                  >
                    <Text style={keyboardStyle.buttonLabel} >
                        {'bksp'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
        );
    }
}
