import {
  Model,
  Column,
  Table,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  DataType,
  Default,
} from "sequelize-typescript";

@Table
export class Order extends Model<Order> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  public id!: string;

  @Column(DataType.ENUM("pending", "process", "completed"))
  public status!: string;

  @Column
  public price!: number;

  @Column({
    type: DataType.DATE,
    field: "start_rent",
    validate: {
      isAfter: {
        args: new Date().toISOString().slice(0, 10),
        msg: "Start date mush be future date.",
      },
    },
  })
  public startRent?: Date;

  @Column({
    type: DataType.DATE,
    field: "finish_rent",
    validate: {
      isMaximumSevenDays(value: Date) {
        const startRentValue = new Date(this.startRent as Date);
        const sevenDaysLater = new Date(startRentValue);
        sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

        if (new Date(value) > sevenDaysLater) {
          throw new Error(
            "Finish rent date must be within 7 days of start rent date."
          );
        }
      },
    },
  })
  public finishRent?: Date;

  @CreatedAt
  @Default(DataType.NOW)
  @Column({
    field: "created_at",
  })
  public createdAt!: Date;

  @UpdatedAt
  @Default(DataType.NOW)
  @Column({
    field: "updated_at",
  })
  public updatedAt!: Date;
}
