import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { DestinationModel } from "./destination.model";

/**
 * The datatype that represents the quote that the user has built up for a client.
 * 
 * TODO: Add contact details, and an estimation field (money)
 */
@Entity({ schema: 'app', name: 'quotes' })
export class QuoteModel {

  public id: string;

  public name: string;

  @ManyToOne(() => DestinationModel)
  @JoinColumn({ name: 'destination_id', referencedColumnName: 'id' })
  public destination: DestinationModel;

  @Column({ name: 'destination_id', type: 'uuid' })
  public destinationId: string;

  @Column({ name: 'departure_date', type: 'datetime' })
  public departureDate: Date;

  @Column({ name: 'return_date', type: 'datetime' })
  public returnDate: Date;

  @Column({ name: 'travel_method', type: 'varchar' })
  public travelMethod: string;
}
