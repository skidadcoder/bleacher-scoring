import firebase from "firebase";
import {
  UPDATE_EMAIL_ADDRESS_CHANGE,
  UPDATE_EMAIL_ADDRESS_START,
  UPDATE_EMAIL_ADDRESS_SUCCESS,
  UPDATE_EMAIL_ADDRESS_FAIL
} from "../reducers/types";

export const emailAddressChanged = text => {
  return {
    type: UPDATE_EMAIL_ADDRESS_CHANGE,
    payload: text
  };
};

export const updateEmailAddress = ({ emailAddress }) => {
  return dispatch => {
    dispatch({ type: UPDATE_EMAIL_ADDRESS_START });
    const user = firebase.auth().currentUser;
    return user
      .updateEmail(emailAddress)
      .then(() => {
        updateSuccess(dispatch);
      })
      .catch(error => {
        updateFail(dispatch, error);
      });
  };
};

//helper to clean up code
const updateFail = (dispatch, error) => {
  dispatch({ type: UPDATE_EMAIL_ADDRESS_FAIL, payload: error });
};

const updateSuccess = (dispatch) => {
  dispatch({ type: UPDATE_EMAIL_ADDRESS_SUCCESS });
};
