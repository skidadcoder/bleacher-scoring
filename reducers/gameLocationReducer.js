import {
  GAME_LOCATION_PERSIST_START,
  GAME_LOCATION_PERSIST_SUCCESS,
  GAME_LOCATION_PERSIST_FAIL
} from "./types";

const INITIAL_STATE = {
  gameLocationPersistStarted: false,
  gameLocationPersistSucceeded: false,
  gameLocationPersistFailed: false,
  error: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GAME_LOCATION_PERSIST_START:
      return {
        ...state,
        gameLocationPersistStarted: true,
        gameLocationPersistSucceeded: false,
        gameLocationPersistFailed: false,
        error: null
      };
    case GAME_LOCATION_PERSIST_SUCCESS:
      return {
        ...state,
        gameLocationPersistStarted: false,
        gameLocationPersistSucceeded: true,
        gameLocationPersistFailed: false,
        error: null
      };
    case GAME_LOCATION_PERSIST_FAIL:
      return {
        ...state,
        gameLocationPersistStarted: false,
        gameLocationPersistSucceeded: false,
        gameLocationPersistFailed: true,
        error: payload.error
      };
    default:
      return state;
  }
};
