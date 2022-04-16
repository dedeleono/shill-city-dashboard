import React, {FC, useState} from 'react';
import 'react-toastify/dist/ReactToastify.css';
import Image from "next/image";
import Tooltip from "rc-tooltip";

interface CollectionStackProps {
    name: string,
    url: string,
    placeholderImage: string,
    description: string,
    stakedNfts: [
        {
            image: string,
            stakeAccount: {
                account : {
                    stakeAmount?:number,
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

const CollectionStack :FC<CollectionStackProps> = ({name,url,placeholderImage,description, stakedNfts, unStakedNfts}) => {
    const nfts = [...stakedNfts, ...unStakedNfts];
    const [imageLoaded, setImageLoaded] = useState(false);
    let coverImage;
    let thumbImages: any[] = [];
    if(nfts.length) {
        coverImage = nfts[0].image;
    }
    if(nfts.length > 1) {
        thumbImages = nfts.slice(1,4).map(_nft => _nft.image);
    }
    if(stakedNfts &&  stakedNfts[0] && stakedNfts[0].stakeAccount.account.stakeAmount) {

    }
    let totalStaked = 0;
    if(stakedNfts[0] && stakedNfts[0].stakeAccount.account.stakeAmount) {
        // Needed for pets
        stakedNfts.forEach((stake) => {
            totalStaked += stake.stakeAccount.account.stakeAmount || 1
        });
    } else {
        totalStaked = stakedNfts.length;
    }

    const totalNfts = unStakedNfts.length + totalStaked;


    return (
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
    );
}
export default CollectionStack;
