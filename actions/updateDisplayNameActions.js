import firebase from "firebase";
import {
  UPDATE_DISPLAY_NAME_CHANGE,
  UPDATE_DISPLAY_NAME_START,
  UPDATE_DISPLAY_NAME_SUCCESS,
  UPDATE_DISPLAY_NAME_FAIL
} from "../reducers/types";

export const displayNameChanged = text => {
  return {
    type: UPDATE_DISPLAY_NAME_CHANGE,
    payload: text
  };
};

export const updateDisplayName = ({ displayName }) => {
  return dispatch => {
    dispatch({ type: UPDATE_DISPLAY_NAME_START });
    const user = firebase.auth().currentUser;
    return user
      .updateProfile({ displayName })
      .then(() => {
        updateSuccess(dispatch);
      })
      .catch(error => {
        console.log(error);
        updateFail(dispatch, error);
      });
  };
};

//helper to clean up code
const updateFail = (dispatch, error) => {
  dispatch({ type: UPDATE_DISPLAY_NAME_FAIL, payload: error });
};

const updateSuccess = dispatch => {
  dispatch({ type: UPDATE_DISPLAY_NAME_SUCCESS });
};
