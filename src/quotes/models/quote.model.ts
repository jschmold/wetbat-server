import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { DestinationModel } from "@app/destinations/models/destination.model";

/**
 * The datatype that represents the quote that the user has built up for a client.
 * 
 * TODO: Add contact details, and an estimation field (money)
 */
@Entity({ schema: 'app', name: 'quotes' })
export class QuoteModel {

  @PrimaryColumn('uuid')
  public id: string;

  @Column({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamptz' })
  public updatedAt: Date;

  @Column({ type: 'varchar', length: 256 })
  public name: string;

  @Column({ type: 'varchar', length: 128 })
  public email: string;

  @ManyToOne(() => DestinationModel)
  @JoinColumn({ name: 'destination_id', referencedColumnName: 'id' })
  public destination?: DestinationModel;

  @Column({ name: 'destination_id', type: 'uuid' })
  public destinationId: string;

  @Column({ name: 'departure_date', type: 'timestamptz' })
  public departureDate: Date;

  @Column({ name: 'from_id', type: 'uuid' })
  public fromId: string;

  @ManyToOne(() => DestinationModel)
  @JoinColumn({ name: 'from_id', referencedColumnName: 'id' })
  public from?: DestinationModel;

  @Column({ name: 'return_date', type: 'timestamptz' })
  public returnDate: Date;

  @Column({ name: 'travel_method', type: 'varchar' })
  public travelMethod: string | null;
}
