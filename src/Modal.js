
import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class IntroModal extends Component {
    constructor(props) {
        super(props);
    }

    
    render() {
        return(
            <Modal isOpen={this.props.show} toggle={this.props.toggle} className={this.props.className}>
            <ModalHeader toggle={this.props.toggle}>CoaX SPECTRAL</ModalHeader>
            <ModalBody>
              Welcome to CoaX SPECTRAL! This is v0.1 of the map. More information should go here.
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.toggle}>View Map</Button>{' '}
            </ModalFooter>
            </Modal>
        )
    }
}

export default IntroModal;