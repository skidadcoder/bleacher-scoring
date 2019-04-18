import _ from "lodash";
import moment from "moment";
import firebase from "firebase";
import g from "ngeohash";
import {
  FAVORITE_GAMES_FETCH_START,
  FAVORITE_GAMES_FETCH_SUCCESS,
  FAVORITE_SCOREKEEPER_GAMES_FETCH_START,
  FAVORITE_SCOREKEEPER_GAMES_FETCH_SUCCESS,
  USER_GAMES_CLEAR,
  USER_GAMES_FETCH_START,
  USER_GAMES_FETCH_SUCCESS,
  NEARBY_GAMES_FETCH_START,
  NEARBY_GAMES_FETCH_SUCCESS,
  NEARBY_GAMES_FETCH_FAIL,
  GAME_FORM_PROP_CHANGE,
  GAME_FORM_RESET,
  GAME_PERSIST_START,
  GAME_PERSIST_FAIL,
  GAME_PERSIST_SUCCESS,
  GAME_FETCH_START,
  GAME_FETCH_SUCCESS,
  GAME_FETCH_FAIL,
  GAME_POSTS_FETCH_SUCCESS,
  GAME_SELECTED,
  GAME_DELETE_START,
  GAME_DELETE_SUCCESS,
  GAME_DELETE_FAIL,
  GAME_SCORE_PERSIST_START,
  GAME_SCORE_PERSIST_SUCCESS,
  GAME_SCORE_PERSIST_FAIL,
  GAME_POST_PERSIST_START,
  GAME_POST_PERSIST_SUCCESS,
  GAME_POST_PERSIST_FAIL,
  GAME_LOCATION_PERSIST_START,
  GAME_LOCATION_PERSIST_SUCCESS,
  GAME_LOCATION_PERSIST_FAIL,
  GAME_SET_PERSIST_START,
  GAME_SET_PERSIST_SUCCESS,
  GAME_SET_PERSIST_FAIL,
  ADD_SAVED_GAME,
  REMOVE_SAVED_GAME,
  ADD_SAVED_SCOREKEEPER,
  REMOVE_SAVED_SCOREKEEPER
} from "../reducers/types";

export const gamePropChange = ({ prop, value }) => {
  return {
    type: GAME_FORM_PROP_CHANGE,
    payload: { prop, value }
  };
};

export const createGame = ({ venueName, homeTeamName, awayTeamName }) => {
  const { currentUser } = firebase.auth();
  const { uid, displayName } = currentUser;
  const currentSet = 1;
  const sets = {
    "1": { homeTeamScore: "0", awayTeamScore: "0" },
    "2": { homeTeamScore: "0", awayTeamScore: "0" },
    "3": { homeTeamScore: "0", awayTeamScore: "0" },
    "4": { homeTeamScore: "0", awayTeamScore: "0" },
    "5": { homeTeamScore: "0", awayTeamScore: "0" }
  };

  venueName = venueName.length < 1 ? "Venue" : venueName;
  homeTeamName = homeTeamName.length < 1 ? "Home Team" : homeTeamName;
  awayTeamName = awayTeamName.length < 1 ? "Away Team" : awayTeamName;
  geoIndex = "000000_" + new Date().getTime();

  const date = new Date();
  const gameDate = date;
  const lastUpdate = date;

  return dispatch => {
    dispatch({ type: GAME_PERSIST_START });

    const games = firebase.database().ref(`/users/${currentUser.uid}/games`);
    const newGameUid = games.push().key;
    const game = {
      displayName,
      userId: uid,
      venueName,
      gameDate,
      lastUpdate,
      geoIndex,
      homeTeamName,
      awayTeamName,
      currentSet,
      sets
    };

    const newGame = {};
    newGame[`/games/${newGameUid}`] = game;

    firebase
      .database()
      .ref()
      .update(newGame)
      .then(() =>
        dispatch({
          type: GAME_PERSIST_SUCCESS,
          payload: { gameUid: newGameUid, venueName, gameDate, homeTeamName, awayTeamName }
        })
      )
      .catch(() => dispatch({ type: GAME_PERSIST_FAIL }));
  };
};

