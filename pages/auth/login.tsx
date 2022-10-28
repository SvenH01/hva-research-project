import React from 'react';
import { useForm , Controller} from 'react-hook-form';
import {getCsrfToken, getProviders, signIn} from "next-auth/react";
import {CtxOrReq} from "next-auth/client/_utils";
import {AppProvider} from "next-auth/providers";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import {Password} from "primereact/password";

const defaultValues = {
    email: '',
    password: ''
}

const Login = ( {csrf, providers } : {csrf: string, providers: AppProvider}) => {

    const {register, control, handleSubmit} = useForm({defaultValues: defaultValues});

    const onSubmit = (data: { email: string; password: string; }) => {
        signIn('credentials', {email: data.email, password: data.password, csrfToken: csrf, callbackUrl: '/'})
    };


    return (
        <div>
        <form onSubmit={handleSubmit(onSubmit)}>
            <InputText {...register('email')}/>
            <Controller
                name="password"
                control={control}
                render={({field}) => <Password feedback={false} toggleMask {...field}/>}
            />
            <Button key={"submit-with-credentials"} type={"submit"}>
                Sign in with credentials
            </Button>
        </form>
            {
                Object.values(providers).map((provider: AppProvider, index) => {
                    if (provider.type === "credentials") {
                        return null
                    }
                    return ( <Button key={index} onClick={() => {
                            signIn(provider.id, {callbackUrl: '/'})
                        }
                        }>
                            {provider.name}
                        </Button>
                    )
                })
            }
        </div>
    );
}

export async function getServerSideProps(context: CtxOrReq) {
    const providers = await getProviders()
    const csrfToken = await getCsrfToken(context)
    return {
        props: {
            providers,
            csrfToken
        },
    }
}

export default Login;
