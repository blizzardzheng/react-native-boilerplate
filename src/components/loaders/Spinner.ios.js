/* @flow */
'use strict';

import React from 'react';
import { ActivityIndicator, Platform } from 'react-native';
import NativeBaseComponent from 'native-base/Components/Base/NativeBaseComponent';
import computeProps from 'native-base/Utils/computeProps';


export default class SpinnerNB extends NativeBaseComponent {

    prepareRootProps() {

        var type = {
            height: 80
        }

        var defaultProps = {
            style: type
        }

        return computeProps(this.props, defaultProps);

    }


    render() {
        return(
            <ActivityIndicator {...this.prepareRootProps()}  color={this.props.color ? this.props.color : this.props.inverse ?
                                                                this.getTheme().inverseSpinnerColor :
                                                                this.getTheme().defaultSpinnerColor}
                                                                size={this.props.size ? this.props.size : "large" } />
        );
    }

}
