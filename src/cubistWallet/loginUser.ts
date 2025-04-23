import {
  CubeSignerClient,
  type SessionData,
} from "@cubist-labs/cubesigner-sdk";
import { CUBESIGNER_ENV, OidcToken } from "./oauth";

const ORG_ID = `Org#${process.env.NEXT_PUBLIC_ORG_ID || ""}`;

/**
 * Implements the LoginFlow steps 3-4
 *
 * @param idToken The ID token from the OIDC provider
 * @returns A session for the logged-in user
 */
export async function loginUser(idToken: OidcToken): Promise<SessionData> {
  // Create a session, requesting only the scopes we need for this application
  const response = await CubeSignerClient.createOidcSession(
    CUBESIGNER_ENV,
    ORG_ID,
    idToken,
    [
      "manage:readonly", // for listing keys
      "sign:btc:*", // for signing the test transaction
      "manage:key:create", // for creating a new key

      "sign:*",
      "mmi:*",
      "manage:mmi:*",
      "manage:key:get",
      "manage:mfa:list",
    ]
  );
  if (response.requiresMfa()) {
    throw new Error("This example does not include MFA");
  }

  return response.data();
}
