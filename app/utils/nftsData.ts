import { Program } from "@project-serum/anchor";
import { getMetaplexToken } from "./token";
import * as anchor from "@project-serum/anchor";
import { chunks } from "./common";
import { AccountInfo, ConfirmOptions, Connection } from "@solana/web3.js";
import axios from "axios";
import { programs } from "@metaplex/js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
// @ts-ignore
import RelativeTime from '@yaireo/relative-time'

type LockMultiplier = {
    days: number;
    multiplier: number;
}

type GroupMultiplier = {
    group: number;
    multiplier: number;
    multiplierLegendary: number;
}

export default class NftsData {
    provider: anchor.AnchorProvider;
    program: Program;
    connection: Connection;
    rpcEndpoint: string;
    hashTable: string[];
    hashTableLegendaries: string[];
    redemptionRate: number;
    redemptionRateLegendary: number;
    lockMultipliers: LockMultiplier[];
    groupMultipliers: GroupMultiplier[];
    constructor(
        provider: anchor.AnchorProvider,
        program: Program,
        hashTable: string[],
        hashTableLegendaries: string[] = [],
        redemptionRate: number,
        redemptionRateLegendary: number,
        lockMultipliers: LockMultiplier[] = [],
        groupMultipliers: GroupMultiplier[] = [],
    ) {
        this.provider = provider;
        this.program = program;
        this.rpcEndpoint = process.env.NEXT_PUBLIC_RPC_ENDPOINT as string
        this.connection = new anchor.web3.Connection(
            this.rpcEndpoint,
            "processed" as ConfirmOptions
        );
        this.hashTable = hashTable;
        this.hashTableLegendaries = hashTableLegendaries;
        this.redemptionRate = redemptionRate;
        this.redemptionRateLegendary = redemptionRateLegendary;
        this.lockMultipliers = lockMultipliers;
        this.groupMultipliers = groupMultipliers;
    }
    async getWalletUnStakedNfts() {
        // console.log("fetched mint hashes");
        const tokenAccounts = await this.program.provider.connection.getParsedTokenAccountsByOwner(
            this.provider.wallet.publicKey,
            {
                programId: TOKEN_PROGRAM_ID,
            }
        );

        // console.log("got token accounts", tokenAccounts);
        const tokenAccountsMints = tokenAccounts.value.filter(tokenAccount => {
            const tokenAmount = tokenAccount.account.data.parsed.info.tokenAmount;
            return (tokenAmount.amount == "1" &&
                tokenAmount.decimals == "0" &&
                this.hashTable.includes(tokenAccount.account.data.parsed.info.mint));

        }).map(tokenAccount => tokenAccount.account.data.parsed.info.mint);

        return this.getNftsData(tokenAccountsMints);
    }
    async getWalletStakedNfts() {
        const newStakedNFTs = await this.program.account.stake.all([
            {
                memcmp: {
                    offset: 8, // Discriminator
                    // bytes: bs58.encode(wallet.publicKey.toBuffer()),
                    bytes: this.provider.wallet.publicKey.toBase58(),
                },
            },
        ]);

        // console.log("newStakedNFTs", newStakedNFTs.map(item => ({publicKey: item.publicKey.toString(), withdrawn: item.account.withdrawn, id: item.id}) ));
        const stakedNfts = newStakedNFTs.filter(
            (stake) => stake.account.withdrawn === false);
        // console.log("----------stakedNfts",stakedNfts);
        const stake_spls = await Promise.all(stakedNfts.map(async (nft_account) => {
            const keys = [nft_account.publicKey.toBuffer()];
            if (nft_account.account.mints) {
                // Needed for pets
                //@ts-ignore
                keys.push(nft_account.account.mints[0].toBuffer());
            }
            const [stake_spl, _stakeBump] =
                await anchor.web3.PublicKey.findProgramAddress(
                    keys,
                    this.program.programId
                );
            return stake_spl.toString();
        }));

        const mints = await Promise.all(
            chunks(stake_spls, 9).map(async _chunk =>
                await axios
                    .post(this.rpcEndpoint, {
                        jsonrpc: "2.0",
                        id: 1,
                        method: "getMultipleAccounts",
                        params: [
                            _chunk,
                            {
                                encoding: "jsonParsed",
                            },
                        ],
                    })
                    .then(async (res) => {
                        if (res?.data?.result?.value?.length) {
                            // Filter nulls first (user wallet may not be updated) and then map
                            return res.data.result.value.filter((v: any) => v).map((v: any) => v.data.parsed.info.mint);
                        } else {
                            return [];
                        }
                    })
            ),
        ).then((res) => {
            return res.flat();
        });

        const nftsData = await this.getNftsData(mints);
        // append stakedNfts data before returning
        return nftsData.map(nftData => {
            const stakeAccount = stakedNfts.find(stakedNft => {
                if (stakedNft.account.mints) {
                    // Needed for pets
                    //@ts-ignore
                    return nftData.mint === stakedNft.account.mints[0].toString();
                }
                //@ts-ignore
                return nftData.mint === stakedNft.account.mint.toString()

            });
            let estimateRewards = 0;
            let isLocked = false;
            let lockMultiplier = null;
            let lockEndsIn = null;
            let redemptionRate = null;
            if (stakeAccount) {
                if (stakeAccount.account.endDate) {
                    //@ts-ignore
                    const lockEndUnix = stakeAccount.account.endDate * 1000;
                    //@ts-ignore
                    const lockStartUnix = stakeAccount.account.startDate * 1000;
                    const todayUnix = parseInt((new Date().getTime()).toFixed(0));
                    //const future = new Date();
                    //future.setDate(future.getDate() + 7);
                    //const futureUnix = parseInt((future.getTime()).toFixed(0));
                    if (lockEndUnix > todayUnix) {
                        isLocked = true;
                        const lockPeriodInDays = (lockEndUnix - lockStartUnix) / (1000 * 3600 * 24);
                        lockMultiplier = this.lockMultipliers.find(multiplier => multiplier.days === lockPeriodInDays);
                        const relativeTime = new RelativeTime({ locale: 'en' });
                        //@ts-ignore
                        lockEndsIn = relativeTime.from(new Date(stakeAccount.account.endDate * 1000))
                    }
                }
                redemptionRate = nftData.redemptionRate;
                if (redemptionRate) {
                    if (lockMultiplier) {
                        redemptionRate = redemptionRate * lockMultiplier.multiplier;
                    }
                    const currDate = new Date().getTime() / 1000;
                    let halvening1_start_time = 167000000;

                    let to_days = 60 * 60 * 24;

                    if (Math.abs(stakeAccount.account.startDate as number) > halvening1_start_time) {
                        let day_dif = (currDate - Math.abs(stakeAccount.account.startDate as number))
                        let days_elapsed = day_dif / to_days;
                        estimateRewards = (nftData.redemptionRate /2) * days_elapsed;
                    } else {
                        let day_dif_after_halvening = (currDate - halvening1_start_time);
                        let day_dif_before_halvening = (halvening1_start_time - Math.abs(stakeAccount.account.startDate as number));
                        let days_elapsed_after_halvening = day_dif_after_halvening / to_days;
                        let days_elapsed_before_halvening = day_dif_before_halvening / to_days;
                        estimateRewards = (nftData.redemptionRate * days_elapsed_before_halvening) + ((nftData.redemptionRate /2) * days_elapsed_after_halvening);
                    }
                }
            }
            return {
                ...nftData,
                redemptionRate,
                stakeAccount,
                estimateRewards,
                isStaked: true,
                isLocked,
                lockMultiplier,
                lockEndsIn,
            }
        });

    }
    async getTotalStakedNfts() {
        let totalStaked = 0;
        const stakes = await this.program.account.stake.all();
        if (stakes[0] && stakes[0].account.stakeAmount) {
            stakes.map((stake) => {
                if (stake.account.withdrawn === false) {
                    //@ts-ignore
                    for (let index = 0; index < stake.account.stakeAmount; index++) {
                        totalStaked++;
                    }
                }
            });
        } else {
            totalStaked = stakes.filter((stake: any) => stake.account.withdrawn === false).length;
        }
        return totalStaked;
    }
    private async getNftsData(mints: string[]) {
        const metaplexToken = getMetaplexToken();

        const pdas = await Promise.all(mints.map(async mint => {
            const tokenAccount = new anchor.web3.PublicKey(mint);
            const [pda] = await anchor.web3.PublicKey.findProgramAddress(
                [
                    Buffer.from("metadata"),
                    metaplexToken.toBuffer(),
                    new anchor.web3.PublicKey(tokenAccount.toString()).toBuffer(),
                ],
                metaplexToken
            );
            return pda;
        }));

        // console.log("mints", mints);
        // console.log("pdas", pdas.map(_p => _p.toString()));

        const accountInfoPdas = await Promise.all(
            chunks(pdas, 9).map(_chunk =>
                this.connection.getMultipleAccountsInfo(_chunk),
            ),
        ).then((res) => {
            return res.flat();
        });
        const metadatas = accountInfoPdas.map(accountInfoPda => {
            return new programs.metadata.Metadata(
                this.provider.wallet.publicKey.toString(),
                accountInfoPda as AccountInfo<Buffer>
            );
        })

        // console.log("metadata", metadatas);

        return await Promise.all(metadatas.map(async metadata => {
            const uri = metadata.data.data.uri.replace("dweb.link", "infura-ipfs.io")
            const { data } = await axios.get(uri);
            const image = data?.image;

            const isLegendary = this.hashTableLegendaries.includes(metadata.data.mint);

            return {
                ...data,
                image,
                isLegendary,
                id: Number(data.name?.replace(/^\D+/g, "").split(" - ")[0]),
                redemptionRate: isLegendary ? this.redemptionRateLegendary : this.redemptionRate,
                mint: metadata.data.mint,
            };
        })).then(res => {
            return res.sort(function (a: any, b: any) {
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                return 0;
            });
        });
    }
}
