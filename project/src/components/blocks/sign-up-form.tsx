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
import { toast } from "sonner";
import { Link } from "../ui/link";

export type SignUpFormCallback = (name: string, email: string, password: string) => void;

export function SignUpForm({
  className,
  onSignUp,
  isPending,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  onSignUp: SignUpFormCallback,
  isPending?: boolean
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(password !== retypePassword) {
      toast.error('Passwords mismatch', { duration: 2000 });
      return;
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
                  disabled={isPending}
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
                  disabled={isPending}
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
                  disabled={isPending}
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
                  disabled={isPending}
                  minLength={8}
                />
              </div>
              <Button type="submit" className="w-full" isPending={isPending}>Sign up</Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Do you already have an account?{" "}
              <Link variant="primary" href="/" >Sign in</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
