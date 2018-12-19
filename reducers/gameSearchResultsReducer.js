import { GAME_SEARCH_FETCH_SUCCESS } from "./types";

const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GAME_SEARCH_FETCH_SUCCESS:
      return action.payload;
    default:
      return state;
  }
};
