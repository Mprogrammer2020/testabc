import { useCallback, useEffect, useState } from "react";
import Button from "./common/Button";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import useClient from "@/cubistWallet/useClient";
import { getOidcToken } from "@/cubistWallet/oauth";
import { CubeSignerClient, Key, UserInfo } from "@cubist-labs/cubesigner-sdk";
import { loginOrRegisterUser } from "@/cubistWallet/loginOrRegisterUser";
import { GOOGLE, USER_TYPE } from "@/constants";
import { BrowserStorageManager } from "@cubist-labs/cubesigner-sdk-browser-storage";
import { Spinner } from "./animations/spinner";

export default function LoginOrRegisterWithGoogle({ buttonText, loginsuccessTex, disabledSectionText, disabledSection, setDisabledSection }: { buttonText: string; loginsuccessTex: string; disabledSectionText: string, disabledSection: string, setDisabledSection: (value: string) => void; }) {
    const router = useRouter();
    const { manager, client } = useClient();
    const [isLoading, setIsLoading] = useState(false);

    const loginOrRegisterCb = useCallback(async () => {
        try {
            const w = window && window.open("about:blank", "Login", "popup,width=400,height=600,menubar=no");            
            if (!w) {
                Swal.fire({
                    title: "Error",
                    text: "Popup blocked! Please allow popups for this site.",
                    icon: "error",
                });
                return;
            }
            setIsLoading(true);
            setDisabledSection(disabledSectionText);
            const sessionData = await loginOrRegister();
            await (manager as any).setSession(sessionData!);
            const mgr = new BrowserStorageManager("CURRENT_SESSION");
            const clientData = await CubeSignerClient.create(mgr).catch(() => null)
            const clientKeys: Key[] = await clientData?.sessionKeys() || [];
            const clientUser = await clientData?.user();
            await saveUserData(clientKeys.map(key => key.materialId), clientUser);
        } catch (error) {
            console.log("error", error);
            setIsLoading(false);
            setDisabledSection("");
            throw error;
        }
    }, [manager]);



    const saveUserData = async (walletAddresses: string[], clientUser: UserInfo | undefined) => {
        const response = await fetch("/api/save-user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: clientUser?.email, // Safe check with optional chaining
                name: clientUser?.name,
                cubistUserId: clientUser?.user_id,
                userType: USER_TYPE.GOOGLE, // Safe check with optional chaining
                walletAddresses: walletAddresses
            }),
        });

        const data = await response.json();
        if (response.ok) {
            Swal.fire({
                title: "Success",
                text: loginsuccessTex,
                icon: "success",
            }).then(() => {
                router.reload();
            });
            console.log("User data saved successfully:", data);
        } else {
            console.error("Error saving user data:", data);
        }
        setIsLoading(false);
        setDisabledSection("");
    };


    return (
        <Button type="submit" variant="primary" onClick={loginOrRegisterCb} disabled={disabledSection == GOOGLE || isLoading}>
            {isLoading ? <>
                <Spinner className="h-5 w-5" />
                <span className={'mx-auto animate-pulse'}>Please wait...</span>
            </> : <span>{buttonText}</span>}
        </Button>
    );
}


/**
 * Attempts to login or, if the user does not have an account, register them
 *
 * @returns Session data for the logged-in session
 */
export async function loginOrRegister() {
    // Steps 1-2 of Login and Registration flows
    const id_token = await getOidcToken();
    return loginOrRegisterUser(id_token);
}