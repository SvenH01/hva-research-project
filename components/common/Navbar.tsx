import {Menubar} from "primereact/menubar";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {useRouter} from "next/router";

const Navbar = () => {
    const router = useRouter()

    const items = [
        {
            label: 'Home',
            icon: 'pi pi-fw pi-home',
            command: () => {
                router.push('/')
            }
        }
    ]

    return <Menubar
        model={items}
        end={<><Button label="Login" className={"mr-2"} icon="pi pi-sign-in" onClick={ () => {
            router.push("/login");
        }
        }/><Button label="Sign-up" icon="pi pi-upload" onClick={ () => {
            router.push("/sign-up");
        }
        }/></>}
    />
}

export default Navbar;
