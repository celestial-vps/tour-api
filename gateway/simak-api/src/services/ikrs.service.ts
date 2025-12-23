import { CreateKrsDto, FilterKrsDto, UpdateKrsDto } from "../dtos/payload-krs-dto";
import { KrsVm } from "../mappings/krs.vm";
import { MessageVm } from "../mappings/message.vm";

export interface IKrsService {
  create(createKrsDto: CreateKrsDto, userOid: string): Promise<{ krs: MessageVm | null, err: any }>;
  update(oid: string,updateKrsDto: UpdateKrsDto,  userOid: string): Promise<{ krs: KrsVm | null; err: any }>;
  deleted(oid: string, userOid: string): Promise<{ krs: KrsVm | null; err: any }>;
  findAll(): Promise<{ krss: KrsVm[] | null; err: any }>;
  findById(oid: string): Promise<{ krs: KrsVm | null; err: any }>;
  findPage( page: number, pageSize: number,condition: FilterKrsDto): Promise<{ krss: KrsVm[], total: number, err: any  }>;  
}
