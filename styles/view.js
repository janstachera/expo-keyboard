import { StyleSheet } from 'react-native';

export const viewStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    preview: {
        flex: 0.63,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputField: {
        flex: 0.9,
        height: 300,
        fontSize: 20,
    },
});

export default viewStyle;
