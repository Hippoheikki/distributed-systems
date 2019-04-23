import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import LandingPage from './components/Landingpage.jsx';

class App extends React.Component {
    render() {
        return(
            <BrowserRouter>
              <Switch>
                <Route path="/" component={LandingPage} exact />
              </Switch>
            </BrowserRouter>
        );
    }
}

export default App;
