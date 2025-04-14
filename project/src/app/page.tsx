"use client";

import { SignInForm } from "@/components/blocks/sign-in-form";
import { Spinner } from "@/components/ui/spinner";
import { signIn, useSession } from "@/lib/auth-client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SignInPage() {
  
  const [pending, setPending] = useState(false);

  const {data: session, isPending} = useSession();
  const router = useRouter();

  useEffect(() => {
    if(session && session.user && session.session && !isPending) {
      router.push('/dashboard');
    }
  }, [session, isPending])


  const onSignIn = async (email: string, password: string) => {
    setPending(true);
    const toastId = toast.loading('Signing in...');

    const {error} = await signIn.email({email, password});
    console.log(error);

    if(error) {
      toast.error('Failed to sign in', {
        id: toastId,
        duration: 2000,
        description: error.message || 'Something went wrong'
      });
      setPending(false);
    }
    else {
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="flex w-full h-screen p-6 bg-slate-100">
      {(isPending || (session && session.user)) ? <Spinner /> : (
        <SignInForm className="m-auto w-full max-w-sm" onSignIn={onSignIn} isPending={pending} />
      )}
    </div>
  );
}
