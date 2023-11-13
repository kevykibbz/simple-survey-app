import { createSlice } from "@reduxjs/toolkit";

const stepsState = createSlice({
  name: "formState",
  initialState: {
    stepState:1,
    percentage:16.6667,
    usersData:null
  },
  reducers: {
    setFormState: (state, action) => {
      state.stepState = action.payload;
    }, 
    setPercentage: (state, action) => {
      state.percentage = action.payload;
    },
    updateUsersData:(state,action)=>{
      state.usersData=action.payload
    }
  },
});

export const { setFormState, setPercentage,updateUsersData } = stepsState.actions;
export const formState = (state) => state.formState;
export default stepsState.reducer;
