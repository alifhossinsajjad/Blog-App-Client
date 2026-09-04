import { Navbar } from "@/components/layout/Navbar";
import { userService } from "@/services/user.service";

export default async function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await userService.getSession();
  
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navbar user={session?.user} />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
