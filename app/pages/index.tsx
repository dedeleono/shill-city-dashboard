import { ToastContainer } from 'react-toastify';
import React, {useEffect} from 'react';
import Navigation from "../components/Navigation";
import WavesBg from "../public/images/wave.svg";
import Bg from "../public/images/out.png";
import {useAnchorWallet} from "@solana/wallet-adapter-react";
import useShillCityCapitalStore from "../hooks/useShillCityCaptitalStore";
import useShantiesStore from "../hooks/useShantiesStore";
import ShillCityReport from "../components/ShillCityReport";
import usePfpStore from "../hooks/usePfpStore";
import usePetsStore from "../hooks/usePetsStore";
import CollectionStack from "../components/CollectionStack";
import useLPStore from "../hooks/useLPStore";
import LpSummary from "../components/LpSummary";
import usePfpGameStore from "../hooks/usePfpGameStore";
import PfpGameSummary from "../components/PfpGameSummary";

export default function Home() {
    const wallet = useAnchorWallet();
    const getSccStats = useShillCityCapitalStore((state) => state.getSccStats);
    // shanties
    const initShantiesState = useShantiesStore((state) => state.initState);
    const getShantiesStats = useShantiesStore((state) => state.getStats);
    const shantiesStats = useShantiesStore((state) => state.stats);
    const shantiesState = useShantiesStore((state) => state.state);
    // pets
    const initPetsState = usePetsStore((state) => state.initState);
    const getPetsStats = usePetsStore((state) => state.getStats);
    const petsStats = usePetsStore((state) => state.stats);
    const petsState = usePetsStore((state) => state.state);
    // pfps
    const initPfpState = usePfpStore((state) => state.initState);
    const getPfpStats = usePfpStore((state) => state.getStats);
    const pfpStats = usePfpStore((state) => state.stats);
    const pfpState = usePfpStore((state) => state.state);
    // LP
    const tideState = useLPStore((state) => state.tideState);
    const psdnState = useLPStore((state) => state.psdnState);
    const setupTide = useLPStore((state) => state.setupTide);
    const setupPoseidon = useLPStore((state) => state.setupPoseidon);
    const getTideStats = useLPStore((state) => state.getTideStats);
    const getPsdnStats = useLPStore((state) => state.getPsdnStats);
    const getAccountStats = useLPStore((state) => state.getAccountStats);
    // pfp game
    const setupPfpGameState = usePfpGameStore((state) => state.setupPfpGameState);
    const getPfpGameStats = usePfpGameStore((state) => state.getPfpGameStats);
    const pfpGameState = usePfpGameStore((state) => state.pfpGameState);

    useEffect(() => {
        if (wallet?.publicKey) {
            initShantiesState(wallet);
            initPetsState(wallet);
            initPfpState(wallet);
            getSccStats(wallet);
            setupPoseidon(wallet);
            setupTide(wallet);
            setupPfpGameState(wallet);
        }
    }, [wallet]);

    useEffect(() => {
        if(shantiesState?.program && pfpState?.program && petsState?.program && psdnState?.poseidon && tideState?.tide && pfpGameState?.program) {
            getShantiesStats();
            getPetsStats();
            getPfpStats();
            getPsdnStats();
            getAccountStats();
            getTideStats();
            getPfpGameStats();
        }
    }, [shantiesState, pfpState, petsState,psdnState, tideState, pfpGameState]);
    return (
        <main
            style={{
                backgroundImage: `url(${Bg.src})`,
                backgroundAttachment: "fixed",
                objectFit: "cover",
                backgroundRepeat: "no-repeat",
                zIndex: "10",
                display: "absolute",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
            className="w-screen"
        >
            <Navigation activeId="old-atlantis" />

            <div
                style={{ backgroundImage: `url(${WavesBg.src})` }}
                className="bg-bottom bg-no-repeat bg-cover pt-16 md:pt-20"
            >
                <div className="px-4 container mx-auto max-w-screen-xl text-neutral-content bg-center">
                    <div className="flex gap-8 flex-col md:flex-row md:pt-6 lg:items-center place-content-center">
                        <div className="basis-1/3">
                            <div className="relative">
                                <img
                                    src="/images/mayor.png"
                                    className="max-w-none w-full h-full p-8 object-cover rounded-full "
                                    width={524} height={524}
                                />
                                <div className="absolute bottom-3 right-3">
                                    <img
                                        src="/images/logo-shillcity-capital.png"
                                        className="w-32 md:w-32 lg:w-44"
                                        width={546} height={376}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="basis-2/3">
                            <div className="text-2xl md:mt-8 lg:mt-0 lg:text-4xl text-shadow-lg font-jangkuy">
                                Welcome to Shill City{' '}<br className="hidden md:visible md:block" />
                                a DeFi metaverse
                            </div>
                            <div className="lg:text-lg font-montserrat lg:pr-20">
                                Created by Team Hydra and centered around $TRTN, the first Liquidity Backed Yield Token on Solana.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-4 md:p-8 container mx-auto max-w-screen-xl min-h-screen text-neutral-content bg-center pt-0 md:pt-0 md:-mt-4">
                <div className="flex gap-8 flex-col lg:flex-row pb-10 md:pt-6 ">
                    <div className="basis-1/3">
                        <div className="bg-neutral bg-opacity-70 w-full mt-4 md:-mt-10 lg:-mt-20 pt-6 md:pt-20 p-5 rounded rounded-2xl">
                            <div className="font-scratchy text-5xl leading-none">
                                Shill City Report
                            </div>
                            <ShillCityReport />
                        </div>
                    </div>
                    <div className="basis-2/3 overflow-visible bg-primary-content bg-opacity-20 rounded rounded-2xl p-5">
                        <div className="font-scratchy text-5xl leading-none">
                            Your Collection
                        </div>
                        <div className="grid gap-3 pt-5 grid-cols-2 md:grid-cols-3">
                            {shantiesStats?.stakedNfts && (
                                <CollectionStack
                                    unStakedNfts={shantiesStats.unStakedNfts}
                                    stakedNfts={shantiesStats.stakedNfts}
                                    name="Shanties"
                                    url="https://staking.shill-city.com/"
                                    placeholderImage={"/images/placeholder-shanties.png"}
                                    description="A collection of 3,333 gamified NFTs with a membership into DeFi style reward yielding gains. Stake Shanties and earn Triton($TRTN) and LP your tokens in the Poseidon Tide Pool."
                                />
                            )}
                            {petsStats?.stakedNfts && (
                                <CollectionStack
                                    unStakedNfts={petsStats.unStakedNfts}
                                    stakedNfts={petsStats.stakedNfts}
                                    name="Pets"
                                    url="https://pets.shill-city.com/"
                                    placeholderImage={"/images/placeholder-pets.png"}
                                    description="A collection of 1000 Pet NFTs that when staked at the Pet Palace earns $TRTN. A 'stacking' feature offers upto 4x yield multipliers."
                                />
                            )}
                            {pfpStats?.stakedNfts && (
                                <CollectionStack
                                    unStakedNfts={pfpStats.unStakedNfts}
                                    stakedNfts={pfpStats.stakedNfts}
                                    name="Citizens"
                                    url="https://citizens.shill-city.com/"
                                    placeholderImage={"/images/placeholder-citizens.png"}
                                    description="A deflationary collection of 6666 Crime lords fighting for control of the synthesized krill trade. Build your gang and send them on missions through our P2E Gamefied Staking platform."
                                />
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex gap-8 flex-col lg:flex-row pb-10 md:pt-6 ">
                    <a
                        href="https://lp.shill-city.com/"
                        className="basis-1/2 bg-primary-content bg-opacity-50 rounded rounded-2xl p-5 transition-all hover:scale-105"
                    >
                        <div className="font-scratchy text-5xl leading-none">
                            Poseidon<br className="visible md:hidden" />
                            <span> Liquidity Pool</span>
                        </div>
                        <LpSummary />
                    </a>
                    <a
                        href="https://game.shill-city.com/"
                        className="basis-1/2 bg-primary-content bg-opacity-50 rounded rounded-2xl p-5 transition-all hover:scale-105"
                    >
                        <div className="font-scratchy text-5xl leading-none">
                            The Empire of Old AtlantiS
                        </div>
                        <PfpGameSummary />
                    </a>

                </div>
            </div>
            <ToastContainer position="top-center" theme="dark" />
        </main>
    );
}
