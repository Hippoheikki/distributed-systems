import React from 'react';
import { Input, Button } from 'semantic-ui-react';
import io from 'socket.io-client';
import Chat from './Chat';

class Landingpage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            connected: false,
            socket: null,
            ip: '',
            name: ''
        };
    }

    render() {
        return this.state.connected ? (
            <Chat name={this.state.name} socket={this.state.socket} />
        ) : (
            <form onSubmit={event => this.connect(event)}>
              <Input
                placeholder='IP'
                onChange={e => this.setState({ ip: e.target.value })}
                value={this.state.ip}
              />
              <Input
                placeholder='Name'
                onChange={e => this.setState({ name: e.target.value })}
                value={this.state.name}
              />
              <Button primary type="submit">Connect</Button>
            </form>
        );
    }

    connect(event) {
        event.preventDefault();
        const { ip, name } = this.state;
        const socket = io(ip, {query: `name=${name}`});

        socket.on('connect', () => {
            console.log("connected");
            this.setState({connected: true, socket: socket});
        });
    }
}

export default Landingpage;
