// store.js
import { configureStore,combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storageSession from 'redux-persist/lib/storage/session'; 
import stepsState from '../States/FormState';

const persistConfig = {
  key: 'root',
  version:1,
  storage: storageSession,
};

const rootReducer = combineReducers({
  formState:stepsState,
  // Other reducers...
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware:(getDefaultMiddleware)=>getDefaultMiddleware({
    immutableCheck:false,
    serializableCheck:false
  }),
  devTools: process.env.NODE_ENV === 'development',
});

export const persistor = persistStore(store);