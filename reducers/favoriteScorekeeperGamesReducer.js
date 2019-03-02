import { FAVORITE_SCOREKEEPER_GAMES_FETCH_START, FAVORITE_SCOREKEEPER_GAMES_FETCH_SUCCESS } from "./types";

const INITIAL_STATE = {
  data: {},
  favoriteScorekeeperGamesFetchStarted: true
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FAVORITE_SCOREKEEPER_GAMES_FETCH_START:
      return { ...state, data: {}, favoriteScorekeeperGamesFetchStarted: true };
    case FAVORITE_SCOREKEEPER_GAMES_FETCH_SUCCESS:
      return { ...state, data: { ...state.data, ...action.payload }, favoriteScorekeeperGamesFetchStarted: false };
    default:
      return state;
  }
}
