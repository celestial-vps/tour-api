// src/krs/krs.service.ts
import { Injectable } from '@nestjs/common';


import { CreateKrsDto, FilterKrsDto, UpdateKrsDto } from '../dtos/payload-krs-dto';
import { Krs } from '../models/krs'; // Assuming you have this entity
import { IKrsService } from '../services/ikrs.service';
import { KrsVm, toKrsResponse, toKrsResponses } from '../mappings/krs.vm';
import { MessageVm } from '../mappings/message.vm';
import { KrsRepository } from '../repositories/krs.repository';
// src/krs/krs.service.ts 

@Injectable()
export class KrsService implements IKrsService {

    constructor(private readonly krsRepository: KrsRepository,
    ) { }

    async create(createKrsDto: CreateKrsDto, userOid: string): Promise<{ krs: MessageVm | null; err: any; }> {
        const now = new Date();
        try {
            const krs = new Krs();
            // krs.student = createKrsDto.student;
            krs.semester = createKrsDto.semester;
            krs.academicYear = createKrsDto.academicYear;

            const { result, err } = await this.krsRepository.save(krs);
            if (err) {
                return { krs: null, err };
            }
            const messageVm: MessageVm = {
                value: result ? result.id.toString() : '',
                name: result ? result.student : '',
            };
            return { krs: messageVm, err: null };
        } catch (err) {
            return { krs: null, err };
        }
    }

    async update(oid: string,updateKrsDto: UpdateKrsDto,  userOid: string): Promise<{ krs: KrsVm | null; err: any }> {
        try {
            const lastModifiedBy = userOid; // assuming userOid is in UUID format                
            let { result: resultFind, err: errFind } = await this.krsRepository.findById(oid);

            if (errFind != null) {
                return {
                    krs: null, err: errFind
                }
            }

            if (errFind != null) {
                return {
                    krs: null, err: {
                        message: "Record with id ${oid} not found"
                    }
                }
            }

            const now = new Date();
            if (resultFind == null) {
                return {
                    krs: null, err: {}
                }
            }
            // resultFind.krsCode = updateKrsDto.krsCode ?? resultFind.krsCode;
            resultFind.student = updateKrsDto.student ?? resultFind.student;
            resultFind.semester = updateKrsDto.semester ?? resultFind.semester;
            // Save updated krs details
            const { result, err } = await this.krsRepository.update(oid, resultFind);
            if (err != null) {
                return {
                    krs: null, err: {
                        message: "Record with id ${oid} not found"
                    }
                }
            }

            const krsVm = result ? toKrsResponse(result) : null;
            return { krs: krsVm, err: null };
        }
        catch (err) {
            return { krs: null, err };
        }
    }

    async deleted(oid: string, userOid: string): Promise<{ krs: KrsVm | null; err: any }> {
        try {
            const { result: resultFind, err: errFind } = await this.krsRepository.findById(oid);
            if (errFind != null) {
                return {
                    krs: null, err: errFind
                }
            }

            if (resultFind == null) {
                return {
                    krs: null, err: {
                        message: "Record with id ${oid} not found"
                    }
                }
            }

            const { result, err } = await this.krsRepository.deleted(resultFind, oid);
            if (err != null) {
                return {
                    krs: null, err: err
                }
            }

            const krsVm = result ? toKrsResponse(result) : null;
            return { krs: krsVm, err: null };
        } catch (err) {
            return { krs: null, err };
        }

    }

    async findAll(): Promise<{ krss: KrsVm[] | null; err: any }> {
        try {
            const { result, err } = await this.krsRepository.findAll();

            if (err != null) {
                return {
                    krss: null, err: err
                }
            }
            const krss = result ?  toKrsResponses(result) : null;
            return { krss, err: null }
        } catch (err) {
            return { krss: null, err }
        }
    }

    async findById(oid: string): Promise<{ krs: KrsVm | null; err: any }> {
        try {
            const { result, err } = await this.krsRepository.findById(oid);
            const krsVm = result ? toKrsResponse(result) : null;
            return { krs: krsVm, err: null }
        } catch (err) {
            return { krs: null, err }
        }


    }

    async findPage( page: number, pageSize: number,condition:FilterKrsDto): Promise<{ krss: KrsVm[], total: number, err: any }> {
        try {
            const { result: resultCount, err: errCount } = await this.krsRepository.findCountByCriteria(condition);
            if (errCount) {
                return { krss: [], total: 0, err: errCount }
            }

            const { result, err } = await this.krsRepository.findByCriteriaPage(condition, page, pageSize);
            if (err) {
                return { krss: [], total: 0, err }
            }
            const krsVm = toKrsResponses(result ?? []);
            return { krss: krsVm, total: resultCount, err: err };
        } catch (err) {
            return { krss: [], total: 0, err }
        }
    }

}
