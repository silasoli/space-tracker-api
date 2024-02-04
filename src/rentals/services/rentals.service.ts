import { Injectable } from '@nestjs/common';
import { CreateRentalDto } from '../dto/create-rental.dto';
import { UpdateRentalDto } from '../dto/update-rental.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Rental, RentalDocument } from '../schemas/rental.entity';
import { FilterQuery, Model } from 'mongoose';
import { ERRORS } from '../../common/utils/constants/errors';
import { isValidCPF } from '../../common/utils/validators/IsValidCPF';
import { RentalResponseDto } from '../dto/rental-response.dto';
import { DatesRentalResponseDto } from '../dto/dates-rentals-response.dto';
import { RentalQueryDto } from '../dto/rental-query.dto';
import { MailerService } from '../../mailer/services/mailer.service';
import { ConfigService } from '@nestjs/config';
import { FormatUtil } from '../../common/utils/formatters/format.util';
import { SendMailWithTemplateDto } from '../../mailer/dto/send-mail-with-template.dto';

@Injectable()
export class RentalsService {
  constructor(
    @InjectModel(Rental.name)
    private rentalModel: Model<RentalDocument>,
    private readonly mailerService: MailerService,
    private readonly config: ConfigService,
  ) {}

  private transformBody(dto: CreateRentalDto | UpdateRentalDto): void {
    if (dto.checkInDate) {
      dto.checkInDate = new Date(dto.checkInDate);
      dto.checkInDate.setUTCHours(8, 0, 0, 0);
    }

    if (dto.checkOutDate) {
      dto.checkOutDate = new Date(dto.checkOutDate);
      dto.checkOutDate.setUTCHours(22, 0, 0, 0);
    }
  }

  private async findRentalByID(_id: string): Promise<Rental> {
    const user = await this.rentalModel.findById(_id);

    if (!user) throw ERRORS.RENTALS.NOT_FOUND;

    return user;
  }

  private generateDateArray(dto: CreateRentalDto | UpdateRentalDto): Date[] {
    const dateArray: Date[] = [];

    for (
      let currentDate = new Date(dto.checkInDate);
      currentDate <= new Date(dto.checkOutDate);
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      dateArray.push(new Date(currentDate));
    }
    return dateArray;
  }

  private validateDates(checkInDate: Date, checkOutDate: Date): void {
    if (checkOutDate < checkInDate) throw ERRORS.RENTALS.PREVIOUS_CHECKIN;

    if (checkInDate.toDateString() === new Date().toDateString())
      throw ERRORS.RENTALS.ADVANCE_CHECKIN;

    const timeDifference = checkOutDate.getTime() - checkInDate.getTime();
    const differenceInDays = timeDifference / (1000 * 3600 * 24);

    if (differenceInDays > 3) throw ERRORS.RENTALS.RENTAL_LIMIT;
  }

  private async checkAvailability(
    dto: CreateRentalDto | UpdateRentalDto,
    dates: Date[],
    excludeId?: string,
  ): Promise<void> {
    const query: FilterQuery<Rental> = {
      $or: [
        {
          checkInDate: { $eq: dto.checkOutDate },
          checkOutDate: { $eq: dto.checkInDate },
        },
        {
          dates: {
            $in: dates,
          },
        },
      ],
    };

    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const rental = await this.rentalModel.find(query);

    if (rental.length !== 0) throw ERRORS.RENTALS.RENTAL_CONFLICT;
  }

  private async sendCreationNotification(rental: Rental): Promise<void> {
    const name = FormatUtil.capitalizeFirst(rental.name);

    const dto: SendMailWithTemplateDto = {
      emailAddress: this.config.get('MAIL_RENTAL_NOTIFICATION'),
      title: `Nova reserva confirmada de: ${name}`,
    };

    const context = {
      name,
      document: FormatUtil.formatCPF(rental.document),
      phone: FormatUtil.formatPhone(rental.phone),
      checkInDate: FormatUtil.toPTBRDateString(rental.checkInDate),
      checkOutDate: FormatUtil.toPTBRDateString(rental.checkOutDate),
    };

    await this.mailerService.sendEmailWithTemplate(
      dto,
      context,
      'rental-notification',
    );
  }

  public async create(dto: CreateRentalDto): Promise<RentalResponseDto> {
    isValidCPF(dto.document);

    this.transformBody(dto);

    this.validateDates(dto.checkInDate, dto.checkOutDate);

    const dates = this.generateDateArray(dto);

    await this.checkAvailability(dto, dates);

    const created = await this.rentalModel.create({
      ...dto,
      dates,
      createdAt: new Date(),
    });

    await this.sendCreationNotification(created);

    return new RentalResponseDto(created);
  }

  public async findAll(query: RentalQueryDto): Promise<RentalResponseDto[]> {
    const filters: FilterQuery<Rental> = {};

    if (query.finishedRent) {
      const currentDate = new Date();
      currentDate.setHours(19, 0, 0, 0);

      filters.checkOutDate = { $lt: currentDate };
    }

    const rentals = await this.rentalModel.find(filters);

    return rentals.map((rental) => new RentalResponseDto(rental));
  }

  public async findUnavailableDates(): Promise<DatesRentalResponseDto[]> {
    const rentals = await this.rentalModel.find({}, ['dates']);

    return rentals.map((rental) => new DatesRentalResponseDto(rental));
  }

  public async findOne(_id: string): Promise<RentalResponseDto> {
    const rental = await this.findRentalByID(_id);

    return new RentalResponseDto(rental);
  }

  public async update(
    _id: string,
    dto: UpdateRentalDto,
  ): Promise<RentalResponseDto> {
    const rental = await this.findRentalByID(_id);

    if (dto.document) isValidCPF(dto.document);

    this.transformBody(dto);

    this.validateDates(dto.checkInDate, dto.checkOutDate);

    const dates = this.generateDateArray(dto);

    await this.checkAvailability(dto, dates, rental._id.toString());

    await this.rentalModel.updateOne(
      { _id },
      { ...dto, dates, updatedAt: new Date() },
    );

    return this.findOne(_id);
  }

  public async remove(_id: string): Promise<void> {
    await this.findRentalByID(_id);
    await this.rentalModel.deleteOne({ _id });
  }
}
