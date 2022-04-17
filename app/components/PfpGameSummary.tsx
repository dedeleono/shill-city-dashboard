import React, {useEffect, useState} from 'react';
import 'react-toastify/dist/ReactToastify.css';
import usePfpGameStore from "../hooks/usePfpGameStore";
import CountUpValue from "./shared/CountUpValue";

export default function PfpGameSummary() {
    const pfpGameStats = usePfpGameStore((state) => state.pfpGameStats);
    const [collectedItems, setCollectedItems] = useState(0);
    useEffect(() => {
        if(pfpGameStats && pfpGameStats.gangs && pfpGameStats.gangs.length) {
            const _itemsCollected = pfpGameStats.gangs.filter(_gang => !!Object.keys(_gang.account.prize).find((_prizeKey) => !!_gang.account.prize[_prizeKey])).length;
            setCollectedItems(_itemsCollected);
        }
    }, [pfpGameStats])
    return (
        <div className="flex-grow flex-row h-full">
            <div className="flex">
                <div className="font-scratchy text-5xl leading-none mb-2 flex-grow">
                    The Empire of Old Atlantis
                </div>
                <div>
                    <div
                        className="btn btn-outline cursor-pointer"
                    >
                        Play now
                    </div>
                </div>
            </div>
            <div className="card gap-6 flex flex-row items-center pb-2">
                <div className="-space-x-3 flex-shrink-0">
                    <div className="avatar z-10">
                        <div className="w-20">
                            <img
                                src="/images/logo-atlantis.png"
                                width={524} height={386}
                            />
                        </div>
                    </div>
                </div>
                <div className="leading-tight">
                    <div className="opacity-50">Your collected items</div>
                    <div className="text-xl">
                        {collectedItems ? <CountUpValue value={collectedItems} showCents={false} /> : '-'}
                    </div>
                </div>
            </div>
            <div className="relative self-stretch">
                <img
                    className="-m-5 -mx-14 md:-mx-11 mt-4 md:max-w-[115%]  w-96"
                    src="/images/placeholder-old-atlanties-gang.png"
                />
            </div>
        </div>
    );
}
