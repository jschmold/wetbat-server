import { Exclude, Expose } from "class-transformer";
import { IsString, Length, MaxLength } from "class-validator";

@Exclude()
export class CreateUpdateDestinationDTO {

  @Expose()
  @IsString()
  @Length(3)
  public airportCode: string;

  @Expose()
  @IsString()
  @MaxLength(256)
  public country: string;

  @Expose()
  @IsString()
  @MaxLength(256)
  public name: string;
  
}
