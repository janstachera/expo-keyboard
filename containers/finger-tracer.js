import React from 'react';
// import Svg, { Path } from 'react-native-svg';
import { Svg } from 'expo';

const INIT_STATE = {
    fingerTrace: [],
    fingerString: '',
    visible: false,
};

let wiperBreak = false;

export default class FingerTracer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {...INIT_STATE};
    }

    createSvgStyle = () => ({
        height: 220,
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
        wiperBreak = false;
        this.setState({ ...INIT_STATE, visible: true, });
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
        traceWiper();
    };

    handleMove = (e) => {
        let trace = this.state.fingerTrace.slice();
        const coords = Math.round(e.nativeEvent.pageX) + ' ' + Math.round(e.nativeEvent.pageY - 463) + ' ';
        trace.push(coords);
        if (trace.length > 50) {
            trace.splice(0, 1);
        }
        this.updateTrace(trace);
    };

    updateTrace = (trace) => {
        // let points = 'M' + trace.reduce(
        //     (ac, el, ind, arr) => ind % 2 === 0
        //         ? ac + el
        //         : ind === arr.length - 1
        //             ? ac + 'L' + el
        //             : ac + 'Q' + el,
        //     ''
        // );
        let points = 'M' + trace.reduce(
            (ac, el, ind, arr) => ind % 2 === 0
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
