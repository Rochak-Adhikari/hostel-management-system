"use client";

import React, { useState } from "react";
import { Input } from '@/ui/inputs/input';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ForgotPasswordSchema } from '@/schema/authschema';
import { IForgotPassword } from '@/types/authtype';
import { useMutation } from '@tanstack/react-query';
import { forgotPassword } from '@/api/authapi';
import axios from 'axios';

export default function ForgotPassword() {
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<IForgotPassword>({
    defaultValues: { email: "" },
    resolver: yupResolver(ForgotPasswordSchema),
  });

  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => setSuccess(true),
  });

  const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
      return error.response?.data?.message ?? 'Something went wrong';
    }
    return 'Something went wrong';
  };

  const onSubmit = (data: IForgotPassword) => {
    mutate(data);
  };

  if (success) {
    return (
      <p className="text-center text-green-600 font-medium py-4 bg-green-50 rounded-md">
        Reset link sent! Check your email.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-6 font-semibold">
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
        {isPending ? 'Sending...' : 'SEND RESET LINK'}
      </button>
    </form>
  );
}
