"use client";

import { useProfile } from "@/features/auth/hooks/useAuth";
import {
    useUniqueUsername,
    useUpdateUser,
} from "@/features/users/hooks/useUsers";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { useDebounce } from "@/shared/hooks";
import { usePostAvatar } from "@/shared/hooks/useFiles";
import { CheckIcon, SpinnerIcon } from "@/shared/icons";
import { IUser } from "@/shared/interfaces/IUser";
import { UploadIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

export function SidebarEditProfile() {
    const { data: me } = useProfile();
    const avatarInputRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        watch,
        reset,
    } = useForm<Partial<IUser>>({
        defaultValues: {
            firstName: "",
            lastName: "",
            biography: "",
            phone: "",
            username: "",
        },
    });

    // Оновлюємо форму коли завантажуються дані користувача
    useEffect(() => {
        if (me) {
            reset({
                firstName: me.firstName || "",
                lastName: me.lastName || "",
                biography: me.biography || "",
                phone: me.phone || "",
                username: me.username || "",
            });
        }
    }, [me, reset]);

    const username = watch("username") || "";
    const debouncedUsername = useDebounce(username, 500);

    const { data: usernameCheck, isLoading: checking } = useUniqueUsername(
        debouncedUsername && debouncedUsername !== me?.username
            ? debouncedUsername
            : ""
    );

    const usernameAvailable = usernameCheck?.available ?? true;
    const updateUserMutation = useUpdateUser();

    const onSubmit = (data: Partial<IUser>) => {
        updateUserMutation.mutateAsync({
            username: data.username,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            biography: data.biography,
        });
    };

    const handleAvatarClick = () => avatarInputRef.current?.click();

    const postAvatarMutation = usePostAvatar();

    const handleAvatarChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];

        postAvatarMutation.mutateAsync(file);
    };

    return (
        <div className="flex flex-col gap-[5px] px-[10px] py-[5px] overflow-y-auto">
            <div
                className="flex justify-center relative cursor-pointer"
                onClick={handleAvatarClick}
            >
                <img
                    src={me?.avatarUrl ?? ""}
                    alt=""
                    className="w-[150px] h-[150px] object-cover brightness-50 rounded-full bg-neutral-600"
                />

                {!postAvatarMutation.isPending ? (
                    <UploadIcon className="absolute top-[50%] stroke-neutral-100 translate-y-[-50%] left-[50%] translate-x-[-50%] w-[50px] h-[50px] object-cover hover:scale-150 transition-all duration-200" />
                ) : (
                    <SpinnerIcon className="absolute top-[50%] fill-neutral-100 translate-y-[-50%] left-[50%] translate-x-[-50%] w-[50px] h-[50px] object-cover animate-spin" />
                )}

                <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                />
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
                        <p className="text-red-600 text-sm font-medium">
                            Username "{username}" is already taken
                        </p>
                    )}
                    {!checking && username && usernameAvailable && (
                        <p className="text-green-600 text-sm font-medium">
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
                </div>

                {isDirty && (
                    <button
                        className="absolute bottom-4 right-4 bg-theme-gradient rounded-xl p-[8px] cursor-pointer"
                        type="submit"
                        disabled={!usernameAvailable || checking}
                    >
                        <CheckIcon className="w-[30px] stroke-white stroke-2 fill-none" />
                    </button>
                )}
            </form>
        </div>
    );
}
