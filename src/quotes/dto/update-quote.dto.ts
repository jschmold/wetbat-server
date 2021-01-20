import { Exclude, Expose } from "class-transformer";
import {IsOptional, IsString, IsUUID, IsDate} from "class-validator";

@Exclude()
export class UpdateQuoteDTO {
  @Expose()
  @IsOptional()
  @IsString()
  public name?: string;

  @Expose()
  @IsOptional()
  @IsUUID()
  public destinationId?: string;

  @Expose()
  @IsOptional()
  @IsDate()
  public departureDate?: Date;

  @Expose()
  @IsOptional()
  @IsDate()
  public returnDate?: Date;

  @Expose()
  @IsOptional()
  @IsString()
  public travelMethod?: string;
  
  public get datesAreValid(): boolean {
    if (!this.departureDate || !this.returnDate) return false;

    const ddate = this.departureDate.getTime();
    const rdate = this.returnDate.getTime();
    return ddate > Date.now() && rdate > Date.now();
  }

}
