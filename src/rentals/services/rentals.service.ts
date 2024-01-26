import { Injectable } from '@nestjs/common';
import { CreateRentalDto } from '../dto/create-rental.dto';
import { UpdateRentalDto } from '../dto/update-rental.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Rental, RentalDocument } from '../schemas/rental.entity';
import { Model } from 'mongoose';
import { ERRORS } from 'src/common/utils/constants/errors';
import { isValidCPF } from '../../common/utils/validators/IsValidCPF';

@Injectable()
export class RentalsService {
  constructor(
    @InjectModel(Rental.name)
    private rentalModel: Model<RentalDocument>,
  ) {}

  private async transformBody(dto: CreateRentalDto) {
    if (dto.checkInDate) new Date(dto.checkInDate).setHours(8, 0, 0, 0);

    if (dto.checkOutDate) new Date(dto.checkOutDate).setHours(22, 0, 0, 0);
  }

  private async findRentalByID(_id: string): Promise<Rental> {
    const user = await this.rentalModel.findById(_id);

    if (!user) throw ERRORS.RENTALS.NOT_FOUND;

    return user;
  }

  private async generateDateArray(dto: CreateRentalDto): Promise<Date[]> {
    const startDate = new Date(dto.checkInDate);
    const endDate = new Date(dto.checkOutDate);
    const dateArray: Date[] = [];

    for (
      let currentDate = startDate;
      currentDate <= endDate;
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      dateArray.push(new Date(currentDate));
    }
    return dateArray;
  }

  private validateDates(dto: CreateRentalDto): void {
    const checkInDate = new Date(dto.checkInDate);
    const checkOutDate = new Date(dto.checkOutDate);

    if (dto.checkOutDate < dto.checkInDate)
      throw ERRORS.RENTALS.PREVIOUS_CHECKIN;

    if (checkInDate.toDateString() === new Date().toDateString())
      throw ERRORS.RENTALS.ADVANCE_CHECKIN;

    const timeDifference = checkOutDate.getTime() - checkInDate.getTime();
    const differenceInDays = timeDifference / (1000 * 3600 * 24);

    if (differenceInDays > 3) throw ERRORS.RENTALS.RENTAL_LIMIT;
  }

  public async create(dto: CreateRentalDto): Promise<Rental> {
    isValidCPF(dto.document);

    await this.transformBody(dto);

    this.validateDates(dto);

    const dates = await this.generateDateArray(dto);

    const created = await this.rentalModel.create({ ...dto, dates });

    return created;
    // return new UserResponseDto(created);
  }

  public async findAll(): Promise<Rental[]> {
    const users = await this.rentalModel.find();

    return users;

    // return users.map((user) => new UserResponseDto(user))
  }

  public async findOne(_id: string): Promise<Rental> {
    const user = await this.findRentalByID(_id);

    return user;

    // return new UserResponseDto(user);
  }

  public async update(_id: string, dto: UpdateRentalDto): Promise<Rental> {
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
