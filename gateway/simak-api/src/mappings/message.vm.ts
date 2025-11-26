export class MessageVm {
    value: string;
    name: string;
}

export function toMessageResponse(data: any): MessageVm {
    return {
        value: data.id,
        name: data.Name,
    };
}

export function toMessageResponses(datas: any[]): MessageVm[] {
    return datas.map(toMessageResponse);
}
