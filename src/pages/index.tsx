import { useCallback, useEffect, useState } from "react";
import LoginOrRegisterWithGoogle from "@/components/LoginOrRegisterWithGoogle";
import { LOGIN } from "@/constants";
import Button from "@/components/common/Button";
import { Key } from "@cubist-labs/cubesigner-sdk";
import * as cs from "@cubist-labs/cubesigner-sdk";
import useClient from "@/cubistWallet/useClient";
import { Transaction } from "bitcoinjs-lib";
export default function Home() {
  const [disabledSection, setDisabledSection] = useState("");
  const { client, manager } = useClient();



  const fetchRawTxHex = async (txId: string) => {
    try {
      const mempoolAPI = "https://mempool.space/signet/api/"; // or mainnet if needed
      const url = new URL("tx/" + txId + "/hex", mempoolAPI).toString();

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Failed to fetch TX hex: ${res.statusText}`);
      }

      const rawTxHex = await res.text(); // response is plain text
      return rawTxHex;
    } catch (err) {
      console.error("Error fetching transaction hex:", err);
      return null;
    }
  };


  async function postStakeRegistrationBabylonTransaction(client: cs.CubeSignerClient, depositTxId: string = "8852bc316cefc877121bbc0144c410de5e00e57d194ac9d64a7372ff4a81e2a6") {

    const clientKeys: Key[] = (await client?.sessionKeys()) || [];
    console.log("clientKeys", clientKeys);


    const keyTypes = await Promise.all(clientKeys.map(key => key.type()));
    const stakerTaprootKey = clientKeys[keyTypes.findIndex(type => type === cs.Secp256k1.TaprootTest)];

    const stakerInfo = {
      // BTC Address
      address: stakerTaprootKey.materialId,
      // address: stakerAddress,

      // BTC compressed public Key in the 32-byte x-coordinate only hex format.
      publicKeyNoCoordHex: stakerTaprootKey.publicKey.slice(2),
    }
    console.log("stakerInfo: ", stakerInfo);


    const rawTxHex = await fetchRawTxHex(depositTxId);
    if (!rawTxHex) return
    const stakingTx = Transaction.fromHex(rawTxHex);

    console.log("stakingTx: ", stakingTx);

  }
  const logoutCb = useCallback(() => (manager as any).setSession(), [manager]);

  return (
    <>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {client ? <Button type="submit" variant="primary" onClick={logoutCb} disabled={!client}>Logout </Button> :
          <LoginOrRegisterWithGoogle
            buttonText="Login with Google"
            loginsuccessTex="Login successful!"
            disabledSection={client ? "GOOGLE" : ""} setDisabledSection={setDisabledSection}
            disabledSectionText={LOGIN}
          />}
        <br />
        <Button type="submit" variant="primary" onClick={() => {
          if (client) {
            postStakeRegistrationBabylonTransaction(client);
          }
        }} disabled={!client}>

          Stake Registration

        </Button>
      </div>

    </>
  );
}
