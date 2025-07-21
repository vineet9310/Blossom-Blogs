import Link from 'next/link';
import { Logo } from '@/components/icons';

export function Header() {
  return (
    <header className="py-6 bg-card/80 backdrop-blur-sm border-b sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center">
          <Link href="/" className="flex items-center gap-2 text-foreground transition-colors hover:text-primary">
            <Logo className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold font-headline">Blossom Blog</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
