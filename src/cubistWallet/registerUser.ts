import { CubeSignerClient } from "@cubist-labs/cubesigner-sdk";
import { CUBESIGNER_ENV, OidcToken } from "./oauth";

const ORG_ID = `Org#${process.env.NEXT_PUBLIC_ORG_ID || ""}`;

/**
 * Registers a user in the organization by making a request to the backend.
 *
 * @param id_token The ID token from the OIDC provider
 */
export async function registerUser(id_token: OidcToken): Promise<void> {
    // Step 3
    // Step 4
    // Generate an identity proof
    const identity_proof = await CubeSignerClient.proveOidcIdentity(CUBESIGNER_ENV, ORG_ID, id_token);    

    // Step 5
    // Pass the proof to the backend
    const response =await fetch("/api/cubist/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ identity_proof }),
    });
    return;
}