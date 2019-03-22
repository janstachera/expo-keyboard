import { StyleSheet } from 'react-native';

export const suggestionsStyle = StyleSheet.create({
    suggestions: {
        flex: 0.08,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'space-around',
        flexDirection: 'row',
        backgroundColor: '#eee',
    },
    suggButton: {
        flex: 0.3,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    suggButtonLabel: {
        color: '#555',
    },
});

export default suggestionsStyle;
