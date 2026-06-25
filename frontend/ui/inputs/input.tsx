import React, { ChangeEvent, FC } from "react";
import {UseFormRegister} from 'react-hook-form'
import { LuAsterisk } from "react-icons/lu";

type IProps = {
  label: string;
  id: string;
  type?: "text" | "password" | "email"| "phone" | "number";
  placeholder?: string,
  required?: boolean,
  name?: string,
  register?:UseFormRegister<any>,
  error?:string
};

export const Input: FC<IProps> = ({
  error,
  name,
  label,
  id,
  type = "text",
  placeholder,
  required = false,
  register
  
}) => {
  return (
    <div className="flex flex-col gap-1 flex-1">
      
      <label
        htmlFor={id}
        className="flex items-center gap-1 text-sm text-black"
      >
        {label}
       {required &&  <LuAsterisk className="text-red-500 text-xs" />}
      </label>

      <input
        id={id}
        type={type}
         {...(register && name ? register(name) : {})} 
        placeholder={placeholder}
       className={`w-full h-9 border ${error ? 'border-red-500' : 'border-black'}
        rounded-md px-3 text-base text-black/80 outline-none focus:ring-1 focus:ring-black`}
      />
      <p className="text-red-500">{error}</p>
    </div>
  );
};