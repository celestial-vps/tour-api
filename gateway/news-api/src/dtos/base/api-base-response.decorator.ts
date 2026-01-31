import { ApiProperty } from '@nestjs/swagger';
interface PaginationOptions {
    type: any; // tipe konkret untuk data
}
export function ApiBaseResponseProps() {
    return function (target: any, key: string) {
        if (key === 'resultCode') ApiProperty({ example: '200' })(target, key);
        if (key === 'httpStatus') ApiProperty({ example: 200 })(target, key); 
        if (key === 'message') ApiProperty({ example: 'success' })(target, key);
        if (key === 'total') ApiProperty({ example: 1 })(target, key);
    };
}
 