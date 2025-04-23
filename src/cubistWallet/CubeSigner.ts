import * as bitcoin from "bitcoinjs-lib";
import { Key, CubeSignerClient, Secp256k1, PsbtSignRequest } from '@cubist-labs/cubesigner-sdk';

export class CubeSigner {
    constructor(
        private cubeClient: CubeSignerClient,
        private key: Key
    ) { }

    async getAddress(): Promise<string> {
        const pubkey = Buffer.from(this.key.materialId, 'hex');

        const { address } = bitcoin.payments.p2wpkh({
            pubkey,
            network: bitcoin.networks.testnet, // or networks.bitcoin
        });

        if (!address) throw new Error('Unable to derive address');
        return address;
    }


    async signTransaction(psbt: bitcoin.Psbt): Promise<bitcoin.Psbt> {
        const psbtHex = psbt.toHex();
        const org = this.cubeClient.org();
        const stakerKey = await org.getKeyByMaterialId(
          Secp256k1.TaprootTest,
          this.key.materialId
        );
      
        const signRequest: PsbtSignRequest = {
          psbt: psbtHex,
        };
      
        const signed = await stakerKey.signPsbt(signRequest);
      
        return bitcoin.Psbt.fromHex(signed.data().psbt);
      }
}
