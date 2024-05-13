import {
  Model,
  Column,
  Table,
  PrimaryKey,
  DataType,
} from "sequelize-typescript";

@Table({
  timestamps: false,
})
export class Category extends Model<Category> {
  @PrimaryKey
  @Column
  public id!: number;

  @Column(DataType.ENUM("small", "medium", "large"))
  public category!: string;
}
