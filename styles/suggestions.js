import { StyleSheet } from 'react-native';

export const suggestionsStyle = StyleSheet.create({
    suggestions: {
        flex: 0.2,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'space-around',
        flexDirection: 'row',
    },
    suggButton: {
        flex: 0.3,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#eee',
    },
    suggButtonLabel: {
        color: '#555',
    },
});

export default suggestionsStyle;