export const updateGame = ({ gameUid, venueName, homeTeamName, awayTeamName }) => {
  venueName = venueName.length < 1 ? "Venue" : venueName;
  homeTeamName = homeTeamName.length < 1 ? "Home Team" : homeTeamName;
  awayTeamName = awayTeamName.length < 1 ? "Away Team" : awayTeamName;

  const date = new Date();
  const lastUpdate = date;

  return dispatch => {
    dispatch({ type: GAME_PERSIST_START });

    let updateGame = {};
    updateGame[`/games/${gameUid}/venueName`] = venueName;
    updateGame[`/games/${gameUid}/homeTeamName`] = homeTeamName;
    updateGame[`/games/${gameUid}/awayTeamName`] = awayTeamName;
    updateGame[`/games/${gameUid}/lastUpdate`] = lastUpdate;

    firebase
      .database()
      .ref()
      .update(updateGame)
      .then(() => dispatch({ type: GAME_PERSIST_SUCCESS }))
      .catch(() => dispatch({ type: GAME_PERSIST_FAIL }));
  };
};

export const deleteGame = ({ gameUid }) => {
  return dispatch => {
    dispatch({ type: GAME_DELETE_START });

    let deletedGame = {};
    deletedGame[`/games/${gameUid}`] = null;
    deletedGame[`/gamePosts/${gameUid}`] = null;

    firebase
      .database()
      .ref()
      .update(deletedGame)
      .then(() => dispatch({ type: GAME_DELETE_SUCCESS }))
      .catch(() => dispatch({ type: GAME_DELETE_FAIL }));
  };
};

export const updateGameLocation = ({ gameUid, location }) => {
  const { lat, lng } = location.location;
  const geoHash = location ? g.encode_int(lat, lng, 18) : 0;
  const geoIndex = geoHash + "_" + new Date().getTime();
  const date = new Date();
  const lastUpdate = date;

  return dispatch => {
    dispatch({ type: GAME_LOCATION_PERSIST_START });

    let updateGame = {};
    updateGame[`/games/${gameUid}/address`] = location.address;
    updateGame[`/games/${gameUid}/lastUpdate`] = lastUpdate;
    updateGame[`/games/${gameUid}/geoIndex`] = geoIndex;

    firebase
      .database()
      .ref()
      .update(updateGame)
      .then(() => dispatch({ type: GAME_LOCATION_PERSIST_SUCCESS }))
      .catch(() => dispatch({ type: GAME_LOCATION_PERSIST_FAIL }));
  };
};

export const createGamePost = ({ gameUid, body, image }) => {
  const postUid = firebase
    .database()
    .ref(`/gamePosts/${gameUid}/posts`)
    .push().key;

  return _persistGamePost({ gameUid, postUid, body, imageUri: null, image });
};

export const updateGamePost = ({ gameUid, postUid, body, imageUri, image }) => {
  return _persistGamePost({ gameUid, postUid, body, imageUri, image });
};

_persistGamePost = ({ gameUid, postUid, body, imageUri, image }) => {
  const { currentUser } = firebase.auth();
  let author = currentUser.displayName;

  let postData = {
    author,
    avatarURL: currentUser.photoURL,
    body,
    imageUri: imageUri || "",
    postDate: new Date(),
    userId: currentUser.uid
  };

  let postRef = {};
  postRef[`/gamePosts/${gameUid}/posts/${postUid}`] = postData;

  const storageRef = firebase
    .storage()
    .ref()
    .child(postUid);

  return dispatch => {
    dispatch({ type: GAME_POST_PERSIST_START });

    firebase
      .database()
      .ref()
      .update(postRef)
      .then(() => {
        //new image
        if (image) {
          return storageRef
            .put(image)
            .then(() => {
              return storageRef.getDownloadURL();
            })
            .then(results => {
              let postUpdateWithImageRef = {};
              postUpdateWithImageRef[`/gamePosts/${gameUid}/posts/${postUid}/imageUri`] = results;
              return firebase
                .database()
                .ref()
                .update(postUpdateWithImageRef);
            });
        } else {
          //existing image to be left alone or deleted
          storageRef.getDownloadURL().then(
            () => {
              if (!imageUri) {
                return storageRef.delete();
              } else {
                return Promise.resolve();
              }
            },
            error => {
              //no image exists for post ref so just move on
              return Promise.resolve();
            }
          );
        }
      })
      .then(() => dispatch({ type: GAME_POST_PERSIST_SUCCESS }))
      .catch(function (error) {
        console.log(error);
        dispatch({ type: GAME_POST_PERSIST_FAIL });
      });
  };
};

