import { Exclude, Expose } from "class-transformer";
import { IsString, MaxLength } from "class-validator/types/decorator/decorators";

@Exclude()
export class CreateUpdateDestinationDTO {
  @Expose()
  @IsString()
  @MaxLength(256)
  public name: string;
}
