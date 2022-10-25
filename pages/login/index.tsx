import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { classNames } from 'primereact/utils';
import {signIn} from "next-auth/react";

const defaultValues = {
    username: '',
    password: '',
}

const Login = () => {
    const { control, formState: { errors }, handleSubmit, reset }: any = useForm({ defaultValues });

    const getFormErrorMessage = (name: string) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const onSubmit = (data: React.SetStateAction<{}>) => {
        reset();
    };

    return (
        <div className="flex justify-content-center">
            <div className="card">
                <h5 className="text-center">Login</h5>
                <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                    <div className="field pt-2">
                        <span className="p-float-label">
                            <Controller name="username" control={control} rules={{ required: 'Username is required.' }} render={({ field, fieldState }) => (
                                <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                            )} />
                            <label htmlFor="username" className={classNames({ 'p-error': errors.username })}>Name or Email</label>
                        </span>
                        {getFormErrorMessage('name')}
                    </div>
                    <div className="field pt-2">
                        <span className="p-float-label">
                            <Controller name="password" control={control} rules={{ required: 'Password is required.' }} render={({ field, fieldState }) => (
                                <Password id={field.name} feedback={false} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                            )} />
                            <label htmlFor="password" className={classNames({ 'p-error': errors.username })}>Password</label>
                        </span>
                        {getFormErrorMessage('name')}
                    </div>

                    <Button label={"Login with GitHub"} onClick={() =>
                        signIn('github')}/>

                    <Button type="submit" label="Login" className="mt-2" />
                </form>
            </div>
        </div>
    );
}

export default Login;
