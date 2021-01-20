import { Column, Entity, PrimaryColumn } from "typeorm";

/**
 * The destination model is partially the type that the user will receive data from to select in
 * the dropdown for creating a quote, and partially as a way to avoid bunk data by keeping that
 * relationship alive. Note that deleting destinations is NOT going to be supported, and instead,
 * a flag should be added that says "available" instead. We don't want null references in our data.
 *
 * TODO: Add the available flag
 */
@Entity({ schema: 'app', name: 'destinations' })
export class DestinationModel {

  @PrimaryColumn('uuid')
  public id: string;

  @Column({ name: 'airport_code', type: 'varchar', length: 3 })
  public airportCode: string;
  
  @Column({ type: 'varchar', length: 256 })
  public country: string;

  @Column({ type: 'varchar', length: 256 })
  public name: string;

  @Column({ name: 'created_at', type: 'timestamptz', nullable: false })
  public createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamptz', nullable: false })
  public updatedAt: Date;
}
