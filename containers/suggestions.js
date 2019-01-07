import React from 'react';
import { Text, View, TouchableOpacity  } from 'react-native';
import { suggestionsStyle } from '../styles';

export let setSuggestions = null;

export class Suggestions extends React.Component {
    state = {
        suggestions: [],
    };

    componentDidMount() {
        setSuggestions = this.setSuggestions;
    }

    setSuggestions = (suggestions) => {
        this.setState({ suggestions });
    };

    createSuggButton = (word, index) => (
        <TouchableOpacity
            key={`sugg${index}`}
            style={suggestionsStyle.suggButton}
            onPress={() => this.props.onChooseSuggestion(word)}
        >
            <Text style={suggestionsStyle.suggButtonLabel} >
                {word}
            </Text>
        </TouchableOpacity>
    );

    render () {
        const { suggestions } = this.state;

        return (
            <View style={suggestionsStyle.suggestions}>
                { suggestions.length > 2 ? this.createSuggButton(suggestions[2], 2) : null }
                { suggestions.length > 0 ? this.createSuggButton(suggestions[0], 0) : null }
                { suggestions.length > 1 ? this.createSuggButton(suggestions[1], 1) : null }
            </View>
        );
    }

}