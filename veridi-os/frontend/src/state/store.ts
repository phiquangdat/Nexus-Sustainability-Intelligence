import { configureStore } from "@reduxjs/toolkit";
import dataReducer from "./dataSlice";
import reportReducer from "./reportSlice";

// Configure the Redux store
export const store = configureStore({
  reducer: {
    data: dataReducer,
    report: reportReducer,
  },
  // Enable Redux DevTools in development
  devTools: import.meta.env.DEV,
  // Add middleware for better development experience
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serializable check
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export store
export default store;
