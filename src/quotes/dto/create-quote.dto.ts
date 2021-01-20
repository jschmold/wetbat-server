import { Exclude, Expose } from "class-transformer";
import { IsDate, IsOptional, IsString, IsUUID } from "class-validator";

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
  public destinationId: string;

  @Expose()
  @IsDate()
  public departureDate: Date;

  @Expose()
  @IsDate()
  public returnDate: Date;

  @Expose()
  @IsOptional()
  @IsString()
  public travelMethod: string;
  
  public get datesAreValid(): boolean {
    const ddate = this.departureDate.getTime();
    const rdate = this.returnDate.getTime();
    return ddate > Date.now() && rdate > Date.now();
  }

}
