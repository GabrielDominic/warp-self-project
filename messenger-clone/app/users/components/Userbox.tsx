'use client';

import Avatar from "@/app/components/Avatar";
import LoadingModal from "@/app/components/LoadingModal";
import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

interface UserboxProps {
    data: User
}

const Userbox: React.FC<UserboxProps> = ({
    data
}) => {
    const router = useRouter();
    const [isloading, setIsLoading] = useState(false);

    const handleClick = useCallback(() => {
        setIsLoading(true);

        axios.post('/api/conversations', {
            userId: data.id
        })
        .then((data) => {
            router.push(`/conversations/${data.data.id}`);
        })
    }, [data.id, router]);

    return (
        <>
            {isloading && (
                <LoadingModal/>
            )}
            <div
            onClick={handleClick}
            className="flex items-center w-full p-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer">
                <Avatar user={data}/>
                <div className="min-w-0 flex-1">
                    <div className="focus:outline-none">
                        <div className="flex justify-between items-center mb-1 ml-2">
                            <p className="text-sm font-medium text-gray-900">   {data.name}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Userbox;