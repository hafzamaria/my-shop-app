const Reducer = (state, action) => {
  
    switch (action.type) {
      case "MINUS": {
        return { ...state, myNum: state.myNum+1 }
      }
      case "ADD": {
        return { ...state, myNum: state.myNum+1 }
      }
      case "USER_LOGIN": {
        return { ...state, user: action.payload , isLogin:true}///jwt work
      }
      case "USER_LOGOUT": {
        return { ...state, user: null , isLogin:false} ///jwt work
      }
      case "CHANGE_THEME": {
        return { ...state, darkTheme: !state.darkTheme }
      }
      default: {
       return state
      }
    }
  }
  export default Reducer;