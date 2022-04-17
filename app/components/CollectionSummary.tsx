import React, {useEffect, useState} from 'react';
import 'react-toastify/dist/ReactToastify.css';
import usePfpStore from "../hooks/usePfpStore";
import useShantiesStore from "../hooks/useShantiesStore";
import usePetsStore from "../hooks/usePetsStore";
import CollectionStack from "./CollectionStack";
import CountUpValue from "./shared/CountUpValue";
import useLPStore from "../hooks/useLPStore";

export default function CollectionSummary() {
    const stakedPfps = usePfpStore((state) => state.stats?.stakedNfts);
    const stakedShanties = useShantiesStore((state) => state.stats?.stakedNfts);
    const stakedPets = usePetsStore((state) => state.stats?.stakedNfts);
    const unStakedPfps = usePfpStore((state) => state.stats?.unStakedNfts);
    const unStakedShanties = useShantiesStore((state) => state.stats?.unStakedNfts);
    const unStakedPets = usePetsStore((state) => state.stats?.unStakedNfts);
    const psdnRatio = useLPStore((state => state.psdnRatio));
    const [dailyYield,setDailyYield] = useState(0);
    useEffect(() => {
        if(stakedPfps && stakedShanties && stakedPets) {
            const stakedNfts = [...stakedPfps,...stakedShanties,...stakedPets];
            const _dailyYield = stakedNfts.map(
                (_nft: {redemptionRate: number}) => _nft.redemptionRate
            ).reduce(
                (_prevReRate:number, _curReRate:number) => _prevReRate + _curReRate, 0);
            setDailyYield(_dailyYield);
        }
    }, [stakedPfps, stakedShanties,stakedPets])
    return (
        <div>
            <div className="flex">
                <div className="flex-grow font-scratchy text-5xl leading-none">
                    Your Collection
                </div>
                <div className="">
                    <div className="flex gap-3 items-center">
                        <div className="text-right leading-tight">
                            <div className="opacity-70">Your daily yield</div>
                            <div className="text-xl">
                                <CountUpValue value={dailyYield} />
                                {' '}TRTN{' '}
                                (<CountUpValue prefix="$" className="text-lg" value={dailyYield*psdnRatio} />)
                            </div>
                        </div>
                        <div>
                            <img src="/images/trtn.png" className="w-14 h-14" width={60} height={60} />
                        </div>
                    </div>

                </div>
            </div>

            <div className="grid gap-3 pt-5 grid-cols-2 md:grid-cols-3">
                {stakedShanties && (
                    <CollectionStack
                        unStakedNfts={unStakedShanties}
                        stakedNfts={stakedShanties}
                        name="Shanties"
                        url="https://staking.shill-city.com/"
                        placeholderImage={"/images/placeholder-shanties.png"}
                        description="A collection of 3,333 gamified NFTs with a membership into DeFi style reward yielding gains. Stake Shanties and earn Triton($TRTN) and LP your tokens in the Poseidon Tide Pool."
                    />
                )}
                {stakedPets && (
                    <CollectionStack
                        unStakedNfts={unStakedPets}
                        stakedNfts={stakedPets}
                        name="Pets"
                        url="https://pets.shill-city.com/"
                        placeholderImage={"/images/placeholder-pets.png"}
                        description="A collection of 1000 Pet NFTs that when staked at the Pet Palace earns $TRTN. A 'stacking' feature offers upto 4x yield multipliers."
                    />
                )}
                {stakedPfps && (
                    <CollectionStack
                        unStakedNfts={unStakedPfps}
                        stakedNfts={stakedPfps}
                        name="Citizens"
                        url="https://citizens.shill-city.com/"
                        placeholderImage={"/images/placeholder-citizens.png"}
                        description="A deflationary collection of 6666 Crime lords fighting for control of the synthesized krill trade. Build your gang and send them on missions through our P2E Gamefied Staking platform."
                    />
                )}
            </div>
        </div>
    );
}
