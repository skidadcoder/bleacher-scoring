import { GAME_SELECTED } from "./types";

const INITIAL_STATE = {
  gameUid: ""
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GAME_SELECTED:
      return { ...state, gameUid: action.payload.gameUid };
    default:
      return state;
  }
};
