
'use client';
import { useState } from 'react';
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
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you'd have registration logic here.
        // For now, we'll just log the user in using their credentials.
        login(email, password);
    }

  return (
    <main className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSignup}>
            <CardContent className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
             <Button type="submit" className="w-full">Create an account</Button>
            </CardContent>
        </form>
         <div className="mt-4 text-center text-sm mb-6">
            Already have an account?{" "}
            <Link href="/login" className="underline">
                Sign in
            </Link>
          </div>
      </Card>
    </main>
  )
}
