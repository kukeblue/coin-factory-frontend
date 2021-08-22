import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { createContainer } from "unstated-next"
import { User } from "../typings";

function useUserStore() {

    const [user, _setUser] = useState<User | undefined>()
    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        
    }, [])

    const setUser = (user: User | undefined) => {
        
    }
    return {
        user,
        setUser
    }
}

export const UserStore = createContainer(useUserStore)
