"use client";

import { Button } from "@/components/ui/button";
import { signOut, useSession } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  
  const { 
    data: session, 
    isPending,
    error,
    refetch
  } = useSession();

  console.log(session);

  const onSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          redirect('/');
        },
      }
    });
  }

  return (
    <div>
      Dashboard
      <Button onClick={onSignOut}>Sign out</Button>
    </div>
  );
}
