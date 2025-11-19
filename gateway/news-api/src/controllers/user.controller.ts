import { Controller, Get, Post, Body, Param, Put, Delete, ForbiddenException, BadRequestException, HttpStatus, Res, Req, Query } from '@nestjs/common';
import { BankService } from '../services/bank.service';
import { Bank } from '../models/bank.entity';
import { CreateBankDto, FilterBankDto, UpdateBankDto } from '../dtos/payload-bank-dto';
import { MessageVm } from '../mappings/message-vm';
import { BankVm } from '../mappings/bank-vm';
import { ResponseService } from '../common/build.response';
import { Response } from 'express';

@Controller('user')
export class UserController {
 
}
