import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./index";

export const useAppDispatch = () => useDispatch<AppDispatch>(); // useAppDispatch is a type for dispatch which is used so that typescript recognies the dispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
// This tells TypeScript The state inside selectors is of type RootState.
