import { Exclude, Expose } from "class-transformer";
import { IsOptional, IsString, Length, MaxLength } from "class-validator";

@Exclude()
export class UpdateDestinationDTO {

  @Expose()
  @IsString()
  @IsOptional()
  @Length(3)
  public airportCode?: string;

  @Expose()
  @IsString()
  @IsOptional()
  @MaxLength(256)
  public country?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(256)
  public name?: string;
  
  
}
