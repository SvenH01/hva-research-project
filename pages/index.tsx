import type { NextPage } from 'next'
import {Button} from "primereact/button";
import {useMemo, useState} from "react";

import { prisma } from 'lib/prisma/client'

const Home: NextPage = ({prismaUsers}: any) => {
    return (
      <div className="flex-row align-content-center justify-content-center p-2 h-screen">

          <h3 >YOU ARE NOT LOGGED IN</h3>
          <div>
              Welcome to this demo site, made to test the security of serverside authentication in NextJS.
              <br/>
              <br/>
              Made by Sven Hoving
          </div>
          <div>
              Current users: {prismaUsers.map( (user: any) => { return user.name + " "})}
          </div>

      </div>
  )
}

export const getServerSideProps = async () => {
    const prismaUsers = await prisma.user.findMany()

    return {
       props: {
           prismaUsers: JSON.parse(JSON.stringify(prismaUsers))
       }
    }
}

export default Home;
