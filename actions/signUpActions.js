import firebase from "firebase";
import {
  SIGN_UP_DISPLAY_NAME_CHANGED,
  SIGN_UP_EMAIL_CHANGED,
  SIGN_UP_PASSWORD_CHANGED,
  SIGN_UP_CONFIRM_PASSWORD_CHANGED,
  SIGN_UP_START,
  SIGN_UP_FAIL,
  SIGN_UP_SUCCESS
} from "../reducers/types";

export const displayNameChanged = text => {
  return {
    type: SIGN_UP_DISPLAY_NAME_CHANGED,
    payload: text
  };
};

export const emailChanged = text => {
  return {
    type: SIGN_UP_EMAIL_CHANGED,
    payload: text
  };
};

export const passwordChanged = text => {
  return {
    type: SIGN_UP_PASSWORD_CHANGED,
    payload: text
  };
};

export const confirmPasswordChanged = text => {
  return {
    type: SIGN_UP_CONFIRM_PASSWORD_CHANGED,
    payload: text
  };
};

export const signUpUser = ({ email, password, displayName }) => {
  return dispatch => {
    dispatch({ type: SIGN_UP_START });
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        const user = firebase.auth().currentUser;
        user
          .updateProfile({ displayName })
          .then(() => signUpSuccess(dispatch, user))
          .catch(error => signUpFail(dispatch, error.message));
      })
      .catch(error => {
        signUpFail(dispatch, error.message);
      });
  };
};

//helper to clean up code
const signUpFail = (dispatch, error) => {
  dispatch({ type: SIGN_UP_FAIL, payload: error });
};

const signUpSuccess = (dispatch, user) => {
  dispatch({ type: SIGN_UP_SUCCESS, payload: user });
};
