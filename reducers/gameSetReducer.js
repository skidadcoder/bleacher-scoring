import {
  GAME_SET_PERSIST_START,
  GAME_SET_PERSIST_SUCCESS,
  GAME_SET_PERSIST_FAIL
} from "./types";

const INITIAL_STATE = {
  gameSetPersistStarted: false,
  gameSetPersistSucceeded: false,
  gameSetPersistFailed: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GAME_SET_PERSIST_START:
      return {
        ...state,
        gameSetPersistStarted: true,
        gameSetPersistSucceeded: false,
        gameSetPersistFailed: false
      };
    case GAME_SET_PERSIST_SUCCESS:
      return {
        ...state,
        gameSetPersistStarted: false,
        gameSetPersistSucceeded: true,
        gameSetPersistFailed: false
      };
    case GAME_SET_PERSIST_FAIL:
      return {
        ...state,
        gameSetPersistStarted: false,
        gameSetPersistSucceeded: false,
        gameSetPersistFailed: true
      };
    default:
      return state;
  }
};
