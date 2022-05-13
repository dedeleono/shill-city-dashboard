import type { NextApiRequest, NextApiResponse } from 'next'
import {ConfirmOptions, Keypair} from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { Provider, Wallet} from "@project-serum/anchor";
import {getPfpProgram} from "../../../utils/pfp";
import {getPetsProgram} from "../../../utils/pets";
import {getShantiesProgram} from "../../../utils/shanties";

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
  const provider = new Provider(connection, wallet, opts.preflightCommitment);
  const programPfp = getPfpProgram(provider);
  const stakesPfp = await programPfp.account.stake.all();

  const programPets = getPetsProgram(provider);
  const stakesPets = await programPets.account.stake.all();

  const programShanties = getShantiesProgram(provider);
  const stakesShanties = await programShanties.account.stake.all();

  res.setHeader('Cache-Control', 's-maxage=3600');
  res.status(200).json({data: [
      {creator: "sea shanties", collection : "citizens", authorities:stakesPfp.filter((stake) => stake.account.withdrawn === false).map(stake => stake.account.authority.toString())},
      {creator: "sea shanties", collection : "pets", authorities:stakesPets.filter((stake) => stake.account.withdrawn === false).map(stake => stake.account.authority.toString())},
      {creator: "sea shanties", collection : "shanties", authorities:stakesShanties.filter((stake) => stake.account.withdrawn === false).map(stake => stake.account.authority.toString())}
    ]});
}
