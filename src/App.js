import React from 'react'
import './App.css'
import 'bulma/css/bulma.css'
import {Switch, Route} from 'react-router-dom'
import {NotFound} from './pages/NotFound'
import {Dashboard} from './pages/Dashboard'
import {Init} from './pages/Init'

function App() {
  const url = new URL(document.location)
  console.log("*url -> " + JSON.stringify(url))
  console.log("search params -> " + url.searchParams)
  return (
    <div className="App">
      <Switch>
        <Route exact path='/' component={Dashboard} ></Route>
        <Route exact path='/init' component={Init} ></Route>
        <Route component={NotFound}></Route>      
      </Switch>        
    </div>
  );
}

export default App;