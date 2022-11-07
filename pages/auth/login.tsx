import React, {useState} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {getCsrfToken, getProviders, signIn} from "next-auth/react";
import {CtxOrReq} from "next-auth/client/_utils";
import {AppProvider} from "next-auth/providers";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import {Password} from "primereact/password";
import {classNames} from "primereact/utils";
import {Checkbox} from "primereact/checkbox";
import {Divider} from "primereact/divider";

const defaultValues = {
    email: '', password: ''
}

const Login = ({csrf, providers}: { csrf: string, providers: AppProvider }) => {

    const [withEmail, setWithEmail] = useState(true)
    const {register, control, handleSubmit, formState: {errors}} = useForm({defaultValues: defaultValues});

    const onSubmit = (data: { email: string; password: string; }) => {
        if (withEmail) {
            signIn("email", {email: data.email, callbackUrl: '/'})
        } else {
            signIn('credentials', {email: data.email, password: data.password, csrfToken: csrf, callbackUrl: '/'})
        }

    };


    return (<div className='flex justify-content-center'>
        <div className="card">
            <h5 className="text-center">Login</h5>
            <div className='field'>
                <form onSubmit={handleSubmit(onSubmit)}>
                        <span className="p-float-label mb-3">
                            <Controller name="email" control={control} rules={{required: 'Name is required.'}}
                                        render={({field, fieldState}) => (
                                            <InputText style={{width: '100%'}} id={field.name} {...field} autoFocus
                                                       className={classNames({'p-invalid': fieldState.invalid})}/>)}/>
                            <label htmlFor="email" className={classNames({'p-error': errors.email})}>Email</label>
                        </span>
                    {!withEmail ? <><span className="p-float-label mb-3">
                                <Controller name="password" control={control}
                                            rules={{required: 'Password is required.'}}
                                            render={({field, fieldState}) => (
                                                <Password style={{width: '100%'}} inputStyle={{width: '100%'}}
                                                          id={field.name} {...field} toggleMask feedback={false}
                                                          className={classNames({'p-invalid': fieldState.invalid})}/>)}/>
                                <label htmlFor="password"
                                       className={classNames({'p-error': errors.password})}>Password</label>
                        </span>
                        <div className={'flex flex-row'}>
                            <Button key={"submit-with-credentials"} type={"submit"}>
                                Sign in with credentials
                            </Button>
                            <span>
                                        <div>
                                     <Checkbox
                                         className={'ml-3'}
                                         inputId="cb1"
                                         checked={withEmail}
                                         onChange={() => {
                                             setWithEmail(!withEmail)
                                         }}
                                     />
                                            <label htmlFor="cb1"
                                                   className="p-checkbox-label">Login with email code</label>
                                        </div>

                    </span>
                        </div>
                    </> : null}
                </form>
            </div>

            {withEmail ? <div className={'flex flex-row'}><Button
                    type="button"
                    key={"loginwithemail"}
                    className={'mb-3'}
                    onClick={handleSubmit(onSubmit)}>
                    Sign in with email
                </Button>
                    <span>
                         <Checkbox
                             className={'ml-3'}
                             inputId="cb2"
                             checked={withEmail}
                             onChange={() => {
                                 setWithEmail(!withEmail)
                             }}
                         />
                                <label htmlFor="cb2" className="p-checkbox-label">Login with email code</label>
                    </span>
                </div>

                : null

            }

            <Divider/>

            <div className='flex flex-row mb-3'>
                {Object.values(providers).map((provider: AppProvider, index) => {
                    if (provider.type === "credentials" || provider.type === "email") {
                        return null
                    }
                    return (<Button key={index} onClick={() => {
                        signIn(provider.id, {callbackUrl: '/'})
                    }}>
                        Sign in with {provider.name}
                    </Button>)
                })}
            </div>


        </div>
    </div>);
}

export async function getServerSideProps(context: CtxOrReq) {
    const providers = await getProviders()
    const csrfToken = await getCsrfToken(context)
    return {
        props: {
            providers, csrfToken
        },
    }
}

export default Login;
