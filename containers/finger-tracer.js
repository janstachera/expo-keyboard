import React from 'react';
import { Svg } from 'expo';
import { Dimensions } from 'react-native';
import { setSuggestions } from './suggestions';

export let updateCandidates = null;
export let resetCandidates = null;

function insertAtEndOfSameLength(array, word) {
    const index = array.findIndex(w => w.length > word.length);
    array.splice(index < 0 ? array.length : index, 0, word);
}


const INIT_STATE = {
    unfinishedCandidates: [],
    fingerTrace: [],
    fingerString: '',
    lastLetter: '',
    visible: false,
};

let wiperBreak = false;

export default class FingerTracer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {...INIT_STATE};
    }

    componentDidMount () {
        updateCandidates = this.updateCandidates;
        resetCandidates = this.handleFingerUp;
    }

    createSvgStyle = () => ({
        height: Dimensions.get('window').height * 0.325,
        borderColor: 'red',
        borderWidth: 5,
        width: "100%",
        position: 'absolute',
        bottom: 0,
        left: 0,
        zIndex: this.state.visible ? 100 : -100,
    });

    handleFingerDown = () => {
        wiperBreak = true;
        this.setState({ ...INIT_STATE, visible: true, });
        this.updateTrace(INIT_STATE.fingerTrace);
    };

    handleFingerUp = () => {

        const traceWiper = () => {
            if (!wiperBreak) {
                let trace = this.state.fingerTrace.slice();
                trace.splice(0, 4);
                this.updateTrace(trace);
                if (trace.length > 0) {
                    setTimeout(traceWiper, 20);
                } else {
                    this.setState({ ...INIT_STATE });
                }
            }
        };

        wiperBreak = false;
        this.setState(({ fingerTrace }) => ({ ...INIT_STATE, fingerTrace, visible: true }), traceWiper);

    };

    handleMove = (e) => {
        let trace = this.state.fingerTrace.slice();
        const {
            pageX,
            pageY,
        } = e.nativeEvent;
        const {
            height,
            width,
        } = Dimensions.get('window');

        const topOfKbOffset = height * 0.676;
        const coords = Math.round(pageX) + ' ' + Math.round(pageY - topOfKbOffset) + ' ';

        const xRatio = 100*pageX/width;
        const yRatio = 100*(pageY-topOfKbOffset)/(height - topOfKbOffset);


        this.updateCandidates(this.resolveLetter(xRatio, yRatio));

        trace.push(coords);
        if (trace.length > 50) {
            trace.splice(0, 1);
        }
        this.updateTrace(trace);
    };

    updateCandidates = (newLetter) => {

        const { unfinishedCandidates, lastLetter } = this.state;

        if (lastLetter === newLetter) { return; }
        if (unfinishedCandidates.length === 0) {
            this.setState({ unfinishedCandidates: [ newLetter, `${newLetter}${newLetter}` ], lastLetter: newLetter });
        } else {
            const newUnfinishedCandidates = unfinishedCandidates.slice();
            const cands = [];
            unfinishedCandidates.forEach(unfinCandidate => {
                const path = this.followDictionary(unfinCandidate);
                if (path !== undefined && path[newLetter] !== undefined) {
                    const isDoubleLegit = path[newLetter][newLetter] !== undefined;

                    if (newUnfinishedCandidates.indexOf(`${unfinCandidate}${newLetter}`) < 0) {
                        newUnfinishedCandidates.push(`${unfinCandidate}${newLetter}`);
                        if (isDoubleLegit) { newUnfinishedCandidates.push(`${unfinCandidate}${newLetter}${newLetter}`); }
                    }
                    if (path[newLetter][0]) {
                        insertAtEndOfSameLength(cands, path[newLetter][0]);
                    }
                    if (
                        isDoubleLegit
                        && path[newLetter][newLetter][0]
                    ) {
                        insertAtEndOfSameLength(cands, path[newLetter][newLetter][0]);
                    }
                }
            });

            if (setSuggestions !== null) {
                const reverseCands = cands.slice().reverse();

                const suggestions = reverseCands.filter(s => s[s.length - 1] === newLetter);
                if (suggestions.length < 3) {
                    const otherSuggestions = reverseCands.slice(0,3).filter(c => !suggestions.some(s => s === c));
                    suggestions.push(...otherSuggestions);
                }

                setSuggestions(suggestions.slice(0,3));
            }
            this.setState({ unfinishedCandidates: newUnfinishedCandidates, lastLetter: newLetter });
        }

    };

    followDictionary = (path) => {
        const letters = [...path];
        const { dictionary } = this.props;
        let pointer = dictionary;
        letters.forEach(letter => pointer = pointer[letter]);
        return pointer;
    };

    resolveLetter = (xRatio, yRatio) => {

        const rowDividers = [10, 11.112, 14.286];
        const letters = [
            ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
            ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
            ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
        ];

        switch (true) {
            case (yRatio < 25):
                return letters[0][Math.floor(xRatio/rowDividers[0])];
            case (yRatio < 50):
                return letters[1][Math.floor(xRatio/rowDividers[1])];
            case (yRatio < 75):
                return letters[2][Math.floor(xRatio/rowDividers[2])];
            default:
                return '';
        }
    };

    updateTrace = (trace) => {
        let points = 'M' + trace.reduce(
            (ac, el, ind) => ind % 2 === 0
                ? ac + el
                : ac + 'L' + el,
            ''
        );
        this.setState({ fingerTrace: trace, fingerString: points });
    };

    render () {
        return (
            <Svg
                style={this.createSvgStyle()}
                onStartShouldSetResponder={
                    () => true
                }
                onMoveShouldSetResponder={
                    () => {
                        return true;
                    }
                }
                onResponderGrant={
                    () => {
                        this.handleFingerDown();
                    }
                }
                onResponderMove={
                    (e) => {
                        this.handleMove(e);
                    }
                }
                onResponderRelease={
                    () => {
                        this.handleFingerUp();
                    }
                }
            >
                <Svg.Path
                    d={this.state.fingerString}
                    fill="none"
                    stroke="red"
                    strokeWidth={5}
                />
            </Svg>
        );
    }

}
