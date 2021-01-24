import { Exclude, Expose } from "class-transformer";
import {IsOptional, IsString, IsUUID, IsDate, IsEmail, MaxLength} from "class-validator";

/**
 * this datatype is responsible for ensuring that the user is correctly trying
 * to update a quote model. Check if the dates are valid BEFORE passing this
 * to a service.
 */
@Exclude()
export class UpdateQuoteDTO {
  @Expose()
  @IsOptional()
  @IsString()
  public name?: string;

  @Expose()
  @IsUUID()
  @IsOptional()
  public fromId: string;

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

  @Expose()
  @IsOptional()
  @IsString()
  @IsEmail()
  public email: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  public phone: string;
  
  public get datesAreValid(): boolean {
    const dates = [ this.departureDate, this.returnDate ].filter(a => !!a);
    return dates.length > 0
      ? dates.every(a => a.getTime() > Date.now())
      : true;
  }

}
