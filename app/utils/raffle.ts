import * as anchor from "@project-serum/anchor";
import {Program, Provider} from "@project-serum/anchor";
import raffleIDL from "../lib/idl/raffle_idl.json";
import {Connection, LAMPORTS_PER_SOL, PublicKey} from "@solana/web3.js";
import {AES, enc} from "crypto-js";

export enum RafflePrizeType {
  Nft,
  WhitelistDiscord,
  WhitelistToken,
  Custom,
}

export type RaffleWinnerDetails = {
  ticket: string
  details: {
    wallet: string
    discordId?:string
  }
}

export type  RaffleAccountType = {
  prizeType: RafflePrizeType
  admin: string
  contestIndex: number
  prizeTokens?: string[]
  ticketPrice:number
  totalWinners: number
  maxTickets: number
  winnerTickets:string[]
  issuedTickets:number
  endDate:number
  winners: string[]
  splKey: string | null
  isSpl: boolean
}
export type RaffleDetailsType = {
  id: string
  listed:boolean
  collectDiscordId:boolean
  title: string
  createdAt:string
  updatedAt:string
  content?: string
  images?: string[]
  linkWebsite?: string
  linkDiscord?: string
  linkTwitter?: string
  linkMint?: string
}
export type RaffleType = {
  publicKey: string
  account: RaffleAccountType
  details: RaffleDetailsType
}

export type RaffleTicketType = {
  publicKey: string
  account: {
    contest: PublicKey
    customer: PublicKey
  }
}

export type RaffleInputType = {
  publicKey?: string
  account: {
    prizeType: RafflePrizeType
    splKey: string
    maxTickets: number
    ticketPrice:number
    totalWinners: number
    endDate:number
  }
  details?: {
    id?: string
    listed:boolean
    collectDiscordId:boolean
    title: string
    content?: string
    images?: string[]
    linkWebsite?: string
    linkDiscord?: string
    linkTwitter?: string
    linkMint?: string
  }
}

export function getRaffleTicketPrizeMultiplier(isSpl: Boolean): number {
  return isSpl ? 1e6 : LAMPORTS_PER_SOL;
}

export function getRaffleProgram(provider: Provider): Program {
  return new Program(raffleIDL as anchor.Idl, process.env.NEXT_PUBLIC_RAFFLE_PROGRAM as string, provider);
}

export function getRaffleTitle(raffle: RaffleType): string {
  if(raffle.details?.title) {
    return raffle.details.title
  } else {
    return raffle.publicKey
  }
}

export function validateRaffleAdminWallet(walletPublicKey: string) {
  // @ts-ignore
  const adminWallets = process.env.NEXT_PUBLIC_RAFFLE_ADMIN_WALLETS.split(' ');
  return !!adminWallets.find(adminAddress => adminAddress === walletPublicKey);
}

export function getRaffleAdminWallets(): string[] {
  // @ts-ignore
  return process.env.NEXT_PUBLIC_RAFFLE_ADMIN_WALLETS.split(' ');
}

export function getParsedRaffleAccount(raffleAccount: any): RaffleAccountType {
  raffleAccount.ticketPrice = raffleAccount.ticketPrice.toNumber()/getRaffleTicketPrizeMultiplier(raffleAccount.isSpl);
  raffleAccount.admin = raffleAccount.admin.toString();
  raffleAccount.contestIndex = raffleAccount.contestIndex.toNumber();
  raffleAccount.endDate = raffleAccount.endDate.toNumber();
  raffleAccount.winnerTickets = raffleAccount.winnerTickets.map((_ticket: { toString: () => any; }) => _ticket.toString());
  if(raffleAccount.splKey) {
    raffleAccount.splKey = raffleAccount.splKey.toString();
  }

  return raffleAccount;
}

export function convertRaffleLinkMintToText(linkMint: string) {
  const linkMintArray = linkMint.split('/');
  if(linkMintArray.length > 3) {
    const mintHash = linkMintArray[linkMintArray.length-1];
    const mintHashMasked = `${mintHash.slice(0,4)}...${mintHash.slice(mintHash.length-3,mintHash.length)}`
    const mintType = linkMintArray[linkMintArray.length-2]
    return `${mintType} ${mintHashMasked}`
  }
}

export function getRaffleEnded(raffle: RaffleType): boolean {
  if(raffle?.account?.endDate) {
    if(new Date().getTime() > raffle.account.endDate*1000) {
      return true;
    }
  }
  return false;
}

export function getRaffleWinnerTickets(raffle: RaffleType): string[] {
  return raffle.account.winnerTickets.filter(_ticket => new PublicKey(0).toString() !== new PublicKey(_ticket).toString());
}

export function encryptDiscordId(discordId:string): string {
  return AES.encrypt(discordId,process.env.NEXT_PUBLIC_RAFFLE_ENCRYPT_KEY as string).toString();
}

export function decryptDiscordId(memo:string): string {
  try {
    const decrypted = AES.decrypt(memo.substring(memo.indexOf("]") + 2),process.env.NEXT_PUBLIC_RAFFLE_ENCRYPT_KEY as string);
    return decrypted.toString(enc.Utf8);
  } catch (e) {
    return '';
  }

}
