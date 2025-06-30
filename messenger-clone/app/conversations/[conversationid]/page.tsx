import getConversationById from "@/app/actions/getConversationbyId";
import getMessages from "@/app/actions/getMessages";
import EmptyState from "@/app/components/EmptyState";
import Header from "./components/Header";
import Body from "./components/Body";
import Form from "./components/Form";

interface IParams {
    conversationid: string;
};

const ConversationId = async ({ params }: { params: IParams }) => {
    const conversation =  await getConversationById(params.conversationid);
    const messages = await getMessages(params.conversationid);
    
    if (!conversation) {
        return (
            <div className="lg:pl-80 h-full">
                <div className="h-full flex flex-col">
                    <EmptyState></EmptyState>
                </div>
            </div>
        );
    }

    return (
        <div className="lg:pl-80 h-full">
            <div className="h-full flex flex-col">
                <Header conversation={conversation}/>
                <Body/>
                <Form/>
            </div>
        </div>
    )
};

export default ConversationId;