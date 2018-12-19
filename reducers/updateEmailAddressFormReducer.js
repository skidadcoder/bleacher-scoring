import {
  UPDATE_EMAIL_ADDRESS_CHANGE,
  UPDATE_EMAIL_ADDRESS_START,
  UPDATE_EMAIL_ADDRESS_SUCCESS,
  UPDATE_EMAIL_ADDRESS_FAIL
} from "./types";

const INITIAL_STATE = {
  emailAddress: "",
  changeEmailAddressStarted: false,
  changeEmailAddressSucceeded: false,
  changeEmailAddressFailed: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_EMAIL_ADDRESS_CHANGE:
      return {
        ...state,
        emailAddress: action.payload,
        changeEmailAddressStarted: false,
        changeEmailAddressSucceeded: false,
        changeEmailAddressFailed: false
      };
    case UPDATE_EMAIL_ADDRESS_START:
      return {
        ...state,
        changeEmailAddressStarted: true,
        changeEmailAddressSucceeded: false,
        changeEmailAddressFailed: false
      };
    case UPDATE_EMAIL_ADDRESS_SUCCESS:
      return {
        ...state,
        changeEmailAddressStarted: false,
        changeEmailAddressSucceeded: true,
        changeEmailAddressFailed: false
      };
    case UPDATE_EMAIL_ADDRESS_FAIL:
      return {
        ...state,
        changeEmailAddressStarted: false,
        changeEmailAddressSucceeded: false,
        changeEmailAddressFailed: true
      };
    default:
      return state;
  }
};
