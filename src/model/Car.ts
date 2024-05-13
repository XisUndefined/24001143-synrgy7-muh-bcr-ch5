import {
  Model,
  Column,
  Table,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  DataType,
  Default,
  Unique,
} from "sequelize-typescript";

@Table
export class Car extends Model<Car> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  public id!: string;

  @Unique({
    name: "plate",
    msg: "This plate number is already exist!",
  })
  @Column({
    type: DataType.STRING(10),
    validate: {
      isPlate(value: string) {
        const plateRegex = /^[A-Z]{1,2}\s?\d{1,4}\s?[A-Z]{0,3}$/;
        if (!plateRegex.test(value)) {
          throw new Error("Invalid car plate format");
        }
      },
    },
  })
  public plate!: string;

  @Column
  public transmission!: string;

  @Column
  public manufacturre!: string;

  @Column
  public model!: string;

  @Column
  public year!: number;

  @Column({
    field: "driver_service",
  })
  public driverService!: boolean;

  @Column
  public image!: string;

  @Column({
    field: "rent_per_day",
  })
  public rentPerDay!: number;

  @Column
  public capacity!: number;

  @Column(DataType.TEXT)
  public description!: string;

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
