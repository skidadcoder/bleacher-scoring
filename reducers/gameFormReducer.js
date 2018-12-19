import {
  GAME_FORM_PROP_CHANGE,
  GAME_PERSIST_START,
  GAME_PERSIST_SUCCESS,
  GAME_PERSIST_FAIL,
  GAME_FORM_RESET
} from "./types";

const INITIAL_STATE = {
  game: undefined,
  venueName: "",
  homeTeamName: "",
  awayTeamName: "",
  gameDate: Date.now(),
  gamePersistStarted: false,
  gamePersistFailed: false,
  gamePersistSucceeded: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GAME_FORM_PROP_CHANGE:
      return { ...state, [action.payload.prop]: action.payload.value };
    case GAME_PERSIST_START:
      return {
        ...state,
        gamePersistStarted: true,
        gamePersistFailed: false,
        gamePersistSucceeded: false
      };
    case GAME_PERSIST_SUCCESS:
      return {
        ...state,
        gamePersistStarted: false,
        gamePersistFailed: false,
        gamePersistSucceeded: true,
        game: action.payload
      };
    case GAME_PERSIST_FAIL:
      return {
        ...state,
        gamePersistStarted: false,
        gamePersistFailed: true,
        gamePersistSucceeded: false
      };
      return;
    case GAME_FORM_RESET:
      return INITIAL_STATE;
    default:
      return state;
  }
};
