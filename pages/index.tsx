import type { NextPage } from "next";
import { useSession, signIn, signOut } from "next-auth/react";
import { trpc } from "utils/trpc";
import {Controller, useForm} from "react-hook-form";
import {Button} from "primereact/button";
import {useRouter} from "next/router";
import {InputText} from "primereact/inputtext";
import {classNames} from "primereact/utils";
import React from "react";
import {Card} from "primereact/card";
import {Divider} from "primereact/divider";

const Home: NextPage = () => {
    const router = useRouter();
    const { data: session } = useSession();

    const {
        data: secretMessageData,
        refetch: refetchSecretMessage,
        isError: isErrorSecretMessage,
        error: errorSecretMessage,
    } = trpc.useQuery(["auth.getSecretMessage"], {
        enabled: false,
        retry: false,
    });



    const { data: todos, refetch: refetchToDo } = trpc.useQuery(
        ["todo.getAll"],
        {
            enabled: !!session
        }
    );

    const clearCompleted = trpc.useMutation(["todo.clearAll"], {
        onSuccess: () => {
            alert("Succesfully removed all todo's")
        },
        onError: (error => alert(error.message))
    })
    const { mutate: changePassword } = trpc.useMutation(["user.changePassword"], {
        onSuccess: () => alert("Sent request to change pwd"),
        onError: error => alert(error.message)
    });

    type ChangePassword = {
        password: string;
        repeatPassword: string;
    };

    const {
        setError,
        register: registerChangePasswordField,
        handleSubmit: handleChangePasswordSubmit,
    } = useForm<ChangePassword>();

    const { mutate: addOne } = trpc.useMutation(["todo.addOne"], {
        onSuccess: () => refetchToDo(),
        onError: (error => alert(error.message))
    });

    type AddOne = {
        name: string;
        description: string;
    };

    const { register: registerAddOneField, handleSubmit: handleAddOneSubmit } =
        useForm<AddOne>();

    const onSubmitAddOne = handleAddOneSubmit((data) => addOne(data));

    const onSubmitChangePassword = handleChangePasswordSubmit((data) => {
        if (data.password === data.repeatPassword) {
            changePassword(data);
        } else {
            setError('password', { message: "Passwords don't match" });
        }
    })

    return (
        <>
            <div className="mx-auto flex flex-column justify-center min-h-screen p-4">
                <h1 className="text-3xl font-bold">
                    NextAuth Database Session with Credentials Provider and Oauth2.0
                </h1>
                <div className="mt-5 border-2 p-5 flex flex-col justify-center">
                    <div className="flex items-center w-full">
                        {secretMessageData ? (
                            <p>{secretMessageData}</p>
                        ) : isErrorSecretMessage ? (
                            <p>{errorSecretMessage.message}</p>
                        ) : (
                            <p>Click below to test your authorization</p>
                        )}
                    </div>
                    <div>
                        <Button
                            onClick={() => refetchSecretMessage()}
                            className="px-5 py-3"
                        >
                            fetch from trpc
                        </Button>
                    </div>
                </div>

                <div className="mt-5 border-2 p-5 flex flex-column justify-center">
                    <h2>Change password here!</h2>
                    <div className="flex">
                        <InputText
                            type="text"
                            {...registerChangePasswordField("password")}
                            placeholder="new password"
                        />
                        <InputText
                            className={'ml-2'}
                            type="text"
                            {...registerChangePasswordField("repeatPassword")}
                            placeholder="repeat new password"
                        />
                        <Button className={'ml-2'} onClick={onSubmitChangePassword}>Submit</Button>
                    </div>
                </div>

                <div className="mt-5 border-2 p-5 flex flex-column justify-content-center">
                    <h2>Authenticate and sign out here!</h2>
                    {session ? (
                        <>
                            <Button
                                onClick={() => signOut()}
                                className="px-3 py-3 mt-2"
                            >
                                Sign Out - {session.user?.name}
                            </Button>
                        </>
                    ) : (
                        <div>
                            <div className="flex">
                                <Button
                                    onClick={() => {
                                        signIn()
                                    }}
                                    className="px-3 py-3 mt-2"
                                >
                                    Sign In
                                </Button>
                            </div>
                            <div className="flex">
                                <Button
                                    onClick={() => {
                                        router.push("/sign-up")
                                    }}
                                    className="px-3 py-3 mt-2"
                                >
                                    Sign up
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-5 border-2 p-5 flex flex-column justify-center">
                    <h2>TODO&apos;S</h2>
                    <div>{
                        todos ?
                        todos.map((todo, index) => {
                        return <div key={index}>
                            <div >
                                <h3>{todo.name}</h3>
                                {todo.description}
                            </div>
                            <Divider/>
                        </div>
                    }) : null}</div>

                    <form className="flex gap-2" onSubmit={onSubmitAddOne}>
                        <InputText
                            type="text"
                            {...registerAddOneField("name")}
                            placeholder="title"
                        />
                        <InputText
                            type="text"
                            {...registerAddOneField("description")}
                            placeholder="description"
                        />
                        <Button
                            type="submit"
                            value="Add todo"
                        >
                            Submit
                        </Button>
                        <Button
                            type={"button"}
                            onClick={
                                () => {
                                    clearCompleted.mutate()
                                }
                            }
                        >
                            Clear all
                        </Button>
                    </form>

                </div>
            </div>
        </>
    );
};

export default Home;
