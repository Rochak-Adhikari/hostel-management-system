"use client";

import React from 'react';
import { Input } from '@/ui/inputs/input';
import { useForm } from 'react-hook-form';
import { IRegister } from '@/types/authtype';
import { RegisterSchema } from '@/schema/authschema';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { register as registerUser } from '@/api/authapi';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<IRegister>({
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      password: "",
      confirm_password: "",
      guardian: {
        name: "",
        phone: "",
        email: "",
      },
    },
    resolver: yupResolver(RegisterSchema),
  });

  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      router.push('/login');
    },
  });

  const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
      return error.response?.data?.message ?? 'Something went wrong';
    }
    return 'Something went wrong';
  };

  const onSubmit = (data: IRegister) => {
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <p className="text-black text-sm mb-3 font-bold text-center">Your Details</p>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex-1">
          <Input
            name="full_name"
            label="Full Name"
            id="name"
            type="text"
            placeholder="Full Name"
            required
            register={register}
            error={errors.full_name?.message}
          />
        </div>
        <div className="flex-1">
          <Input
            name="phone"
            label="Phone"
            id="phone"
            type="tel"
            placeholder="Phone"
            required
            register={register}
            error={errors.phone?.message}
          />
        </div>
      </div>

      <div className="mb-4">
        <Input
          name="email"
          label="Email"
          id="email"
          type="email"
          placeholder="Enter your email"
          required
          register={register}
          error={errors.email?.message}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            name="password"
            label="Password"
            id="password"
            type="password"
            placeholder="Password"
            required
            register={register}
            error={errors.password?.message}
          />
        </div>
        <div className="flex-1">
          <Input
            name="confirm_password"
            label="Confirm Password"
            id="confirm-password"
            type="password"
            placeholder="Confirm Password"
            required
            register={register}
            error={errors.confirm_password?.message}
          />
        </div>
      </div>

      <p className="text-black text-sm mb-3 font-bold text-center">GUARDIAN DETAILS</p>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex-1">
          <Input
            name="guardian.name"
            label="Guardian Name"
            id="guardian-name"
            type="text"
            placeholder="Guardian Name"
            required
            register={register}
            error={errors.guardian?.name?.message}
          />
        </div>
        <div className="flex-1">
          <Input
            name="guardian.phone"
            label="Guardian Phone"
            id="guardian-phone"
            type="tel"
            placeholder="Guardian Phone"
            required
            register={register}
            error={errors.guardian?.phone?.message}
          />
        </div>
      </div>

      <div className="mb-1">
        <Input
          name="guardian.email"
          label="Guardian Email"
          id="guardian-email"
          type="email"
          placeholder="Guardian Email"
          required
          register={register}
          error={errors.guardian?.email?.message}
        />
      </div>

      <p className="text-black/70 text-sm mb-2">
        Login credentials will be sent here automatically.
      </p>

      <p className="text-black/70 text-sm mb-5 leading-snug">
        By creating an account, you agree to our{" "}
        <span className="underline cursor-pointer">Terms of Use</span> and{" "}
        <span className="underline cursor-pointer">Privacy Policy</span>.
      </p>

      {isError && error && (
        <p className="text-red-500 text-xs text-center bg-red-100 w-fit mx-auto px-2 py-1 mb-4 rounded">
          {getErrorMessage(error)}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full h-12 bg-black text-white rounded-md text-base font-medium hover:bg-black/90 transition-colors disabled:opacity-50"
      >
        {isPending ? "Signing up..." : "CREATE ACCOUNT"}
      </button>
    </form>
  );
}
