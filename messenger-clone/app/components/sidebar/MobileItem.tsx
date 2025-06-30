'use client';

import Link from "next/link";
import clisx from "clsx";

interface MobileItemProps {
    href: string;
    icon: any;
    active?: boolean;
    onClick?: () => void;
}

const MobileItem: React.FC<MobileItemProps > = (
    {
        href,
        icon: Icon,
        active,
        onClick
    }
) => {
    const handleClick = () => {
        if (onClick) {
            return onClick();
        }
    };

    return (
        <Link 
        onClick={onClick}
        href={href}
        className={clisx(`
            group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold text-gray-500 hover:text-black hover:bg-gray-100`,
            active && "bg-gray-100 text-black"
        )}
        >
            <Icon className='h-6 w-6'></Icon>
        </Link>
    );
}

export default MobileItem;