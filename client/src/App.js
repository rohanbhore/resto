import React, { Component } from 'react';
import {Switch,Route} from 'react-router-dom'
import './App.css';
import Menu from './order';
import Report from './report';

class App extends Component {
  render() {
    return (
      
          <Switch>
              <Route exact path='/' component={Menu}/>
              <Route exact path='/Report' component={Report}/>
          </Switch>
    
    );
  }
}

export default App;
