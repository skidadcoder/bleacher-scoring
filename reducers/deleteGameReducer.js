import {
  GAME_DELETE_START,
  GAME_DELETE_SUCCESS,
  GAME_DELETE_FAIL
} from "./types";

const INITIAL_STATE = {
  gameDeleteStarted: false,
  gameDeleteSucceeded: false,
  gameDeleteFailed: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GAME_DELETE_START:
      return {
        ...state,
        gameDeleteStarted: true,
        gameDeleteSucceeded: false,
        gameDeleteFailed: false
      };
    case GAME_DELETE_SUCCESS:
      return {
        ...state,
        gameDeleteStarted: false,
        gameDeleteSucceeded: true,
        gameDeleteFailed: false
      };
    case GAME_DELETE_FAIL:
      return {
        ...state,
        gameDeleteStarted: false,
        gameDeleteSucceeded: false,
        gameDeleteFailed: true
      };
    default:
      return state;
  }
};
