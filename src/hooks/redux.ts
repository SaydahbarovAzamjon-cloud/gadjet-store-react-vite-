import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";

// Bu hooklar har doim shu typed versiyalarini ishlatish uchun
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector(selector);
