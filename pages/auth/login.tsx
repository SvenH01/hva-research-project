import React, { useEffect, useState } from 'react';
import { useForm , Controller} from 'react-hook-form';
import {getCsrfToken, getProviders, SessionContextValue, signIn} from "next-auth/react";
import {CtxOrReq} from "next-auth/client/_utils";
import {AppProvider, ProviderType} from "next-auth/providers";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import {Password} from "primereact/password";
import {providers} from "next-auth/core/routes";

const defaultValues = {
    email: '',
    password: ''
}

const Login = ( {csrf, providers } : {csrf: string, providers: AppProvider}) => {

    const {register, control, handleSubmit} = useForm({defaultValues: defaultValues});

    const onSubmit = (data: any) => {
        signIn('credentials', {email: data.email, password: data.password, csrfToken: csrf, callbackUrl: '/'})
    };


    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <InputText {...register('email')}/>
            <Controller
                name="password"
                control={control}
                render={({field}) => <Password feedback={false} toggleMask {...field}/>}
            />
            <Button type={"submit"}>
                Sign in with credentials
            </Button>

            {
                Object.values(providers).map((provider: AppProvider) => {
                    if (provider.type === "credentials") {
                        return null
                    }
                    return (
                        <div key={provider.name}>
                            <Button onClick={() => {
                                signIn(provider.id).then((res) => {
                                    console.log(res)
                                })
                            }
                            }>{provider.name}</Button>
                        </div>
                    )
                })
            }



        </form>

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
