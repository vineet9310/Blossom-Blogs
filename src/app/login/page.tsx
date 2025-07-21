import { LoginForm } from '@/components/auth/LoginForm';
import { Logo } from '@/components/icons';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
         <div className="flex flex-col items-center mb-8">
            <Logo className="h-12 w-12 text-primary" />
            <h1 className="text-3xl font-bold font-headline mt-4">Admin Login</h1>
            <p className="text-muted-foreground">Access your Blossom Blog dashboard.</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
