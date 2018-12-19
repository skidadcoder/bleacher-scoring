import { GAME_FETCH_START, GAME_FETCH_SUCCESS, GAME_FETCH_FAIL } from "./types";

const INITIAL_STATE = {
  data: {},
  gameFetchStarted: false,
  gameFetchSucceeded: false,
  gameFetchFailed: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GAME_FETCH_START:
      return {
        ...state,
        data: {},
        gameFetchStarted: true,
        gameFetchSucceeded: false,
        gameFetchFailed: false
      };
    case GAME_FETCH_SUCCESS:
      return {
        ...state,
        data: action.payload,
        gameFetchStarted: false,
        gameFetchSucceeded: true,
        gameFetchFailed: false
      };
    case GAME_FETCH_FAIL:
      return {
        ...state,
        data: {},
        gameFetchStarted: false,
        gameFetchSucceeded: false,
        gameFetchFailed: true
      };
    default:
      return state;
  }
};
