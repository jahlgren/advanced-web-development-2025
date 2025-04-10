"use client";

import { SignUpForm } from "@/components/blocks/sign-up-form";
import { signUp } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {

  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const onSignUp = async (name: string, email: string, password: string) => {
    setPending(true);
    setErrorMessage('');

    const {error} = await signUp.email({name, email, password});

    if(error) {
      setErrorMessage(error.message || 'Something went wrong');
      setPending(false);
    }
    else {
      redirect('/dashboard');
    }
  }

  return (
    <div className="flex w-full h-screen p-6 bg-slate-100">
      <SignUpForm 
        className="m-auto w-full max-w-sm" 
        onSignUp={onSignUp} 
        pending={pending}
        error={errorMessage}
      />
    </div>
  );
}
