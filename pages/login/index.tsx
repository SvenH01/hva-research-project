import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';
import { CountryService } from 'service/CountryService';
import {signIn} from "next-auth/react";

const defaultValues = {
    username: '',
    password: '',
}

const Login = () => {
    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState<any>({});
    const countryservice = new CountryService();

    const { control, formState: { errors }, handleSubmit, reset } = useForm({ defaultValues });

    const getFormErrorMessage = (name: string) => {
        // @ts-ignore
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const onSubmit = (data: React.SetStateAction<{}>) => {
        setFormData(data);
        setShowMessage(true);

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

                    <Button label={"Login with GitHub"} onClick={() => signIn()}/>

                    <Button type="submit" label="Login" className="mt-2" />
                </form>
            </div>
        </div>
    );
}

export default Login;
