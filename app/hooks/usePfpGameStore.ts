import create from "zustand";
import * as anchor from "@project-serum/anchor";
import {ConfirmOptions, Connection, PublicKey} from "@solana/web3.js";
import {Program, Provider} from "@project-serum/anchor";
import {ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID} from "@solana/spl-token";
import {getPfpProgram} from "../utils/pfp";
import {AnchorWallet} from "@solana/wallet-adapter-react";
import {getTrtnToken} from "../utils/token";
import * as bs58 from "bs58";

const opts = {
    preflightCommitment: "processed" as ConfirmOptions,
};


const rpcEndpoint = process.env.NEXT_PUBLIC_RPC_ENDPOINT as string;

const connection = new anchor.web3.Connection(
    rpcEndpoint,
    opts.preflightCommitment
);

type PfpGameState = {
    program: Program;
    connection: Connection;
    jollyranch: PublicKey;
    jollyBump: number;
    recieverSplAccount: PublicKey;
    spl_token: PublicKey;
    splBump: number;
    wallet_token_account: PublicKey;
    jollyAccount: any;
};

type PfpGameStats = {
    gangs: any[];
};

interface UsePfpGameStore {
    pfpGameState: PfpGameState,
    pfpGameStats: PfpGameStats,
    setupPfpGameState: (wallet: AnchorWallet) => void;
    getPfpGameStats: () => void;
}

const usePfpGameStore = create<UsePfpGameStore>((set, get) => ({
    pfpGameState: {} as PfpGameState,
    pfpGameStats: {} as PfpGameStats,
    setupPfpGameState: async (wallet: AnchorWallet) => {
        const provider = new Provider(connection, wallet, opts.preflightCommitment);
        const program = getPfpProgram(provider);
        const [jollyranch, jollyBump] =
            await anchor.web3.PublicKey.findProgramAddress(
                [Buffer.from("jolly_account")],
                program.programId
            );

        const spl_token = getTrtnToken();

        const [recieverSplAccount, splBump] =
            await anchor.web3.PublicKey.findProgramAddress(
                [jollyranch.toBuffer()],
                program.programId
            );

        const wallet_token_account = await Token.getAssociatedTokenAddress(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            spl_token,
            wallet.publicKey
        );

        const jollyAccount = await program.account.jollyRanch.fetch(
            jollyranch.toString()
        );

        set({
            pfpGameState: {
                program,
                connection,
                jollyranch,
                jollyBump,
                recieverSplAccount,
                spl_token,
                splBump,
                wallet_token_account,
                jollyAccount,
            },
        });
    },
    getPfpGameStats: async () => {
        const program = get().pfpGameState.program;
        const gangs = await getGangs(program);

        set({
            pfpGameStats: {
                gangs,
            }
        })
    },
}));






async function getGangs(program: Program){
    const gangsForOwner = await program.account.gang.all([
        {
            memcmp: {
                offset: 8,
                bytes: bs58.encode(program.provider.wallet.publicKey.toBuffer()),
                // bytes: bs58.encode(new Buffer(0)),
            },
        },
    ]);
    gangsForOwner.sort(function (a, b) {
        const n1 = parseInt(a.account.timestamp);
        const n2 = parseInt(b.account.timestamp);
        return n2 - n1;
    });
    return gangsForOwner
}
export default usePfpGameStore
