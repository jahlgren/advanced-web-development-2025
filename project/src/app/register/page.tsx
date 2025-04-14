"use client";

import { SignUpForm } from "@/components/blocks/sign-up-form";
import { signUp } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';

export default function SignUpPage() {

  const [pending, setPending] = useState(false);
  
  const router = useRouter();

  const onSignUp = async (name: string, email: string, password: string) => {
    setPending(true);

    const {error} = await signUp.email({name, email, password});

    if(error) {
      toast.error(error.message || 'Something went wrong', {duration: 2000});
      setPending(false);
    }
    else {
      router.push('/dashboard');
    }
  }

  return (
    <div className="flex w-full h-screen p-6 bg-slate-100">
      <SignUpForm 
        className="m-auto w-full max-w-sm" 
        onSignUp={onSignUp} 
        isPending={pending}
      />
    </div>
  );
}
