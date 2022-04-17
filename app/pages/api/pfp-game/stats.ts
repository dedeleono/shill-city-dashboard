import type { NextApiRequest, NextApiResponse } from 'next'
import {ConfirmOptions, Keypair} from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { Provider, Wallet} from "@project-serum/anchor";
import {getPfpProgram} from "../../../utils/pfp";
import * as bs58 from "bs58";
import {ITEMS} from "../../../utils/pfpGame";

const opts = {
  preflightCommitment: "processed" as ConfirmOptions,
};


const rpcEndpoint = process.env.NEXT_PUBLIC_RPC_ENDPOINT as string;

const connection = new anchor.web3.Connection(
    rpcEndpoint,
    opts.preflightCommitment
);

type Data = {
  totalGangs: number,
  redeemedItems: {
    id: string,
    label: string,
    value: number,
  }[],
  totalRedeemedItems: number,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // @ts-ignore
  const wallet = new Wallet(Keypair.generate());
  const provider = new Provider(connection, wallet, opts.preflightCommitment);
  const program = getPfpProgram(provider);
  const widthdrawnGangs = await program.account.gang.all([
    {
      memcmp: {
        offset: 8 + // Discriminator.
            32 + // authority public key.
            8 + // id.
            8 + // timestamp.
            8 + // seed.
            4 + // chanceCommon.
            4 + // chanceRare.
            4 + // chanceLegendary.
            4, // result.
        bytes: bs58.encode([1]),
      }
    },
  ]);
  /*const redeemedItems = ITEMS.map(item => {
    return {
      id: item.id,
      redeemedInclBlessing: widthdrawnGangs.filter(gang => gang.account.prize[item.id] && gang.account.blessing).length,
      redeemedExclBlessing: widthdrawnGangs.filter(gang => gang.account.prize[item.id] && !gang.account.blessing).length,
    }

  })*/
  let redeemedItems = ITEMS.map(item => {
    return {
      id: item.id,
      label: item.name,
      img: item.img,
      value: widthdrawnGangs.filter(gang => gang.account.prize[item.id]).length,
    }

  })
  redeemedItems = redeemedItems.filter(item => item.value)
  //const citizens = widthdrawnGangs.map(item => item.account.authority.toString()).filter((value, index, self) => self.indexOf(value) === index);
  //console.log('gangs that went on a mission', widthdrawnGangs.length);
  //console.log('redeemedItems', redeemedItems);
  //console.log('test', citizens.length);
  // Cache 1 hour
  res.setHeader('Cache-Control', 's-maxage=3600');
  res.status(200).json({ redeemedItems,totalGangs:widthdrawnGangs.length, totalRedeemedItems: redeemedItems.map(item => item.value).reduce((prev, cur) => (prev+cur))})
}
