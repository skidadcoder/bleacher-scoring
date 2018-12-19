import {
  UPDATE_DISPLAY_NAME_CHANGE,
  UPDATE_DISPLAY_NAME_START,
  UPDATE_DISPLAY_NAME_SUCCESS,
  UPDATE_DISPLAY_NAME_FAIL
} from "./types";

const INITIAL_STATE = {
  displayName: "",
  changeDisplayNameStarted: false,
  changeDisplayNameSucceeded: false,
  changeDisplayNameFailed: false,
  error: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_DISPLAY_NAME_CHANGE:
      return {
        ...state,
        displayName: action.payload,
        changeDisplayNameStarted: false,
        changeDisplayNameSucceeded: false,
        changeDisplayNameFailed: false,
        error: null,
      };
    case UPDATE_DISPLAY_NAME_START:
      return {
        ...state,
        changeDisplayNameStarted: true,
        changeDisplayNameSucceeded: false,
        changeDisplayNameFailed: false,
        error: null
      };
    case UPDATE_DISPLAY_NAME_SUCCESS:
      return {
        ...state,
        changeDisplayNameStarted: false,
        changeDisplayNameSucceeded: true,
        changeDisplayNameFailed: false,
        error: null
      };
    case UPDATE_DISPLAY_NAME_FAIL:
      return {
        ...state,
        changeDisplayNameStarted: false,
        changeDisplayNameSucceeded: false,
        changeDisplayNameFailed: true,
        error: action.payload
      };
    default:
      return state;
  }
};
