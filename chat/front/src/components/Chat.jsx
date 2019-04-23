import React from 'react';
import { Segment, Message, Button, Input, Container } from 'semantic-ui-react';

class Chat extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: this.props.name,
            socket: this.props.socket,
            message: '',
            messages: []
        };

        this.state.socket.on("message", (data) => this.receiveMessage(data));
    }

    render() {
        return (
            <>
              <Segment style={{ overflow: 'auto', maxHeight: 300, minHeight: 300}}>
                {this.showMessages()}
              </Segment>
              <form onSubmit={event => this.sendMessage(event)}>
                <Input
                  placeholder='Message'
                  onChange={e => this.setState({ message: e.target.value})}
                  value={this.state.message}
                />
                <Button primary type="submit">Send</Button>
              </form>
              <Button onClick={() => this.disconnect()}>Disconnect</Button>
            </>
        );
    }

    disconnect() {
        this.state.socket.disconnect({query: `name: ${this.state.name}`});
    }

    showMessages() {
        let messages = [];
        this.state.messages.forEach(mess => {
            messages.push(<Container>
                          <Message key={mess.key} compact>
                            <Message.Header>{mess.name}</Message.Header>
                            <p>{mess.text}</p>
                          </Message>
                         </Container>);
        });

        return messages;
    }

    sendMessage(event) {
        event.preventDefault();
        if (this.state.message !== '' || this.state.message.replace(/\s/g, '').length) {
            this.state.socket.emit("message", {message: this.state.message, name: this.state.name});
            this.setState({message: ""});
        }
    }

    receiveMessage(data) {
        const joined = this.state.messages.concat({
            key: data.name+data.message,
            name: data.name,
            text: data.message
        });
        this.setState({ messages: joined });
    }
}

export default Chat;
