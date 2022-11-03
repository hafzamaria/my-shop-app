import { useContext, useEffect, useState } from "react";
import { GlobalContext } from '../../context';
import axios from "axios";

let Profile = () => {

    let { state, dispatch } = useContext(GlobalContext);

    


    return (
        <div >            
            {(state.user === null) ?
                <div>Loading...</div>
                :
                <div>
                    _id: {state.user?._id}
                    <br />
                    name: {state.user?.firstName} {state.user?.lastName}
                    <br />
                    code: {state.user?.code}
                    <br />
                price: {state.user?.price}
                </div>
            }

        </div>
    );
}

export default Profile;