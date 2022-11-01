import { useContext } from "react";
import { GlobalContext } from '../../context';

let Gallery= ()=>{

    let { state, dispatch } = useContext(GlobalContext);
    
    return(
        <div>I am Home Component!-{state.myNum}
        <button onClick={ () => {
            dispatch({
                type:"MINUS",
            })
        }}>MINUS</button>
        </div>
    )
}
export default Gallery;