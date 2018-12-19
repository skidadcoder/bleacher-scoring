import {
  GAME_POST_PERSIST_START,
  GAME_POST_PERSIST_SUCCESS,
  GAME_POST_PERSIST_FAIL
} from "./types";

const INITIAL_STATE = {
  gamePostPersistStarted: false,
  gamePostPersistSucceeded: false,
  gamePostPersistFailed: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GAME_POST_PERSIST_START:
      return {
        ...state,
        gamePostPersistStarted: true,
        gamePostPersistSucceeded: false,
        gamePostPersistFailed: false,
      };
    case GAME_POST_PERSIST_SUCCESS:
      return {
        ...state,
        gamePostPersistStarted: false,
        gamePostPersistSucceeded: true,
        gamePostPersistFailed: false,
      };
    case GAME_POST_PERSIST_FAIL:
      return {
        ...state,
        gamePostPersistStarted: false,
        gamePostPersistSucceeded: false,
        gamePostPersistFailed: true,
      };
    default:
      return state;
  }
};
