"use client";

import React, { useState } from "react";
import { Input } from '@/ui/inputs/input';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { SetPasswordSchema } from '@/schema/authschema';
import { useMutation } from '@tanstack/react-query';
import { setPassword } from '@/api/authapi';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface SetPasswordFormProps {
  token: string;
  email: string;
}

type SetPasswordFields = {
  new_password: string;
  confirm_password: string;
};

export default function SetPasswordForm({ token, email }: SetPasswordFormProps) {
  const router = useRouter();
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<SetPasswordFields>({
    defaultValues: {
      new_password: "",
      confirm_password: "",
    },
    resolver: yupResolver(SetPasswordSchema),
  });

  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: setPassword,
    onSuccess: () => {
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    },
  });

  const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
      return error.response?.data?.message ?? 'Something went wrong';
    }
    return 'Something went wrong';
  };

  const onSubmit = (data: SetPasswordFields) => {
    mutate({
      email,
      token,
      new_password: data.new_password,
      confirm_password: data.confirm_password,
    });
  };

  if (success) {
    return (
      <div className="text-center py-4 bg-green-50 rounded-md">
        <p className="text-green-600 font-medium text-base">
          Password set successfully!
        </p>
        <p className="text-gray-500 text-sm mt-1">
          Redirecting to login page...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4 font-semibold">
        <Input
          name="new_password"
          label="New Password"
          id="new_password"
          type="password"
          placeholder="Enter new password"
          required
          register={register}
          error={errors.new_password?.message}
        />
      </div>

      <div className="mb-6 font-semibold">
        <Input
          name="confirm_password"
          label="Confirm Password"
          id="confirm_password"
          type="password"
          placeholder="Confirm new password"
          required
          register={register}
          error={errors.confirm_password?.message}
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
        {isPending ? 'Setting Password...' : 'SET PASSWORD'}
      </button>
    </form>
  );
}
