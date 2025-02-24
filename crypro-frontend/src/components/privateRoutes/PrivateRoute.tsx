import React, { ReactNode } from 'react'
import { useAppSelector } from '../../store/store'
import { Navigate } from 'react-router-dom'

interface PrivateRoute {
    children: ReactNode;
  }
const PrivateRoute: React.FC<PrivateRoute>  = ({children}) => {

    const { isLoggedIn } = useAppSelector((state) => state.auth)

    if(isLoggedIn){
        return children
    }
    else{
      return  <Navigate to={"/auth"} />
    }
}

export default PrivateRoute