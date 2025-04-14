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
import { FormEvent, useState } from "react"
import { Link } from "../ui/link";

export type SignInFormCallback = (email: string, password: string) => void;

export function SignInForm({
  className,
  onSignIn,
  isPending,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  onSignIn: SignInFormCallback,
  isPending?: boolean,
  error?: string
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSignIn(email, password);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardDescription className="font-bold">
            Clockwork
          </CardDescription>
          <CardTitle className="text-2xl">Sign in</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  onChange={e => setEmail(e.target.value)}
                  value={email}
                  disabled={isPending}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {/* TODO: Implement forgot password feature.
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                  */}
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required
                  onChange={e => setPassword(e.target.value)}
                  value={password} 
                  disabled={isPending}
                />
              </div>
              <Button type="submit" className="w-full" isPending={isPending}>Sign in</Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link variant="primary" href="/register">Sign up</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
