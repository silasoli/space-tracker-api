import { Injectable } from '@nestjs/common';
import { CreateRentalDto } from '../dto/create-rental.dto';
import { UpdateRentalDto } from '../dto/update-rental.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Rental, RentalDocument } from '../schemas/rental.entity';
import { Model } from 'mongoose';
import { ERRORS } from '../../common/utils/constants/errors';
import { isValidCPF } from '../../common/utils/validators/IsValidCPF';
import { RentalResponseDto } from '../dto/rental-response.dto';

@Injectable()
export class RentalsService {
  constructor(
    @InjectModel(Rental.name)
    private rentalModel: Model<RentalDocument>,
  ) {}

  private transformBody(dto: CreateRentalDto): void {
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

  private generateDateArray(checkInDate: Date, checkOutDate: Date): Date[] {
    const dateArray: Date[] = [];

    for (
      let currentDate = checkInDate;
      currentDate <= checkOutDate;
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

  public async create(dto: CreateRentalDto): Promise<RentalResponseDto> {
    isValidCPF(dto.document);

    this.transformBody(dto);

    this.validateDates(dto.checkInDate, dto.checkOutDate);

    const dates = this.generateDateArray(dto.checkInDate, dto.checkOutDate);

    const created = await this.rentalModel.create({ ...dto, dates });

    return new RentalResponseDto(created);
  }

  public async findAll(): Promise<RentalResponseDto[]> {
    const rentals = await this.rentalModel.find();

    return rentals.map((rental) => new RentalResponseDto(rental));
  }

  public async findOne(_id: string): Promise<RentalResponseDto> {
    const rental = await this.findRentalByID(_id);

    return new RentalResponseDto(rental);
  }

  public async update(
    _id: string,
    dto: UpdateRentalDto,
  ): Promise<RentalResponseDto> {
    await this.findRentalByID(_id);

    const rawData = { ...dto };

    await this.rentalModel.updateOne({ _id }, rawData);

    return this.findOne(_id);
  }

  public async remove(_id: string): Promise<void> {
    await this.findRentalByID(_id);
    await this.rentalModel.deleteOne({ _id });
  }
}
