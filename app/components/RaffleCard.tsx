import React, {FC, useEffect, useState} from "react";
import {getRaffleTitle, RaffleType} from "../utils/raffle";
import Link from "next/link";
// @ts-ignore
import RelativeTime from '@yaireo/relative-time';
import RaffleImage from "./RaffleImage";
import {useRaffleEnded} from "../hooks/useRaffleEnded";

interface RaffleCardProps {
    raffle: RaffleType;
    onEdit: (raffle: RaffleType) => void;
}

const RaffleCard: FC<RaffleCardProps>  = ({raffle, onEdit}) => {
    const [endDateRelative, setEndDateRelative] = useState();
    const raffleEnded = useRaffleEnded(raffle);

    useEffect(() => {
        if(raffle && !raffleEnded) {
            const raffleEndDate = new Date(raffle.account.endDate*1000);
            const relativeTime = new RelativeTime({ locale: 'en' });
            setEndDateRelative(relativeTime.from(raffleEndDate));

        }
    }, [raffle, raffleEnded])

    return (
        <Link href={`https://raffle.shill-city.com/${raffle.publicKey}`}>
            <div
                className="card group card-compact bg-primary-content text bg-opacity-90 relative cursor-pointer md:hover:scale-105 transition-all"
            >
                <div>
                    {raffle.details.images?.length ? (
                        <RaffleImage src={raffle.details.images[0]} />
                    ) : (<RaffleImage src="/images/placeholder.png" />)}
                </div>
                <div className="card-body text-center items-center">
                    <div className="grow">
                        <h2 className="card-title font-jangkuy break-all !text-[1.0rem] leading-tight mt-1">
                            {getRaffleTitle(raffle)}
                        </h2>
                    </div>

                    <div className="grid grid-cols-3 w-full my-1">
                        <div>
                            <div className="text-sm flex flex-col justify-start gap-1">
                                <div className="text-xs">Tickets sold</div>
                                {raffle.account.maxTickets !== 0 ? (
                                    <div className="text-base">{raffle.account.issuedTickets}/{raffle.account.maxTickets}</div>
                                ) : (
                                    <div className="text-base">{raffle.account.issuedTickets}</div>
                                )}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm flex flex-col justify-start gap-1">
                                <div className="text-xs">Ticket price</div>
                                <div className="text-base">{raffle.account.ticketPrice}{raffle.account.isSpl ? ` $${process.env.NEXT_PUBLIC_RAFFLE_SPL_TOKEN_NAME}` : ' $SOL'}</div>
                            </div>
                        </div>
                        <div>
                            <div className="text-sm flex flex-col justify-start gap-1">
                                <div className="text-xs">Winners</div>
                                <div className="text-base">{raffle.account.totalWinners}</div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex flex-row gap-2 justify-center my-2">
                        {raffleEnded ? (
                            <div className="btn btn-block btn btn-outline">View Winners</div>
                        ) : (
                            <div className="btn btn-block btn-accent">Join Raffle</div>
                        )}
                    </div>
                    <div className="w-full my-2">
                        <div className="text-sm">
                            {raffleEnded ? (
                                <div className="indicator">
                                    <span className="indicator-item indicator-middle indicator-start badge-sm badge bg-white opacity-50" />
                                    <div className="pl-4 opacity-50">Raffle ended</div>
                                </div>
                            ) : (
                                <div className="indicator">
                                    <span className="indicator-item animate-pulse indicator-middle indicator-start badge-sm badge badge-accent" />
                                    <div className="pl-4">Ends{' '}{endDateRelative}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default RaffleCard;
