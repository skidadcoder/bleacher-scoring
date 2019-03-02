import _ from "lodash";
import { ADD_SAVED_GAME, REMOVE_SAVED_GAME } from "./types";

const INITIAL_STATE = [];

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_SAVED_GAME:
      return [...state, action.payload];
      //return [];
    case REMOVE_SAVED_GAME:
      return state.filter(g => g.gameUid !== action.payload);
      //return [];
    default:
      return state;
  }
};
