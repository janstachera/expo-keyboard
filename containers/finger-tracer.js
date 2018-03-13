import React from 'react';
import Svg, { Path } from 'react-native-svg';

const INIT_STATE = {
    fingerTrace: [],
    fingerString: '',
};

export default class FingerTracer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {...INIT_STATE};
    }

    handleMove = (e) => {
        let trace = this.state.fingerTrace;
        const coords = Math.round(e.nativeEvent.pageX) + ' ' + Math.round(e.nativeEvent.pageY - 450) + ' ';
        trace.push(coords);
        if (trace.length > 20) {
            trace.splice(0, 1);
        }
        let points = 'M' + trace.reduce(
            (ac, el, ind, arr) => ind % 2 === 0
                ? ac + el
                : ind === arr.length - 1
                    ? ac + 'L' + el
                    : ac + 'Q' + el,
            ''
        );
        console.log(points);
        // t.state.fingerTrace = trace;
        // t.state.fingerString = points;
        this.setState({ fingerTrace: trace, fingerString: points });
    };


}