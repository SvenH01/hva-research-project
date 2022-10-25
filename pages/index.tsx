import type { NextPage } from "next";
import { useSession, signIn, signOut } from "next-auth/react";
import Head from "next/head";
import { trpc } from "utils/trpc";
import { useForm } from "react-hook-form";
import {Button} from "primereact/button";

const Home: NextPage = () => {
    const {
        data: secretMessageData,
        refetch: refetchSecretMessage,
        isError: isErrorSecretMessage,
        error: errorSecretMessage,
    } = trpc.useQuery(["auth.getSecretMessage"], {
        enabled: false,
        retry: false,
    });

    const { data: allExample, refetch: refetchGetAll } = trpc.useQuery(
        ["example.getAll"],
        {}
    );

    const { data: session } = useSession();

    const { mutate: changePassword } = trpc.useMutation(["user.changePassword"], {
        onSuccess: () => alert("Sent request to change pwd"),
    });

    type ChangePassword = {
        password: string;
    };

    const {
        register: registerChangePasswordField,
        handleSubmit: handleChangePasswordSubmit,
    } = useForm<ChangePassword>();

    const { mutate: addOne } = trpc.useMutation(["example.addOne"], {
        onSuccess: () => alert("Succefully created new one"),
    });

    type AddOne = {
        name: string;
        description: string;
    };

    const { register: registerAddOneField, handleSubmit: handleAddOneSubmit } =
        useForm<AddOne>();

    const onSubmitAddOne = handleAddOneSubmit((data) => addOne(data));

    return (
        <>
            <div className="mx-auto flex flex-column justify-center min-h-screen p-4">
                <h1 className="text-3xl font-bold">
                    Create T3 App - NextAuth Database Session with Credentials Provider
                    Proof of Concept
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
                            onClick={() => {}}
                            className="bg-blue-500 text-white px-5 py-3"
                        >
                            fetch from trpc
                        </Button>
                    </div>
                </div>

                <div className="mt-5 border-2 p-5 flex flex-column justify-content-center">
                    <h1>Authenticate and sign out here!</h1>
                    {session ? (
                        <>
                            <Button
                                onClick={() => signOut()}
                                className="bg-blue-500 text-white px-3 py-3 mt-2"
                            >
                                Sign Out - {session.user?.name}
                            </Button>
                        </>
                    ) : (
                        <div className="flex w-full">
                            <Button
                                onClick={() => signIn("github")}
                                className="bg-blue-500 text-white px-3 py-3 mt-2"
                            >
                                Sign In With Github
                            </Button>
                            <Button
                                onClick={() => signIn()}
                                className="bg-blue-500 text-white px-3 py-3 mt-2"
                            >
                                Sign In With Email
                            </Button>
                        </div>
                    )}
                </div>

                <div className="mt-5 border-2 p-5 flex flex-column justify-center">
                    <h1>This is just a db test</h1>
                    <pre>{JSON.stringify(allExample, null, 2)}</pre>

                    <form className="flex gap-2" onSubmit={onSubmitAddOne}>
                        <input
                            type="text"
                            {...registerAddOneField("name")}
                            className="border-2 px-5 py-3"
                            placeholder="name..."
                        />
                        <input
                            type="text"
                            {...registerAddOneField("description")}
                            className="border-2 px-5 py-3"
                            placeholder="description..."
                        />
                        I removed this button so people wont spam the db
                        {/*<input*/}
                        {/*    className="bg-green-500 text-white px-3 py-3"*/}
                        {/*    type="submit"*/}
                        {/*    value="Add todo"*/}
                        {/*/>*/}
                    </form>
                </div>
            </div>
        </>
    );
};

export default Home;
