import {
  SIGN_UP_DISPLAY_NAME_CHANGED,
  SIGN_UP_EMAIL_CHANGED,
  SIGN_UP_PASSWORD_CHANGED,
  SIGN_UP_CONFIRM_PASSWORD_CHANGED,
  SIGN_UP_START,
  SIGN_UP_FAIL,
  SIGN_UP_SUCCESS
} from "./types";

const INITIAL_STATE = {
  displayName: "",
  email: "",
  password: "",
  confirmPassword: "",
  error: "",
  isLoading: false,
  isSuccess: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SIGN_UP_DISPLAY_NAME_CHANGED:
      return { ...state, displayName: action.payload };
    case SIGN_UP_EMAIL_CHANGED:
      return { ...state, email: action.payload };
    case SIGN_UP_PASSWORD_CHANGED:
      return { ...state, password: action.payload };
    case SIGN_UP_CONFIRM_PASSWORD_CHANGED:
      return { ...state, confirmPassword: action.payload };
    case SIGN_UP_START:
      return { ...state, isLoading: true, error: "" };
    case SIGN_UP_FAIL:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        password: "",
        confirmPassword: "",
        isSuccess: false
      };
    case SIGN_UP_SUCCESS:
      return {
        ...state,
        displayName: "",
        email: "",
        password: "",
        confirmPassword: "",
        error: "",
        isLoading: false,
        isSuccess: true
      };
    default:
      return state;
  }
};
