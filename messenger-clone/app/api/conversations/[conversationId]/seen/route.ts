import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

interface IParams{
    conversationId: string;
}

export async function POST(
    request: Request,
    { params }: { params: IParams }
) {
    try{
        const currentUser = await getCurrentUser();
        const {
            conversationId
        } = params;

        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        //Find the existing conversation
        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId,
            },
            include: {
                messages: {
                    include: {
                        seen: true
                    }
                },
                users: true,
            },
        });

        if (!conversation) {
            return new NextResponse('Invalid ID', { status: 400 });
        }

        //Find the last message in the conversation
        const lastMessage = conversation.messages[conversation.messages.length - 1];

        if (!lastMessage) {
            return NextResponse.json(conversation);
        }

        //Update the seen status of the last message
        const updatedMessage = await prisma.message.update({
            where: {
                id: lastMessage.id,
            },
            include: {
                sender: true,
                seen: true,
            },
            data: {
                seen: {
                    connect: {
                        id: currentUser.id
                    },
                },
            },
        });

        return NextResponse.json(updatedMessage);

    } catch (error) {
        console.error('ERROR_MESSAGES_SEEN', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}