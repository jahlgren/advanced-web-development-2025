"use client";

import { SignInForm } from "@/components/blocks/sign-in-form";
import { signIn } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function SignInPage() {
  
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onSignIn = async (email: string, password: string) => {
    setPending(true);
    setErrorMessage('');

    const {error} = await signIn.email({email, password});
    console.log(error);

    if(error) {
      setErrorMessage(error.message || 'Something went wrong');
      setPending(false);
    }
    else {
      redirect('/dashboard');
    }
  };

  return (
    <div className="flex w-full h-screen p-6 bg-slate-100">
      <SignInForm className="m-auto w-full max-w-sm" onSignIn={onSignIn} pending={pending} error={errorMessage} />
    </div>
  );
}
