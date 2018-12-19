import { GAME_SCORE_PERSIST_START, GAME_SCORE_PERSIST_SUCCESS } from "./types";

const INITIAL_STATE = {
  gameScorePersistStarted: false,
  gameScorePersistSucceeded: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GAME_SCORE_PERSIST_START:
      return {
        ...state,
        gameScorePersistStarted: true,
        gameScorePersistSucceeded: false
      };
    case GAME_SCORE_PERSIST_SUCCESS:
      return {
        ...state,
        gameScorePersistStarted: false,
        gameScorePersistSucceeded: true
      };
    default:
      return state;
  }
};
