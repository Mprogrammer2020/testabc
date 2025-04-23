// pages/api/save-user.ts
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { CubeSignerClient, Secp256k1 } from "@cubist-labs/cubesigner-sdk";
import { JsonFileSessionManager } from "@cubist-labs/cubesigner-sdk-fs-storage";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { email, name, userType, walletAddresses, cubistUserId } = req.body;

    if (!email || !userType) {
      return res.status(400).json({ message: "Missing required user data" });
    }


    // Initialize CubeSigner Client with session
    const sessionFilePath = path.resolve(process.cwd(), "data/session.json");
    const client = await CubeSignerClient.create(new JsonFileSessionManager(sessionFilePath));
    // Create a key for the user
    const taprootTestKey = await client.org().createKey(Secp256k1.TaprootTest, cubistUserId);
    const cosmosKey = await client.org().createKey(Secp256k1.Cosmos, cubistUserId);

    return res.status(200).json({ message: "User data updated successfully" });

  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