export const deleteGamePost = ({ gameUid, postUid }) => {
  return dispatch => {
    dispatch({ type: GAME_POST_PERSIST_START });

    let deletedGamePost = {};
    deletedGamePost[`/gamePosts/${gameUid}/posts/${postUid}`] = null;

    firebase
      .database()
      .ref()
      .update(deletedGamePost)
      .then(() => {
        let storageRef = firebase
          .storage()
          .ref()
          .child(postUid);

        return storageRef.delete();
      })
      .then(() => dispatch({ type: GAME_POST_PERSIST_SUCCESS }))
      .catch(() => dispatch({ type: GAME_POST_PERSIST_FAIL }));
  };
};

export const updateGameScore = ({ gameUid, isHome, currentSet, newScore }) => {
  let updateGame = {};

  const date = new Date();
  const lastUpdate = date;

  updateGame[`/games/${gameUid}/lastUpdate`] = lastUpdate;

  if (isHome) {
    updateGame[`/games/${gameUid}/sets/${currentSet}/homeTeamScore`] = newScore;
  } else {
    updateGame[`/games/${gameUid}/sets/${currentSet}/awayTeamScore`] = newScore;
  }

  return dispatch => {
    dispatch({ type: GAME_SCORE_PERSIST_START });
    firebase
      .database()
      .ref()
      .update(updateGame, function (error) {
        if (error) {
          console.log(error);
        }
      });
  };
};

export const updateCurrentSet = ({ gameUid, currentSet }) => {
  const { currentUser } = firebase.auth();

  const date = new Date();
  const lastUpdate = date;

  let updateGame = {};

  updateGame[`/games/${gameUid}/currentSet`] = currentSet;
  updateGame[`/games/${gameUid}/lastUpdate`] = lastUpdate;

  return dispatch => {
    dispatch({ type: GAME_SET_PERSIST_START });
    firebase
      .database()
      .ref()
      .update(updateGame)
      .then(() => dispatch({ type: GAME_SET_PERSIST_SUCCESS }))
      .catch(() => dispatch({ type: GAME_SET_PERSIST_FAIL }));
  };
};

export const fetchUserGames = () => {
  const { currentUser } = firebase.auth();

  return dispatch => {
    dispatch({ type: USER_GAMES_FETCH_START });
    firebase
      .database()
      .ref(`/games`)
      .orderByChild("userId")
      .equalTo(currentUser.uid)
      .once(
        "value",
        snapshot => {
          dispatch({ type: USER_GAMES_FETCH_SUCCESS, payload: snapshot.val() });
        },
        error => {
          console.error(error);
        }
      );
  };
};

export const fetchNearbyGames = location => {
  let geoHash = 0;
  let radius = 18;
  const { lat, lng } = location;
  geoHash = location ? g.encode_int(lat, lng, radius) : 0;

  //don't need boxing anymore, but keep for reference.
  // const loGeo = g.neighbor_int(geoHash, [-1, -1], radius);
  // const hiGeo = g.neighbor_int(geoHash, [1, 1], radius);

  const loTimestamp = moment()
    .subtract(14, "days")
    .toDate()
    .getTime();
  const hiTimestamp = new Date().getTime();

  const loFilter = geoHash + "_" + loTimestamp;
  const hiFilter = geoHash + "_" + hiTimestamp;

  const db = firebase.database().ref();
  const games = db.child("/games");

  return dispatch => {
    dispatch({ type: NEARBY_GAMES_FETCH_START });
    games
      .orderByChild("geoIndex")
      .startAt(loFilter)
      .endAt(hiFilter)
      .limitToLast(100)
      .once(
        "value",
        snapshot => {
          dispatch({
            type: NEARBY_GAMES_FETCH_SUCCESS,
            payload: snapshot.val()
          });
        },
        error => {
          console.error(error);
          dispatch({ type: NEARBY_GAMES_FETCH_FAIL, payload: error });
        }
      );
  };
};

