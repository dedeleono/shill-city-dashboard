import {getRaffleEnded, RaffleType} from "../utils/raffle";
import {useEffect, useState} from "react";

export function useRaffleEnded(raffle?: RaffleType): boolean {
    const [raffleEnded, setRaffleEnded] = useState(false);
    useEffect(() => {
        let interval: any;
        if(raffle && !interval) {
            const _raffleEnded = getRaffleEnded(raffle);
            setRaffleEnded(_raffleEnded);
            interval = setInterval(() => {
                const _raffleEnded = getRaffleEnded(raffle);
                if(_raffleEnded !== raffleEnded) {
                    setRaffleEnded(_raffleEnded);
                }
                if(_raffleEnded) {
                    clearInterval(interval);
                }
            }, 1000);

        }
        return () => clearInterval(interval);
    }, [raffle]);
    return raffleEnded;
}

