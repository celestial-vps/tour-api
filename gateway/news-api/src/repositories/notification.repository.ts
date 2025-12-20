import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsWhere,
  Like,
  QueryRunner,
  Repository,
} from 'typeorm';
import { Notification } from '../models/notification.entity';
import { FilterNotificationDto } from '../dtos/payload-notification-dto';

@Injectable()
export class NotificationRepository {
  constructor(
    @InjectRepository(Notification)
    private readonly repo: Repository<Notification>,
  ) {}

  /* =======================
   * WRITE (TRANSACTIONAL)
   * ======================= */

  async save(notification: Notification, queryRunner: QueryRunner): Promise<Notification> {
    try {
      return await queryRunner.manager.save(Notification, notification);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error saving notification: ' + error.message,
      );
    }
  }

  async update(
    oid: string,
    notification: Partial<Notification>,
    queryRunner: QueryRunner,
  ): Promise<Notification> {
    try {
      const result = await queryRunner.manager.update(
        Notification,
        { oid },
        notification,
      );

      if (result.affected === 0) {
        throw new NotFoundException(`Notification with OID ${oid} not found`);
      }

      return await queryRunner.manager.findOneOrFail(Notification, {
        where: { oid },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error updating notification: ' + error.message,
      );
    }
  }

  async delete(oid: string, queryRunner: QueryRunner): Promise<void> {
    try {
      const result = await queryRunner.manager.softDelete(
        Notification,
        { oid },
      );

      if (result.affected === 0) {
        throw new NotFoundException(`Notification with OID ${oid} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error deleting notification: ' + error.message,
      );
    }
  }

  /* =======================
   * READ (NON TRANSACTION)
   * ======================= */

  async findAll(): Promise<Notification[]> {
    return this.repo.find();
  }

  async findById(oid: string): Promise<Notification> {
    const notification = await this.repo.findOne({
      where: { oid },
      // relations: { branches: true },
    });

    if (!notification) {
      throw new NotFoundException(`Notification with OID ${oid} not found`);
    }

    return notification;
  }

  async findByCriteriaPage(
    page: number,
    pageSize: number,
    condition: FilterNotificationDto,
  ): Promise<{ notifications: Notification[]; count: number }> {
    const where = this.buildFilter(condition);

    const [notifications, count] = await this.repo.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { title: 'ASC' },
    });

    return { notifications, count };
  }

  async findCountByCriteria(
    condition: FilterNotificationDto,
  ): Promise<number> {
    const where = this.buildFilter(condition);
    return this.repo.count({ where });
  }

  async advanceFilter(
    condition: FilterNotificationDto,
  ): Promise<Notification[]> {
    const where = this.buildFilter(condition);

    return this.repo.find({
      where,
      order: { title: 'ASC' },
    });
  }

  /* =======================
   * PRIVATE HELPER
   * ======================= */

  private buildFilter(
    condition: FilterNotificationDto,
  ): FindOptionsWhere<Notification> {
    const where: FindOptionsWhere<Notification> = {};
 

    if (condition.title) {
      where.title = Like(`%${condition.title}%`);
    }

    return where;
  }
}
