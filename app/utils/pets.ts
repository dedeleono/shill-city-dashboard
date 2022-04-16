import * as anchor from "@project-serum/anchor";
import {Program, Provider} from "@project-serum/anchor";
import petsIDL from "../lib/idl/pets_idl.json";

export function getPetsProgram(provider: Provider) {
  return new Program(petsIDL as anchor.Idl, process.env.NEXT_PUBLIC_PETS_PROGRAM as string, provider);
}

export const PETS_GROUP_MULTIPLIERS = [
  {group:1, multiplier:1, multiplierLegendary: 1},
  {group:2, multiplier:4, multiplierLegendary: 2.2},
  {group:3, multiplier:12, multiplierLegendary: 4.8},
  {group:4, multiplier:32, multiplierLegendary: 10.4},
];
