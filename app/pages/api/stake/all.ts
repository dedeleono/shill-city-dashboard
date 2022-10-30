import type { NextApiRequest, NextApiResponse } from 'next'
import { ConfirmOptions, Keypair } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { Program, Provider, Wallet } from "@project-serum/anchor";
import pfpIDL from "../../../lib/idl/pfp_idl.json";

const opts = {
  preflightCommitment: "processed" as ConfirmOptions,
};


const rpcEndpoint = process.env.NEXT_PUBLIC_RPC_ENDPOINT as string;

const connection = new anchor.web3.Connection(
  rpcEndpoint,
  opts.preflightCommitment
);

type Collection = {
  authorities: string[],
  collection: string,
  creator: string,
}
type Data = {
  data: Collection[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // @ts-ignore
  const wallet = new Wallet(Keypair.generate());
  const provider = new anchor.AnchorProvider(connection, wallet, opts.preflightCommitment);
  const programPfp = new Program(pfpIDL as anchor.Idl, process.env.NEXT_PUBLIC_PFP_PROGRAM as string, provider);
  const stakesPfp = await programPfp.account.stake.all();



  res.setHeader('Cache-Control', 's-maxage=3600');

  res.status(200).json({
    data: [
      //@ts-ignore
      { creator: "sea shanties", collection: "citizens", authorities: stakesPfp.filter((stake) => stake.account.withdrawn === false).map(stake => stake.account.authority.toString()) },
    ]
  });
}
