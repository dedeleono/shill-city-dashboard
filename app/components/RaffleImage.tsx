import React, {FC, useState} from "react";
import Image from "next/image";

interface RaffleImageProps {
    src: string;
}

const RaffleImage: FC<RaffleImageProps>  = ({src}) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    return (
        <figure className="relative">
            {!imageLoaded && (
                <div className="animate-pulse card flex justify-center items-center card-compact bg-slate-800 absolute top-0 left-0 right-0 bottom-0 !w-auto rounded-b-none" >
                    <div className="btn loading btn-circle btn-lg btn-ghost" />
                </div>)}
            <div className="flex relative">
                <Image
                    objectFit="cover"
                    quality={80}
                    src={src}
                    width={500}
                    height={500}
                    onLoadingComplete={() => setImageLoaded(true)}
                />
            </div>
        </figure>
    );
}

export default RaffleImage;
