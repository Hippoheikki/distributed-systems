import React from 'react';
import {Button, Input, Feed, Segment, Container } from 'semantic-ui-react';

const MessageType = Object.freeze({"normal": 1, "left": 2, "joined": 3});

class Chat extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: this.props.name,
            socket: this.props.socket,
            message: '',
            messages: []
        };

        this.state.socket.on("message", (data) => this.receiveMessage(data, MessageType.normal));
        this.state.socket.on("userLeft", (data) => this.receiveMessage(data, MessageType.left));
        this.state.socket.on("userCon", (data) => this.receiveMessage(data, MessageType.joined));
    }

    render() {
        return (
            <Container style={{ padding: 10 }}>
              <Segment style={{ overflow: 'auto', maxHeight: 300, minHeight: 300}}>
                <Feed>
                  {this.showMessages()}
                </Feed>
              </Segment>
                {this.showMessages()}
              <form onSubmit={event => this.sendMessage(event)}>
                <Input
                  placeholder='Message'
                  onChange={e => this.setState({ message: e.target.value})}
                  value={this.state.message}
                />
                <Button primary type="submit">Send</Button>
              </form>
              <Button onClick={() => this.disconnect()}>Disconnect</Button>
            </Container>
        );
    }

    disconnect() {
        this.state.socket.disconnect({query: `name: ${this.state.name}`});
        this.props.dc();
    }

    showMessages() {
        let messages = [];
        for (let i = this.state.messages.length - 1; i >= 0; i--) {
            const mess = this.state.messages[i];
            const user = mess.name === this.state.name ? "You" : mess.name;
            messages.push(<Feed.Event key={mess.key}>
                            <Feed.Content>
                              <Feed.Summary>
                                <Feed.User>{user}</Feed.User> {mess.type}
                                <Feed.Date>{mess.date}</Feed.Date>
                              </Feed.Summary>
                              <Feed.Extra text>
                                {mess.text}
                              </Feed.Extra>
                            </Feed.Content>
                          </Feed.Event>
                         );
        };

        return messages;
    }

    sendMessage(event) {
        event.preventDefault();
        if (this.state.message !== '' || this.state.message.replace(/\s/g, '').length) {
            this.state.socket.emit("message", {message: this.state.message, name: this.state.name});
            this.setState({message: ""});
        }
    }

    receiveMessage(data, type) {
        let t;
        if (type === MessageType.normal) {
            t = "said";
        } else if (type === MessageType.left) {
            t = "left";
        } else if (type === MessageType.joined) {
            t = "joined";
        }
        const d = data.data;

        console.log(type);
        const date = new Date(data.date);
        const offsetMs = date.getTimezoneOffset() * 60 * 1000;
        const dateLocal = new Date(date.getTime() - offsetMs);
        const dateStr = dateLocal.toISOString().slice(0, 19).replace(/-/g, "/").replace("T", " ");

        const joined = this.state.messages.concat({
            key: d.name+dateStr,
            name: d.name,
            text: d.message,
            type: t,
            date: dateStr
        });
        this.setState({ messages: joined });
    }
}

export default Chat;
