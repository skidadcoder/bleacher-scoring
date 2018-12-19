import { AsyncStorage } from "react-native";
import { createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
//import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import ReduxThunk from "redux-thunk";
import reducers from "../reducers";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  //stateReconciler: autoMergeLevel2, // see "Merge Process" section for details.
  whitelist: ["savedGames"]
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = createStore(
  persistedReducer,
  {},
  applyMiddleware(ReduxThunk)
);
export const persistor = persistStore(store);
