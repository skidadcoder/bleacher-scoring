import { FAVORITE_GAME_FETCH_SUCCESS, FAVORITE_GAMES_FETCH_START, FAVORITE_GAMES_FETCH_SUCCESS } from "./types";

const INITIAL_STATE = {
  data: {},
  favoriteGamesFetchStarted: true
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FAVORITE_GAMES_FETCH_START:
      return { ...state, data: {}, favoriteGamesFetchStarted: true };
    case FAVORITE_GAMES_FETCH_SUCCESS:
      return { ...state, data: { ...state.data, ...action.payload }, favoriteGamesFetchStarted: false };
    default:
      return state;
  }
};
