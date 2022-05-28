import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
   name: 'user',
   initialState: {
      user: {
         displayName: '',
         uid: undefined,
         email: '',
         photoUrl: '',
         jobTitle: '',
         resumeUrl: '',
         location: {
           longitude: null,
           latitude: null  
         },
         type: '',
         aboutMe: '',
         ProfileIds: []
      } 
   },
   reducers: {
      setUser(state, action) {
         state.user = action.payload;
      },

      updateUser(state, action) {
         state.user[action.payload.property] = action.payload.value;
      },
   } 
});

export const { setUser, updateUser } = userSlice.actions;

export default userSlice.reducer;