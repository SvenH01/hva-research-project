import {Menubar} from "primereact/menubar";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {useRouter} from "next/router";

const Navbar = () => {
    const router = useRouter()

    return <Menubar
        start={<InputText placeholder="Search" type="text"/>}
        end={<Button label="Login" icon="pi pi-sign-in" onClick={ () => {
            router.push("/login");
        }
        }/>}
    />
}

export default Navbar;
