import {
  LOGIN_EMAIL_CHANGED,
  LOGIN_PASSWORD_CHANGED,
  LOGIN_USER_START,
  LOGIN_USER_FAIL,
  LOGIN_USER_SUCCESS,
  LOGOUT_USER_START,
  LOGOUT_USER_FAIL,
  LOGOUT_USER_SUCCESS
} from "./types";

const INITIAL_STATE = {
  email: "",
  password: "",
  error: "",
  isLoading: false,
  user: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOGIN_EMAIL_CHANGED:
      return { ...state, email: action.payload };
    case LOGIN_PASSWORD_CHANGED:
      return { ...state, password: action.payload };
    case LOGIN_USER_START:
      return { ...state, isLoading: true, error: "" };
    case LOGIN_USER_FAIL:
      return {
        ...state,
        error: "The username or password you have entered is incorrect. Please try again.",
        isLoading: false,
        password: "",
        user: null
      };
    case LOGIN_USER_SUCCESS:
      //return { ...state, ...INITIAL_STATE, user: action.payload };
      return { ...state, user: action.payload, isLoading: false, error: "" };
    case LOGOUT_USER_START:
      return { ...state };
    case LOGOUT_USER_FAIL:
      return { ...state };
    case LOGOUT_USER_SUCCESS:
      return INITIAL_STATE;
    default:
      return state;
  }
};
