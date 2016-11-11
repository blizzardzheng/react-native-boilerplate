import { AsyncStorage } from 'react-native';
import { createStore, applyMiddleware, compose } from 'redux';
import devTools from 'remote-redux-devtools';
import thunk from 'redux-thunk';
import reducer from '../reducers';
import { persistStore } from 'redux-persist';
// import promise from './promise';

export default function configureStore(onCompletion:()=>void):any {
	const enhancer = compose(
		applyMiddleware(thunk),
		devTools({
  name: 'nativestarterproseed', realtime: true
	}),
	);

	let store = createStore(reducer, enhancer);
  persistStore(store, { storage: AsyncStorage }, onCompletion);

	return store;
}
