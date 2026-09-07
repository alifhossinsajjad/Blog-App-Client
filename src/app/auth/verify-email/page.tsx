"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useVerifyEmailMutation } from "@/redux/features/auth/authApi";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [verifyEmail] = useVerifyEmailMutation();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMsg("No verification token provided in the URL.");
      return;
    }

    const verify = async () => {
      try {
        await verifyEmail(token).unwrap();
        setStatus("success");
        // Redirect to login page after brief delay
        setTimeout(() => {
          router.push("/auth/login?verified=true");
        }, 2000);
      } catch (err: any) {
        setStatus("error");
        setErrorMsg(err?.data?.message || "Failed to verify email. The link might be expired.");
      }
    };

    verify();
  }, [token, verifyEmail, router]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Email Verification</CardTitle>
        <CardDescription className="text-center">
          {status === "loading" && "Verifying your email address..."}
          {status === "success" && "Verification successful!"}
          {status === "error" && "Verification failed."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-6">
        {status === "loading" && <Loader2 className="h-12 w-12 animate-spin text-primary" />}
        
        {status === "success" && (
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">Redirecting to login page...</p>
          </div>
        )}

        {status === "error" && (
          <div className="text-center space-y-4 w-full">
            <div className="p-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-md text-sm">
              {errorMsg}
            </div>
            <Button onClick={() => router.push("/auth/login")} className="w-full">
              Go to Login
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-background">
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
