import React, {useEffect, useState} from 'react';
import 'react-toastify/dist/ReactToastify.css';
import usePfpGameStore from "../hooks/usePfpGameStore";

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
        <div>
            <div className="">
                Your collected items: {collectedItems}
            </div>
            <div className="relative">
                <img
                    className="-m-5 -mx-14 md:-mx-11 mt-4 md:max-w-[115%]  w-96"
                    src="/images/placeholder-old-atlanties-gang.png"
                />
                <a
                    href="https://game.shill-city.com/"
                    className="absolute btn btn-accent right-5 top-1/2"
                >
                    Play now
                </a>
            </div>
        </div>
    );
}
