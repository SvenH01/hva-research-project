import type { NextPage } from 'next'
import {Button} from "primereact/button";
import {useState} from "react";

const Home: NextPage = () => {
    const [count,setCount] = useState(0);
  return (

      <div className="text-center">
          <Button label="Click" icon="pi pi-plus" onClick={e => setCount(count + 1)}></Button>
          <div className="text-2xl text-900 mt-3">{count}</div>
      </div>
  )
}

export default Home
