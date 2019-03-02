import _ from "lodash";
import { ADD_SAVED_SCOREKEEPER, REMOVE_SAVED_SCOREKEEPER } from "./types";

const INITIAL_STATE = [];

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_SAVED_SCOREKEEPER:
      let index = state.findIndex(s => s.userId === action.payload.userId)
      if (index === -1) {
        return [...state, action.payload];
      }
      return state;
    case REMOVE_SAVED_SCOREKEEPER:
      return state.filter(s => s.userId !== action.payload);
    default:
      return state;
  }
};
