import { NEARBY_GAMES_FETCH_START, NEARBY_GAMES_FETCH_SUCCESS } from "./types";

const INITIAL_STATE = {
  data: {},
  nearbyGameFetchStarted: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case NEARBY_GAMES_FETCH_START:
      return {
        ...state,
        data: {},
        nearbyGameFetchStarted: true
      };
    case NEARBY_GAMES_FETCH_SUCCESS:
      return {
        ...state,
        data: action.payload,
        nearbyGameFetchStarted: false
      };
    default:
      return state;
  }
};
