import { TagRepository } from '../repositories/tag.repository';
import { CreateTagDto, FilterTagDto, UpdateTagDto } from '../dtos/payload-tag-dto';
import { DataSource } from 'typeorm';
import { MessageVm } from '../mappings/message-vm';
import { TagMapping, TagVm } from '../mappings/tag-vm';
export declare class TagService {
    private readonly tagRepository;
    private readonly tagMapping;
    private readonly dataSource;
    constructor(tagRepository: TagRepository, tagMapping: TagMapping, dataSource: DataSource);
    create(tagdto: CreateTagDto, slugOid: string): Promise<MessageVm>;
    update(oid: string, tagdto: UpdateTagDto, slugOid: string): Promise<MessageVm>;
    deleted(oid: string, slugOid: string): Promise<MessageVm>;
    findAll(): Promise<TagVm[]>;
    findPage(page: number, pageSize: number, condition: FilterTagDto): Promise<{
        tags: TagVm[];
        count: number;
    }>;
    findById(oid: string): Promise<TagVm>;
}
