import { useContext } from "react";
import { GlobalContext } from '../../context';

let Home= ()=>{

    let { state, dispatch } = useContext(GlobalContext);
    
    return(
        <div>I am Home Component!-{state.myNum}
        <button onClick={ () => {
            dispatch({ type:"ADD", })
        }}>add</button>
        </div>
    )
}
export default Home;