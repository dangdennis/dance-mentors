import types from './types';
import { db, auth } from '../firebase/index';
import firebase from 'firebase';
import axios from 'axios';

// Get all mentors from database, set into redux state
export function getAllMentors() {
	return dispatch => {
		db.ref('Mentors').on('value', snapshot => {
			const data = snapshot.val();
			dispatch({
				type: types.GET_MENTORS,
				payload: data
			});
		});
	};
}

export function addMentee(person) {
	db.ref('Mentees').push(person).then(resp => {
		console.log('Data added:', resp.key);
	});
	return {
		type: types.ADD_MENTEE,
		payload: person
	};
}

export function addMentor(person) {
	db.ref('Mentors').push(person).then(resp => {
		console.log('resp addmentor data', resp);
		console.log('Data added:', resp.key);
	});
	return {
		type: types.ADD_MENTOR,
		payload: person
	};
}

// Authenticating different providers
function authenticate(provider) {
	return dispatch => {
		auth
			.signInWithPopup(provider)
			.then(result => {
				console.log('signing in provider result', result);
				localStorage.setItem('token', result.credential.accessToken);
				dispatch(loginSuccess(result));
			})
			.catch(error => dispatch(loginError(error)));
	};
}

// Catches and returns errors from login
export function loginError(error) {
	return {
		type: types.LOGIN_ERROR,
		payload: error
	};
}

// Catches and returns login success results
export function loginSuccess(result) {
	return {
		type: types.LOGIN_SUCCESS,
		payload: result.user
	};
}

// Creates a user via firebase only authenticator
export function createAccount(userInfo) {
	return dispatch => {
		auth
			.createUserWithEmailAndPassword(userInfo.email, userInfo.pw)
			.then(resp => {
				console.log('createAccount resp', resp);
				dispatch({
					type: types.REGISTER,
					uid: resp.uid
				});
			})
			.catch(error => {
				console.log('Error creating account', error.message, error.code);
				dispatch({
					type: types.REGISTER,
					payload: 'Error creating user'
				});
			});
	};
}

export function login({ email, password }) {
	return dispatch => {
		auth.signInWithEmailAndPassword(email, password).catch(error => {
			console.log('action creator signerror', error);
		});
		auth.currentUser.getIdToken(true).then(idToken => {
			localStorage.setItem('token', idToken);
			dispatch({
				type: types.LOGIN
			});
		});
	};
}

export function loginWithFacebook() {
	const provider = new firebase.auth.FacebookAuthProvider();
	provider.addScope('public_profile');
	return authenticate(provider);
}

// export function signInWithGoogle() {
// 	return authenticate(new firebase.auth.GoogleAuthProvider());
// }

// export function signInWithGithub() {
//   return authenticate(new firebase.auth.GithubAuthProvider());
// }

export function resetPassword(email) {
	return auth().sendPasswordResetEmail(email);
}

// Logs user out from firebase
export function logout() {
	return dispatch => {
		auth.signOut().then(() => {
			localStorage.removeItem('token');
			dispatch(logoutSuccess());
		});
	};
}

// Returns action of logout success
export function logoutSuccess() {
	return {
		type: types.LOGOUT_SUCCESS
	};
}
