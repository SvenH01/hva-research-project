import type { NextPage } from 'next'
import {Button} from "primereact/button";
import {useState} from "react";

const Home: NextPage = () => {
  return (

      <div className="flex align-content-center justify-content-center text-center p-2 h-screen">
          <div className="flex align-items-center">
              Welcome to this demo site, made to test the security of serverside authentication in NextJS.
              <br/>
              <br/>
              Made by Sven Hoving
          </div>

      </div>
  )
}

export default Home