export const fetchFavoriteGames = gameUids => {
  const db = firebase.database().ref("/games");

  return dispatch => {
    dispatch({ type: FAVORITE_GAMES_FETCH_START });

    if (gameUids.length === 0) {
      dispatch({ type: FAVORITE_GAMES_FETCH_SUCCESS, payload: [] });
    } else {
      Promise.all(
        gameUids.map(gameUid => {
          return db
            .orderByKey()
            .equalTo(gameUid)
            .on(
              "value",
              snapshot => {
                if (!snapshot.val()) {
                  dispatch({ type: REMOVE_SAVED_GAME, payload: gameUid }); //remove from favorites if game is deleted
                } else {
                  dispatch({ type: FAVORITE_GAMES_FETCH_SUCCESS, payload: snapshot.val() });
                }
              },
              error => {
                console.error(error);
              }
            );
        })
      );
    }
  };
};

export const fetchFavoriteScorekeeperGames = scorekeeperIds => {
  const db = firebase.database().ref("/games");

  return dispatch => {
    dispatch({ type: FAVORITE_SCOREKEEPER_GAMES_FETCH_START });

    if (scorekeeperIds.length === 0) {
      dispatch({ type: FAVORITE_SCOREKEEPER_GAMES_FETCH_SUCCESS, payload: [] });
    } else {
      Promise.all(
        scorekeeperIds.map(scorekeeperId => {
          return db
            .orderByChild("userId")
            .equalTo(scorekeeperId)
            .on(
              "value",
              snapshot => {
                dispatch({ type: FAVORITE_SCOREKEEPER_GAMES_FETCH_SUCCESS, payload: snapshot.val() });
              },
              error => {
                console.error(error);
              }
            );
        })
      );
    }
  };
};

export const fetchGameById = ({ gameUid }) => {
  return dispatch => {
    dispatch({ type: GAME_FETCH_START });

    //sleep(5000).then(() => {
    firebase
      .database()
      .ref(`/games/${gameUid}`)
      .on(
        "value",
        snapshot => {
          dispatch({ type: GAME_FETCH_SUCCESS, payload: snapshot.val() });
        },
        error => {
          console.error(error);
          dispatch({ type: GAME_FETCH_FAIL, payload: error });
        }
      );
    //});
  };
};

export const fetchGamePostsById = ({ gameUid }) => {
  return dispatch => {
    firebase
      .database()
      .ref(`/gamePosts/${gameUid}`)
      .on(
        "value",
        snapshot => {
          dispatch({ type: GAME_POSTS_FETCH_SUCCESS, payload: snapshot.val() });
        },
        error => {
          console.error(error);
          dispatch({ type: GAME_POSTS_FETCH_SUCCESS, payload: error });
        }
      );
  };
};

export const resetGameForm = () => {
  return {
    type: GAME_FORM_RESET
  };
};

export const selectGame = ({ game }) => {
  return {
    type: GAME_SELECTED,
    payload: game
  };
};

export const saveGame = ({ game }) => {
  return {
    type: ADD_SAVED_GAME,
    payload: game
  };
};

export const unSaveGame = ({ gameUid }) => {
  return {
    type: REMOVE_SAVED_GAME,
    payload: gameUid
  };
};

export const saveScorekeeper = ({ scorekeeper }) => {
  return {
    type: ADD_SAVED_SCOREKEEPER,
    payload: scorekeeper
  }
}

export const unSaveScorekeeper = ({ userId }) => {
  return {
    type: REMOVE_SAVED_SCOREKEEPER,
    payload: userId
  }
}

const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};
