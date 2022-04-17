import React  from 'react';
import 'react-toastify/dist/ReactToastify.css';
import {getNumber} from "../utils/format";
import useLPStore from "../hooks/useLPStore";
import CountUpValue from "./shared/CountUpValue";
import Tooltip from "rc-tooltip";
import {AiOutlineQuestionCircle} from "react-icons/ai";

export default function LpSummary() {
    const psdnStats = useLPStore((state => state.psdnStats));
    const accountStats = useLPStore((state => state.accountStats));
    const psdnRatio = useLPStore((state => state.psdnRatio));
    const tideStats = useLPStore((state => state.tideStats));

    let totalIssuedShell = null;
    let totalLiquidity = null;
    let yourLiquidity = null;
    if(psdnStats?.trtnAmount) {
        const totalTrtn = (psdnStats.trtnAmount as any / 1e6);
        const totalUsdc = (psdnStats.usdcAmount as any / 1e6);
        totalLiquidity = totalTrtn * psdnRatio  + totalUsdc;
        totalIssuedShell = getNumber(psdnStats.shellAmount, 6);
        const accountShell = accountStats?.shellBalance || 0;
        const walletStakedShell = tideStats?.walletStakedShell|| 0;
        yourLiquidity = (totalLiquidity * (accountShell + walletStakedShell)) / totalIssuedShell;
    }

    let totalStakedShell = null;
    let APY = null;
    if(!!tideStats?.totalStakedShell && !!psdnStats?.trtnAmount) {
        totalStakedShell = getNumber(tideStats.totalStakedShell, 6);
        const totalPooledTrtn = getNumber(psdnStats.trtnAmount, 6);
        const totalIssuedShell = getNumber(psdnStats.shellAmount, 6);
        const shellValue = 2 * (totalPooledTrtn / totalIssuedShell);
        const tidePoolYield = 2000 / totalStakedShell;
        APY = 100 * 365 * (tidePoolYield / shellValue)

        // totalLiquidity * (unstakedShell+stakedShell) / issuedShell
        // totalPooledTrtn * (totalStakedShell) / totalIssuedShell;
    }
    return (
        <div>
            <div className="flex">
                <div className="font-scratchy text-5xl leading-none mb-2 flex-grow">
                    Poseidon<br className="visible md:hidden" />
                    <span> Liquidity Pool</span>
                </div>
                <div>
                    <div
                        className=" btn btn-outline cursor-pointer"
                    >
                        Start trading
                    </div>
                </div>
            </div>
            <div className="card gap-6 flex flex-row items-center pb-2">
                <div className="-space-x-3 flex-shrink-0">
                    <div className="avatar z-10">
                        <div className="w-14">
                            <img src="/images/trtn.png" alt="Triton" />
                        </div>
                    </div>
                    <div className="avatar">
                        <div className="w-14">
                            <img src="/images/usdc.png" alt="Usdc" />
                        </div>
                    </div>
                </div>
                <div className="leading-tight">
                    <div className="opacity-50">Your liquidity</div>
                    <div className="text-xl">
                        {yourLiquidity ? <CountUpValue value={yourLiquidity} prefix="$" showCents={true} /> : '-'}
                    </div>
                </div>
            </div>
            <div className="flex flex-row gap-4 md:gap-5 pb-5">
                <div>
                    <div className="text-xs md:text-base opacity-50">Total liquidity</div>
                    <div className="text-base md:text-xl">
                        {totalLiquidity ? <CountUpValue value={totalLiquidity} prefix="$" showCents={false} />: '-'}
                    </div>
                </div>
                <div>
                    <div className="text-xs md:text-base opacity-50">$TRTN price</div>
                    <div className="text-base md:text-xl">
                        {psdnRatio ? <CountUpValue value={psdnRatio} decimals={3}  prefix="$" />: '-'}
                    </div>
                </div>
                <div>
                    <div className="text-xs md:text-base opacity-50">
                        <Tooltip
                            placement="top"
                            trigger={['hover']}
                            overlay={<span>Annual Percentage Yield: the rate of return gained over the course of a year</span>}
                        >
                            <div className="flex items-center">
                                APY
                                <AiOutlineQuestionCircle className="inline ml-0.5" />
                            </div>
                        </Tooltip>
                    </div>
                    <div className="text-base md:text-xl">
                        {APY ? <><CountUpValue value={APY} showCents={false} />%</>: '-'}
                    </div>
                </div>
            </div>
        </div>
    );
}
