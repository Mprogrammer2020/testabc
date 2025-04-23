import { loginUser } from "./loginUser";
import { OidcToken } from "./oauth";
import { registerUser } from "./registerUser";

/**
 * @param id_token The ID token from the OIDC provider
 * Attempts to login or, if the user does not have an account, register them
 *
 * @returns Session data for the logged-in session
 */
export async function loginOrRegisterUser(id_token: OidcToken) {
    // Steps 1-2 of Login and Registration flows
    // Right now, we don't know if the user is already registered,
    // so we'll attempt the login flow, and if that fails, we'll register the user
    const sessionData = await loginUser(id_token).catch(async (e) => {
        if (e.errorCode === "OidcUserNotFound") {
            console.debug("Failed to login, attempting to register");
            await registerUser(id_token);
            return loginUser(id_token);
        } else {
            throw e;
        }
    });
    return sessionData;
}