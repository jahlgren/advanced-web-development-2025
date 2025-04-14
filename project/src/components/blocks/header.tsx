import { signOut, useSession } from "@/lib/auth-client"
import { Spinner } from "../ui/spinner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, Ellipsis } from "lucide-react"
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export function Header(props: {}) {
  
  const {data: session, isPending} = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/');
        },
      }
    });
  }

  const UserBox = () => {
    if(isPending || !session || !session.user)
      return <Spinner variant="dark" />;
    return (
      <div className="flex items-center justify-end gap-4">
        <div className="flex flex-col items-end justify-center">
          <span className="font-bold text-foreground leading-none">{session.user.name}</span>
          <span className="text-foreground/50 leading-none">{session.user.email}</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon"><Ellipsis /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="cursor-pointer" onClick={handleSignOut}>
              <LogOut />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  return (
    <header className="mb-6 flex items-center justify-between h-16 border-b-2 border-b-black/20">
      <h1 className="font-medium text-2xl">Clockwork</h1>
      <UserBox />
    </header>
  )
}
