import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers/index";

import App from "./components/app";
import types from "./actions/types";

const createStoreWithMiddleWare = applyMiddleware(thunk)(createStore);

const store = createStoreWithMiddleWare(rootReducer);
if (localStorage.getItem("token")) {
	store.dispatch({ type: types.LOGIN_SUCCESS });
}

ReactDOM.render(
	<Provider store={store}>
		<Router>
			<App />
		</Router>
	</Provider>,
	document.getElementById("root")
);
