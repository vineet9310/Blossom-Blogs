'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { logout } from '@/lib/auth';
import { SidebarMenuButton } from '@/components/ui/sidebar';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
    router.refresh();
  };

  return (
    <SidebarMenuButton onClick={handleLogout} variant="default" className='bg-destructive text-destructive-foreground hover:bg-destructive/90'>
        <LogOut />
        Logout
    </SidebarMenuButton>
  );
}
