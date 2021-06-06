import React from 'react'
import { Provider } from 'react-redux';
import { configureStore } from '../store'
import { BrowserRouter as Router } from 'react-router-dom'
import Main from './Main'
// import Chat from '../containers/chat/Chat'
const store = configureStore();




const App = () => {
  return (
    <Provider store={store} >
      <Router>
        <div>
          <Main />
        </div>
      </Router>
    </Provider >
  )

};




export default App;
