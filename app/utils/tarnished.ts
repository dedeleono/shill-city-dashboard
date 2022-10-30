import * as anchor from "@project-serum/anchor";
import { Program, Provider } from "@project-serum/anchor";
import lootIdl from "../lib/idl/tarnished_idl.json";

export function getTarnishedProgram(provider: Provider) {
  console.log(lootIdl, process.env.NEXT_PUBLIC_TARNISHED_PROGRAM, provider);
  return new Program(lootIdl as anchor.Idl, process.env.NEXT_PUBLIC_TARNISHED_PROGRAM as string, provider);
}

export const TARNISHED_LOCK_MULTIPLIERS = [
  { days: 7, multiplier: 1.1 },
  { days: 14, multiplier: 1.2 },
  { days: 90, multiplier: 2 },
];