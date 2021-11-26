import React from 'react';
import Dialog from "react-native-dialog";
import {View} from 'react-native';

export default class CustomDialog extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View>
                <Dialog.Container visible = {this.props.visible}>
                    <Dialog.Title>{this.props.title}</Dialog.Title>
                    <Dialog.Description>{this.props.message}</Dialog.Description>
                    <Dialog.Button label="Cancel" onPress={this.props.cancelHandleAction} />
                    <Dialog.Button label="Accept" onPress={this.props.acceptHandleAction} />
                </Dialog.Container>
            </View>
        );
    }
}