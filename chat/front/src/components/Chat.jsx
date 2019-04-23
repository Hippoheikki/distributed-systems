import React from 'react';

class Chat extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: this.props.name,
            socket: this.props.socket
        };
    }

    render() {
        return (
            <>
            </>
        );
    }
}

export default Chat;
