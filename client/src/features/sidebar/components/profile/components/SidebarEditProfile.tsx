"use client";

import { useProfile } from "@/features/auth/hooks/useAuth";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { useForm } from "react-hook-form";
import { IUser } from "@/shared/interfaces/IUser";
import { CheckIcon } from "@/shared/icons";
import {
    useUniqueUsername,
    useUpdateUser,
} from "@/features/users/hooks/useUsers";
import { useDebounce } from "@/shared/hooks";

export function SidebarEditProfile() {
    const { data: me } = useProfile();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<Partial<IUser>>({
        defaultValues: {
            firstName: me?.firstName || "",
            lastName: me?.lastName || "",
            biography: me?.biography || "",
            phone: me?.phone || "",
            username: me?.username || "",
        },
    });

    const watchFields = watch();
    const username = watch("username") || "";
    const debouncedUsername = useDebounce(username, 500);

    const { data: usernameCheck, isLoading: checking } = useUniqueUsername(
        debouncedUsername && debouncedUsername !== me?.username
            ? debouncedUsername
            : ""
    );

    const usernameAvailable = usernameCheck?.available ?? true;
    const updateUserMutation = useUpdateUser();

    const isFormChanged = Object.keys(watchFields).some(
        (key) => watchFields[key as keyof IUser] !== me?.[key as keyof IUser]
    );

    const onSubmit = (data: Partial<IUser>) => {
        updateUserMutation.mutateAsync({
            username: data.username,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            biography: data.biography,
        });
    };

    return (
        <div className="flex flex-col gap-[5px] px-[10px] py-[5px] overflow-y-auto">
            <div className="flex justify-center">
                <div className="w-[150px] h-[150px] bg-neutral-700 rounded-full"></div>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-[20px] p-[15px]"
            >
                <div className="flex flex-col gap-[15px]">
                    <div className="flex flex-col gap-[7px]">
                        <Label>First Name*</Label>
                        <Input
                            className="h-[43px]"
                            placeholder="First Name (Required)"
                            {...register("firstName", {
                                required: "First name is required",
                                minLength: {
                                    value: 2,
                                    message:
                                        "First name must be at least 2 characters long",
                                },
                            })}
                        />
                        {errors.firstName && (
                            <p className="text-red-500 text-sm">
                                {errors.firstName.message}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-[7px]">
                        <Label>Last Name</Label>
                        <Input
                            className="h-[43px]"
                            placeholder="Last Name (Optional)"
                            {...register("lastName")}
                        />
                    </div>

                    <div className="flex flex-col gap-[7px]">
                        <Label>Phone Number</Label>
                        <Input
                            className="h-[43px]"
                            placeholder="Phone Number (Optional)"
                            {...register("phone")}
                        />
                    </div>

                    <div className="flex flex-col gap-[7px]">
                        <Label>Bio</Label>
                        <Textarea
                            className="text-base!"
                            placeholder="Bio (Optional)"
                            {...register("biography")}
                        />
                        <div className="text-sm flex flex-col text-neutral-500 dark:text-neutral-400">
                            <div>
                                Any details such as age, occupation or city.
                            </div>
                            <div>
                                Example: 23 y.o. designer from San Francisco
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="border-t border-neutral-300 dark:border-neutral-800" />

                <div className="flex flex-col gap-[7px]">
                    <Label>Username*</Label>
                    <Input
                        className="h-[43px]"
                        placeholder="Username (Required)"
                        {...register("username", {
                            required: "Username is required",
                            minLength: {
                                value: 3,
                                message:
                                    "Username must be at least 3 characters long",
                            },
                            pattern: {
                                value: /^[a-zA-Z0-9_]+$/,
                                message:
                                    "Only letters, numbers, and underscores allowed",
                            },
                        })}
                    />
                    {checking && (
                        <p className="text-blue-400 text-sm">
                            Checking availability...
                        </p>
                    )}
                    {!checking && username && !usernameAvailable && (
                        <p className="text-red-500 text-sm">
                            Username "{username}" is already taken
                        </p>
                    )}
                    {!checking && username && usernameAvailable && (
                        <p className="text-green-500 text-sm">
                            Username "{username}" is available
                        </p>
                    )}
                    <div className="text-sm flex flex-col gap-[10px] text-neutral-500 dark:text-neutral-400">
                        <div>
                            You can choose a username on <b>LINQ</b>. If you do,
                            people will be able to find you by this username and
                            contact you without needing your phone number.
                        </div>
                        <div>
                            You can use <b>a–z</b>, <b>0–9</b> and underscores.
                            Minimum length is <b>5</b> characters.
                        </div>
                        <div>
                            <div>This link opens a chat with you:</div>
                            <div>
                                https://linq.com/
                                <b>{username || "username"}</b>
                            </div>
                        </div>
                    </div>
                    ;
                </div>

                {isFormChanged && (
                    <button
                        className="absolute bottom-4 right-4 bg-theme-gradient rounded-xl p-[8px] cursor-pointer"
                        type="submit"
                    >
                        <CheckIcon className="w-[30px] stroke-white stroke-2 fill-none" />
                    </button>
                )}
            </form>
        </div>
    );
}
