'use client';

import useConversation from "@/app/hooks/useConversation";
import useRoute from "@/app/hooks/useRoutes";
import MobileItem from "./MobileItem";

const MobileFooter = () => {
    const routes = useRoute();
    const {isOpen} = useConversation();

    if (isOpen) {
        return null;
    }

    return(
        <div className="fixed justify-between w-full bottom-0 z-40 flex items-center bg-white border-t-[1px] lg:hidden">
            {routes.map((route) => (
                <MobileItem
                    key={route.href}
                    href={route.href}
                    icon={route.icon}
                    onClick={route.onClick}
                />
            ))}
        </div>
    );
}

export default MobileFooter;