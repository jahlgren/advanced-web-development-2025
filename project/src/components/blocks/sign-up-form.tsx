"use client";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormEvent, useEffect, useState } from "react"
import Link from "next/link";
import { Spinner } from "../ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle } from "lucide-react";

export type SignUpFormCallback = (name: string, email: string, password: string) => void;

export function SignUpForm({
  className,
  onSignUp,
  pending,
  error,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  onSignUp: SignUpFormCallback,
  pending?: boolean,
  error?: string
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(error);

  useEffect(() => {
    setErrorMessage(error);
  }, [error]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(password !== retypePassword) {
      setErrorMessage('Passwords mismatch.')
    }
    else {
      setErrorMessage(error);
    }
    onSignUp(name, email, password);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardDescription className="font-bold">
            Clockwork
          </CardDescription>
          <CardTitle className="text-2xl">Sign up</CardTitle>
          <CardDescription>
            Enter your details below to sign up
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="name"
                  required
                  onChange={e => setName(e.target.value)}
                  value={name}
                  disabled={pending}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  onChange={e => setEmail(e.target.value)}
                  value={email}
                  disabled={pending}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required
                  onChange={e => setPassword(e.target.value)}
                  value={password} 
                  disabled={pending}
                  minLength={8}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Retype Password</Label>
                <Input 
                  id="retypepassword" 
                  type="password" 
                  required
                  onChange={e => setRetypePassword(e.target.value)}
                  value={retypePassword} 
                  disabled={pending}
                  minLength={8}
                />
              </div>
              {errorMessage ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {errorMessage}
                  </AlertDescription>
                </Alert>
                ) : undefined}
              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? <Spinner /> : "Sign Up"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Do you already have an account?{" "}
              <Link href="/" className="underline underline-offset-4">Sign In</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
