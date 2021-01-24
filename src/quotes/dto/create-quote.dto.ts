import { Exclude, Expose, Type } from "class-transformer";
import { IsDate, IsEmail, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";

/**
 * The datatype responsible for ensuring that at the bare minimum, the user is giving us
 * the correct kinds of information. The service will ensure that the dates are in the future
 * by checking against `datesAreValid` and returning a BadRequest if they're in the past.
 */
@Exclude()
export class CreateQuoteDTO {
  @Expose()
  @IsString()
  public name: string;

  @Expose()
  @IsUUID()
  public fromId: string;

  @Expose()
  @IsUUID()
  public destinationId: string;

  @Expose()
  @IsDate()
  @Type(() => Date)
  public departureDate: Date;

  @Expose()
  @IsDate()
  @Type(() => Date)
  public returnDate: Date;

  @Expose()
  @IsOptional()
  @IsString()
  public travelMethod: string;

  @Expose()
  @IsOptional()
  @IsString()
  @IsEmail()
  public email: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(16)
  public phone: string;
  
  public get datesAreValid(): boolean {
    if (!this.departureDate || !this.returnDate) return false;

    const ddate = this.departureDate.getTime();
    const rdate = this.returnDate.getTime();
    return ddate > Date.now() && rdate > Date.now();
  }

}
