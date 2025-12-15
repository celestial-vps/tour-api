export declare class MessageVm {
    value: string;
    name: string;
}
export declare function toMessageResponse(data: any): MessageVm;
export declare function toMessageResponses(datas: any[]): MessageVm[];
