import { signOut, useSession } from "@/lib/auth-client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Spinner } from "../ui/spinner";
import { Skeleton } from "../ui/skeleton";

type UserDropdownProps = {
  user?: {
    name: string
    email: string
  },
  onLogout: () => void
}

export function UserDropdown({ user, onLogout }: UserDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {!user ? (
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-[64px]" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        ) : (
          <Button variant="unstyled" className="flex items-center gap-2 pl-2 pr-0">
            <span className="text-sm font-medium">{user.name}</span>
            <Avatar className="h-8 w-8">
              <AvatarFallback>{ !user ? <Spinner variant="dark" /> : user.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </Button>
        )}
      </DropdownMenuTrigger>

      {user && (
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-3 py-2">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-sm text-muted-foreground truncate">{user.email}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={onLogout}
          >
            <LogOut />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  )
}

export function Header(props: {}) {
  
  const {data: session} = useSession();
  const router = useRouter();

  const onLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/');
        },
      }
    });
  }

  return (
    <header className="flex items-center justify-between mb-6 px-4 py-3 h-14 border-b">
      <h1 className="text-xl font-semibold">Clockwork</h1>
      <UserDropdown 
        user={session?.user}
        onLogout={onLogout}
      /> 
    </header>
  )
}
