import * as anchor from "@project-serum/anchor";
import { Program, Provider } from "@project-serum/anchor";
import lootIdl from "../lib/idl/tarnished_idl.json";
import lootUpgradeIdl from "../lib/idl/tarnished_upgrade_idl.json";

export function getTarnishedProgram(provider: Provider) {
  return new Program(lootIdl as anchor.Idl, process.env.NEXT_PUBLIC_TARNISHED_PROGRAM as string, provider);
}

export function getTarnishedUpgradeProgram(provider: Provider) {
  return new Program(lootUpgradeIdl as anchor.Idl, process.env.NEXT_PUBLIC_TARNISHED_UPGRADE_PROGRAM as string, provider);
}

export const TARNISHED_LOCK_MULTIPLIERS = [
  { days: 7, multiplier: 1.1 },
  { days: 14, multiplier: 1.2 },
  { days: 90, multiplier: 2 },
];