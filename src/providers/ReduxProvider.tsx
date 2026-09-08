"use client";

import { Provider } from "react-redux";
import { store } from "../redux/store";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/features/auth/authSlice";

function AuthSynchronizer({ children }: { children: React.ReactNode }) {
  const { data: session } = authClient.useSession();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (session?.user) {
      // Synchronize the better-auth session user with Redux
      dispatch(setUser({ user: session.user as any, token: "" }));
    }
  }, [session, dispatch]);

  return <>{children}</>;
}

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <AuthSynchronizer>{children}</AuthSynchronizer>
    </Provider>
  );
}
