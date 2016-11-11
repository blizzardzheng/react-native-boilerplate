/* @flow */
'use strict';

import React from 'react';
import { ActivityIndicator, Platform, ProgressBarAndroid } from 'react-native';
import NativeBaseComponent from 'native-base/Components/Base/NativeBaseComponent';
import computeProps from 'native-base/Utils/computeProps';


export default class SpinnerNB extends NativeBaseComponent {

    prepareRootProps() {

        var type = {
            height: 40
        }

        var defaultProps = {
            style: type
        }

        return computeProps(this.props, defaultProps);

    }


    render() {
        return(
           <ProgressBarAndroid  {...this.prepareRootProps()} styleAttr = "Horizontal"
                                                    indeterminate = {false} progress={this.props.progress ? this.props.progress/100 : 0.5}
                                                    color={this.props.color ? this.props.color : this.props.inverse ? this.getTheme().inverseProgressColor :
                                                      this.getTheme().defaultProgressColor}  />
            
        );
    }

}
