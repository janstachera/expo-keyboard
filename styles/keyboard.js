import { StyleSheet } from 'react-native';

export const keyboardStyle = StyleSheet.create({
    keyboard: {
        flex: 0.3,
        backgroundColor: 'gray',
        justifyContent: 'space-between',
    },
    keyboardWrapper: {
        flex: 1,
    },
    keyboardRow: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
        borderColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    row2spacer: {
        flex: 0.045,
    },
    row3spacer: {
        flex: 0.09,
    },
    space: {
        flex: 0.6,
        borderRadius: 10,
        backgroundColor: '#666',
        width: 2,
        height: 40,
        borderColor: 'lightgray',
        borderBottomWidth: 1,
        borderRightWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        flex: 0.09,
        borderRadius: 6,
        backgroundColor: '#666',
        width: 2,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonLabel: {
        color: 'white',
    },
});

export default keyboardStyle;
