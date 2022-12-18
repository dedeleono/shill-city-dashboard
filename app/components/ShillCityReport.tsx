import React, { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import useShantiesStore from "../hooks/useShantiesStore";
import usePfpStore from "../hooks/usePfpStore";
import usePetsStore from "../hooks/usePetsStore";
import useTarnishedStore from '../hooks/useTarnishedStore';

export default function ShillCityReport() {
    const [totalGangs, setTotalGangs] = useState(undefined);

    const shantiesStats = useShantiesStore((state) => state.stats);
    const pfpStats = usePfpStore((state) => state.stats);
    const tarnishedStats = useTarnishedStore((state) => state.stats);
    const petsStats = usePetsStore((state) => state.stats);
    const state = useTarnishedStore((state) => state);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/pfp-game/stats`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                });
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const resp = await response.json();
                setTotalGangs(resp.totalGangs);
            } catch (e) {
                console.log('error fetching game stats', e);
            }

        }
        fetchData();

    }, []);

    return (
        <div className="p-2 pt-5">
            <div className="flex flex-col gap-4">
                <div className="flex">
                    <div className="grow">Current Mayor</div>
                    <div>Hobnasty</div>
                </div>

                <div className="flex flex-col">
                    <div className="mb-2">Housing</div>
                    <div className="flex ml-2">
                        <div className="grow">Shanties</div>
                        <div>{shantiesStats?.totalStaked}/3333</div>
                        {console.log('a',state.state.programUpgrade)}
                    </div>
                    <div className="flex ml-2">
                        <div className="grow">Hotels</div>
                        <div className="opacity-50">Under construction</div>
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="mb-2">Inhabitants</div>
                    <div className="flex ml-2">
                        <div className="grow">Citizens</div>
                        <div>6666</div>
                    </div>
                    <div className="flex ml-5">
                        <div className="grow">Gen1</div>
                        <div className="">{pfpStats?.totalStaked}/{6666 - tarnishedStats.totalTarnished}</div>
                    </div>
                    <div className="flex ml-5">
                        <div className="grow">Gen2 (Tarnished)</div>
                        <div className="">{tarnishedStats?.totalStaked}/{tarnishedStats.totalTarnished}</div>
                    </div>
                    <div className="flex ml-2">
                        <div className="grow">Pets</div>
                        <div>{petsStats?.totalStaked}/1000</div>
                    </div>
                </div>

                <div className="flex">
                    <div className="grow">Crime (war parties)</div>
                    <div>{totalGangs}</div>
                </div>
            </div>
        </div>
    );
}
