import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import ICategoria from '../../types/ICategoria';


interface IInitialState {
  categoria: ICategoria[];
}

const initialState: IInitialState = {
  categoria: [],
}

export const categoriaSlice = createSlice({
  name: 'categoriaState',
  initialState,
  reducers: {
    setCategoria: (state, action: PayloadAction<ICategoria[]>) => {
      state.categoria = action.payload;
    },
    resetCategoria: (state) => {
      state.categoria = [];
    }
  },
})

export const { setCategoria, resetCategoria } = categoriaSlice.actions;

export default categoriaSlice.reducer;