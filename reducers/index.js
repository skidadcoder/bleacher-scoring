import { combineReducers } from "redux";
import authReducer from "./authReducer";
import gameReducer from "./gameReducer";
import gameFormReducer from "./gameFormReducer";
import gameScoreReducer from "./gameScoreReducer";
import userGamesReducer from "./userGamesReducer";
import savedGamesReducer from "./savedGamesReducer";
import savedScorekeepersReducer from "./savedScorekeepersReducer";
import favoriteGamesReducer from "./favoriteGamesReducer";
import favoriteScorekeeperGamesReducer from "./favoriteScorekeeperGamesReducer";
import nearbyGamesReducer from "./nearbyGamesReducer";
import selectedGameReducer from "./selectedGameReducer";
import gameSearchResultsReducer from "./gameSearchResultsReducer";
import signUpReducer from "./signUpReducer";
import gamePostReducer from "./gamePostReducer";
import gameSetReducer from "./gameSetReducer";
import deleteGameReducer from "./deleteGameReducer";
import gamePostsReducer from "./gamePostsReducer";
import updateDisplayNameFormReducer from "./updateDisplayNameFormReducer";
import updateEmailAddressFormReducer from "./updateEmailAddressFormReducer";
import gameLocationReducer from "./gameLocationReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  signUp: signUpReducer,
  gameForm: gameFormReducer,
  gameScore: gameScoreReducer,
  deleteGame: deleteGameReducer,
  gamePost: gamePostReducer,
  gameLocation: gameLocationReducer,
  gamePosts: gamePostsReducer,
  gameSet: gameSetReducer,
  gameSearchResults: gameSearchResultsReducer,
  selectedGame: selectedGameReducer,
  userGames: userGamesReducer,
  savedGames: savedGamesReducer,
  savedScorekeepers: savedScorekeepersReducer,
  nearbyGames: nearbyGamesReducer,
  favoriteGames: favoriteGamesReducer,
  favoriteScorekeeperGames: favoriteScorekeeperGamesReducer,
  game: gameReducer,
  updateDisplayNameForm: updateDisplayNameFormReducer,
  updateEmailAddressForm: updateEmailAddressFormReducer
});

export default rootReducer;
