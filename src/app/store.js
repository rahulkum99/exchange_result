import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import { authApi } from '../features/auth/authAPI';
import { cricketApi } from '../features/cricket/cricketAPI';
import { soccerApi } from '../features/soccer/soccerAPI';
import { tennisApi } from '../features/tennis/tennisAPI';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [cricketApi.reducerPath]: cricketApi.reducer,
    [soccerApi.reducerPath]: soccerApi.reducer,
    [tennisApi.reducerPath]: tennisApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      cricketApi.middleware,
      soccerApi.middleware,
      tennisApi.middleware,
    ),
});

