import React, {useEffect} from 'react'
import { Provider } from 'react-redux';
import { configureStore } from '../store'
import { BrowserRouter as Router} from 'react-router-dom'
import Main from './Main'
import AOS from 'aos';

// import Chat from '../containers/chat/Chat'
const store = configureStore();




const App = () => {
  // const location = useLocation();

  useEffect(() => {
    AOS.init({
      once: true,
      disable: 'phone',
      duration: 700,
      easing: 'ease-out-cubic',
    });
  });

  // useEffect(() => {
  //   document.querySelector('html').style.scrollBehavior = 'auto'
  //   window.scroll({ top: 0 })
  //   document.querySelector('html').style.scrollBehavior = ''
  //   focusHandling('outline');
  // }, [location.pathname]); // triggered on route change
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
