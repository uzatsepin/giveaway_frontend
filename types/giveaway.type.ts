export interface IUser {
    id: number;
    username: string;
}

export interface IGiveaway {
    id: number;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    prize: string;
    status: "DRAFT" | "ACTIVE" | "COMPLETED" | "CANCELLED";
    imageUrl: string;
    participantsCount: number;
    createdById: number;
    createdAt: string;
    updatedAt: string;
    createdBy: IUser;
    messages: IGiveawayMessage[];
}

export interface ApiResponse {
    success: boolean;
    data: {
        giveaways: IGiveaway[];
        message?: string;
    };
    error?: string;
}

export interface ApiResponseSingleGiveaway {
    success: boolean;
    data: {
        giveaway: IGiveaway;
    };
    error?: string;
}

export interface ApiResponseMessage {
    success: boolean;
    data: {
        messages: IMessage[];
    };
    error?: string;
}

export interface IGiveawayForm {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    prize: string;
    imageUrl: string;
}

export interface IMessageForm {
    content: string;
    imageUrl: string;
    buttonText: string;
    giveawayId: any;
}

export interface IMessage {
    id: number;
    content: string;
    imageUrl: string;
    buttonText: string;
    createdAt: string;
    giveawayId: number;
    giveaway: IGiveaway;
}

export interface IGiveawayMessage {
    buttonText: string
    content: string
    createdAt: string
    giveawayId: number
    id: number
    imageUrl: string
}