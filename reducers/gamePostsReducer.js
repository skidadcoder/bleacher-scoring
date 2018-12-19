import { GAME_POSTS_FETCH_FAIL, GAME_POSTS_FETCH_SUCCESS } from "./types";

const INITIAL_STATE = {
  data: {},
  gamePostsFetchSucceeded: false,
  gamePostsFetchFailed: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GAME_POSTS_FETCH_FAIL:
      return {
        ...state,
        data: {},
        gamePostsFetchSucceeded: false,
        gamePostsFetchFailed: true
      };
    case GAME_POSTS_FETCH_SUCCESS:
      return {
        ...state,
        data: action.payload,
        gamePostsFetchSucceeded: true,
        gamePostsFetchFailed: false
      };
    default:
      return state;
  }
};
