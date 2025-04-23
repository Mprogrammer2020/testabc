import { useEffect, useState } from "react";
import { BrowserStorageManager } from "@cubist-labs/cubesigner-sdk-browser-storage";
import { CubeSignerClient } from "@cubist-labs/cubesigner-sdk";

function useClient() {
  const [client, setClient] = useState<CubeSignerClient | undefined | null>(undefined);
  const [manager, setManager] = useState<BrowserStorageManager | null>(null);
  const [isClient, setIsClient] = useState(false); // ✅ Track client-side rendering

  useEffect(() => {
    setIsClient(true); // ✅ Ensure we are on the client before running the logic

    const mgr = new BrowserStorageManager("CURRENT_SESSION");
    setManager(mgr);

    const login = async () => {
      setClient(await CubeSignerClient.create(mgr).catch(() => null));
    };
    const logout = () => setClient(null);

    mgr.addEventListener("login", login);
    mgr.addEventListener("logout", logout);

    void login(); // attempt to login

    return () => {
      mgr.removeEventListener("login", login);
      mgr.removeEventListener("logout", logout);
    };
  }, []);

  // ✅ Prevent rendering mismatches by returning null during SSR
  if (!isClient) return { client: null, manager: null };

  return { client, manager };
}

export default useClient;