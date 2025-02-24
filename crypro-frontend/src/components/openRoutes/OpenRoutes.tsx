import React, { ReactNode } from 'react'
import { useAppSelector } from '../../store/store'
import { Navigate } from 'react-router-dom'

interface OpenRouteProps {
    children: ReactNode;
  }

const OpenRoute: React.FC<OpenRouteProps> = ({children}) => {

    const { isLoggedIn } = useAppSelector((state) => state.auth)

    if(!isLoggedIn){
        return children
    }
    else{
      return  <Navigate to={"/"} />
    }
}

export default OpenRoute