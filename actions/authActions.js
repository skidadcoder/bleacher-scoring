import firebase from "firebase";
import {
  LOGIN_EMAIL_CHANGED,
  LOGIN_PASSWORD_CHANGED,
  LOGIN_USER_START,
  LOGIN_USER_FAIL,
  LOGIN_USER_SUCCESS,
  LOGOUT_USER_START,
  LOGOUT_USER_FAIL,
  LOGOUT_USER_SUCCESS
} from "../reducers/types";

export const emailChanged = text => {
  return {
    type: LOGIN_EMAIL_CHANGED,
    payload: text
  };
};

export const passwordChanged = text => {
  return {
    type: LOGIN_PASSWORD_CHANGED,
    payload: text
  };
};

export const displayNameChanged = text => {
  return {
    type: DISPLAY_NAME_CHANGED,
    payload: text
  };
};

export const loginUserWithFacebook = ({ token }) => {
  return dispatch => {
    dispatch({ type: LOGIN_USER_START });
    const credential = firebase.auth.FacebookAuthProvider.credential(token);
    firebase
      .auth()
      .signInAndRetrieveDataWithCredential(credential)
      .then(user => loginUserSuccess(dispatch, user))
      .catch(error => loginUserFail(dispatch, error));
  };
};

export const logInUser = ({ email, password }) => {
  return dispatch => {
    dispatch({ type: LOGIN_USER_START });
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(user => loginUserSuccess(dispatch, user))
      .catch(error => loginUserFail(dispatch, error));
  };
};

export const logOutUser = () => {
  return dispatch => {
    dispatch({ type: LOGOUT_USER_START });
    firebase
      .auth()
      .signOut()
      .then(() => logOutUserSuccess(dispatch))
      .catch(error => logOutUserFail(dispatch, error));
  };
};

//helper to clean up code
const loginUserFail = (dispatch, error) => {
  dispatch({ type: LOGIN_USER_FAIL, payload: error });
};

const loginUserSuccess = (dispatch, user) => {
  dispatch({ type: LOGIN_USER_SUCCESS, payload: user });
};

const logOutUserFail = (dispatch, error) => {
  dispatch({ type: LOGOUT_USER_FAIL, payload: error });
};

const logOutUserSuccess = dispatch => {
  dispatch({ type: LOGOUT_USER_SUCCESS });
};
