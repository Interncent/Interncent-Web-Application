import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/index';

// import { composeWithDevTools } from 'redux-devtools-extension';

export function configureStore() {
    const store = createStore(rootReducer, applyMiddleware(thunk));
    return store;
}