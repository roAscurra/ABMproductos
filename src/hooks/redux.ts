import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "../redux/store"
import { RootState } from "@reduxjs/toolkit/query"

//Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState<any, any, any>>();
