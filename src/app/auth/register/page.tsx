import { SignupForm } from "@/components/modules/authentication/registretion/signup-form";

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-svh p-4 md:p-6 lg:p-8 bg-muted/50">
      <div className="w-full max-w-3xl">
        <SignupForm />
      </div>
    </div>
  );
}
