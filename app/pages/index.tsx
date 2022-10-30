import { ToastContainer } from 'react-toastify';
import React, {useEffect, useRef} from 'react';
import useSWR from "swr";
import Navigation from "../components/Navigation";
import WavesBg from "../public/images/wave.svg";
import Bg from "../public/images/out.png";
import {useAnchorWallet} from "@solana/wallet-adapter-react";
import useShillCityCapitalStore from "../hooks/useShillCityCaptitalStore";
import useShantiesStore from "../hooks/useShantiesStore";
import ShillCityReport from "../components/ShillCityReport";
import usePfpStore from "../hooks/usePfpStore";
import usePetsStore from "../hooks/usePetsStore";
import useLPStore from "../hooks/useLPStore";
import LpSummary from "../components/LpSummary";
import usePfpGameStore from "../hooks/usePfpGameStore";
import PfpGameSummary from "../components/PfpGameSummary";
import ConnectDialog from "../components/shared/ConnectDialog";
import CollectionSummary from "../components/CollectionSummary";
import {RaffleType} from "../utils/raffle";
import RaffleCard from "../components/RaffleCard";
import useTarnishedStore from '../hooks/useTarnishedStore';
function useRaffles () {
    const { data, error } = useSWR(`https://raffle.shill-city.com/api/raffle/all`,(apiPath: RequestInfo) => fetch(apiPath).then(res => res.json()));

    return {
        raffles: data as RaffleType[],
        isLoading: !error && !data,
        isError: error
    }
}
export default function Home() {
    const wallet = useAnchorWallet();
    const {raffles} = useRaffles();

    const getSccStats = useShillCityCapitalStore((state) => state.getSccStats);
    // shanties
    const initShantiesState = useShantiesStore((state) => state.initState);
    const getShantiesStats = useShantiesStore((state) => state.getStats);
    const shantiesState = useShantiesStore((state) => state.state);
    // pets
    const initPetsState = usePetsStore((state) => state.initState);
    const getPetsStats = usePetsStore((state) => state.getStats);
    const petsState = usePetsStore((state) => state.state);
    // pfps
    const initPfpState = usePfpStore((state) => state.initState);
    const getPfpStats = usePfpStore((state) => state.getStats);
    const pfpState = usePfpStore((state) => state.state);
    // tarnished
    const initTarnishedState = useTarnishedStore((state) => state.initState);
    const getTarnishedStats = useTarnishedStore((state) => state.getStats);
    const tarnishedState = useTarnishedStore((state) => state.state);
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
            initTarnishedState(wallet);
            getSccStats(wallet);
            setupPoseidon(wallet);
            setupTide(wallet);
            setupPfpGameState(wallet);
        }
    }, [wallet]);

    useEffect(() => {
        if(shantiesState?.program && pfpState?.program && petsState?.program && psdnState?.poseidon && tideState?.tide && pfpGameState?.program && tarnishedState?.program) {
            getShantiesStats();
            getPetsStats();
            getPfpStats();
            getTarnishedStats();
            getPsdnStats();
            getAccountStats();
            getTideStats();
            getPfpGameStats();
        }
    }, [shantiesState, pfpState, petsState,psdnState, tideState, pfpGameState, tarnishedState]);
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
            <Navigation activeId="home" />

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
                    {!wallet?.publicKey ? (
                        <div className="basis-2/3">
                            <ConnectDialog title="Connect your wallet " />
                        </div>
                    ) : (
                        <div className="basis-2/3 overflow-visible bg-primary-content bg-opacity-50 rounded rounded-2xl p-5">
                            <CollectionSummary />
                        </div>
                    )}


                </div>
                <div className="flex gap-8 flex-col lg:flex-row pb-10">
                    <div
                        className="basis-1/2 bg-primary-content bg-opacity-50 rounded rounded-2xl p-5"
                    >
                        <LpSummary />
                    </div>
                    <div
                        className="basis-1/2 bg-primary-content bg-opacity-50 rounded rounded-2xl p-5"
                    >
                        <PfpGameSummary />
                    </div>

                </div>
                <div className="bg-primary-content bg-opacity-50 rounded rounded-2xl p-5">
                    <div className="flex">
                        <div className="font-scratchy text-5xl leading-none grow">
                            Latest Raffles
                        </div>
                        <a
                            href="https://raffle.shill-city.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline mt-2"
                        >
                            <span>All raffles</span>
                        </a>
                    </div>

                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-4">
                        {raffles && raffles.slice(0,4).map(raffle =>
                            <RaffleCard
                                key={`raffle-${raffle.publicKey}`}
                                raffle={raffle}
                                onEdit={() => {return}}
                            />
                        )}
                    </div>
                </div>
            </div>
            <ToastContainer position="top-center" theme="dark" />
        </main>
    );
}
