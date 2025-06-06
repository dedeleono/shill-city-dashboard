import React, { FC, useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import Image from "next/image";
import Tooltip from "rc-tooltip";
import CountUpValue from "./shared/CountUpValue";

interface CollectionStackProps {
    name: string,
    url: string,
    estimateRewards?: number;
    placeholderImage: string,
    description: string,
    onRedeem: () => Promise<boolean>;
    stakedNfts: [
        {
            image: string,
            estimateRewards: number,
            stakeAccount: {
                account: {
                    stakeAmount?: number,
                },
            },
        }
    ],
    unStakedNfts: [
        {
            image: string,
        }
    ],
}

const CollectionStack: FC<CollectionStackProps> = (
    { name, url, placeholderImage, description, stakedNfts, unStakedNfts, onRedeem, estimateRewards }
) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isRedeeming, setIsRedeeming] = useState(false);
    const [coverImage, setCoverImage] = useState('');
    const [thumbImages, setThumbImages] = useState([]);
    const [totalStaked, setTotalStaked] = useState(0);
    const [totalNfts, setTotalNfts] = useState(0);
    const [totalRewards, setTotalRewards] = useState(0);

    useEffect(() => {
        const nfts = [...stakedNfts, ...unStakedNfts];
        if (nfts.length && coverImage === '') {
            setCoverImage(nfts[Math.floor(Math.random() * nfts.length)].image);
        }
        if (nfts.length > 1) {
            // @ts-ignore
            setThumbImages(nfts.slice(1, 3).map(_nft => _nft.image));
        }

        let _totalStaked = 0;

        if (stakedNfts[0] && stakedNfts[0].stakeAccount.account.stakeAmount) {
            // Needed for pets
            stakedNfts.forEach((stake) => {
                _totalStaked += stake.stakeAccount.account.stakeAmount || 1
            });
        } else {
            _totalStaked = stakedNfts.length;
        }
        let _totalRewards = 0;
        stakedNfts.forEach((stake) => {
            _totalRewards += stake.estimateRewards
        });
        setTotalRewards(_totalRewards);
        setTotalStaked(_totalStaked);
        setTotalNfts(unStakedNfts.length + _totalStaked);
    }, [stakedNfts, unStakedNfts])

    async function handleOnRedeem() {
        setIsRedeeming(true);
        await onRedeem();
        setIsRedeeming(false);
    }


    return (
        <div className="flex flex-col">
            <a href={url} className="transition-all hover:scale-105">
                <Tooltip
                    mouseEnterDelay={0.2}
                    placement="top"
                    trigger={['hover']}
                    overlay={
                        <div>
                            <div className="font-bold text-md font-jangkuy">{name}</div>
                            <div className="mt-1">
                                {description}
                            </div>
                        </div>}
                >
                    <figure className="relative rounded-xl">
                        {!imageLoaded && (
                            <div className="animate-pulse rounded-xl card flex justify-center items-center card-compact bg-slate-800 absolute top-0 left-0 right-0 bottom-0 !w-auto rounded-b-none" >
                                <div className="btn loading btn-circle btn-lg btn-ghost" />
                            </div>)}
                        <Image
                            className={`rounded-xl ${!coverImage && 'opacity-70 mix-blend-luminosity'}`}
                            objectFit="cover"
                            quality={80}
                            src={coverImage || placeholderImage}
                            width={400}
                            height={400}
                            onLoadingComplete={() => setImageLoaded(true)}
                        />
                        <div className={`absolute bottom-0 inset-0 top-auto  rounded-b-xl  p-4 ${!!coverImage && 'bg-gradient-to-t from-neutral'}`}>
                            <h3 className="font-jangkuy text-lg">{name}</h3>
                            <div className="flex gap-2 items-center h-8">
                                {!!thumbImages.length && (
                                    <div className="avatar-group -space-x-1">
                                        {thumbImages.map((_image, key) =>
                                            <div
                                                key={`name-thumb-${key}`}
                                                className="rounded-full w-8 h-8"
                                            >
                                                <Image
                                                    className="rounded-full"
                                                    objectFit="cover"
                                                    quality={80}
                                                    src={_image}
                                                    width={60}
                                                    height={60}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className={`text-sm opacity-70`}>
                                    {totalStaked}/{totalNfts}{' '}staked
                                </div>
                            </div>
                        </div>
                    </figure>
                </Tooltip>
            </a>
            {totalStaked > 0 ? (
                <div onClick={handleOnRedeem} className={`btn btn-sm btn-outline mt-2 ${isRedeeming && 'loading'}`}>
                    <span>Redeem</span>
                    {<CountUpValue className="mx-1" value={estimateRewards ? (totalRewards * 2) : totalRewards} />}
                    <span>TRTN</span>
                </div>
            ) : (
                <a
                    href="https://magiceden.io/creators/sea_shanties"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline mt-2"
                >
                    <span>Buy</span>
                </a>
            )}
        </div>
    );
}
export default CollectionStack;
