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
  BeforeCreate,
  BeforeUpdate,
  BeforeValidate,
  HasMany,
} from "sequelize-typescript";
import bcrypt from "bcrypt";
import crypto from "node:crypto";

@Table
export class User extends Model<User> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  public id!: string;

  @Column({
    type: DataType.STRING(50),
    validate: {
      len: {
        args: [1, 50],
        msg: "Firstname can't be longer than 50 characters.",
      },
    },
  })
  public firstname!: string;

  @Column({
    type: DataType.STRING(50),
    validate: {
      len: {
        args: [0, 50],
        msg: "Lastname can't be longer than 50 characters.",
      },
    },
  })
  public lastname?: string;

  @Unique({
    name: "email",
    msg: "This email address is already exist",
  })
  @Column({
    validate: {
      isEmail: {
        msg: "Invalid email address. Please insert a valid email address",
      },
    },
  })
  public email!: string;

  @Column({
    validate: {
      isLongEnough(value: string) {
        if (value.length < 8) {
          throw new Error("The password must be at least 8 characters long.");
        }
      },
      hasNumber(value: string) {
        if (!/[0-9]/.test(value)) {
          throw new Error("The password must contain at least one number.");
        }
      },
      hasUppercase(value: string) {
        if (!/[A-Z]/.test(value)) {
          throw new Error(
            "The password must contain at least one uppercase letter."
          );
        }
      },
      hasLowercase(value: string) {
        if (!/[a-z]/.test(value)) {
          throw new Error(
            "The password must contain at least one lowercase letter."
          );
        }
      },
      hasSpecialCharacter(value: string) {
        if (
          !/[\!\@\#\$\%\^\&\*\(\)\_\+\-\=\[\]\{\}\;\:\'\"\,\<\.\>\/\?\|\\]/.test(
            value
          )
        ) {
          throw new Error(
            "The password must contain at least one special character."
          );
        }
      },
    },
  })
  public password!: string;

  @Column({
    type: DataType.VIRTUAL,
    validate: {
      isMatch(value: string) {
        if (value !== this.password) {
          throw new Error("Password confirmation does not match password");
        }
      },
    },
  })
  public confirmPassword?: string;

  @Column
  public avatar!: string;

  @Default("user")
  @Column(DataType.ENUM("user", "admin"))
  public role!: string;

  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
    field: "password_changed_at",
  })
  public passwordChangedAt?: Date;

  @Column({
    field: "password_token",
  })
  public passwordToken?: string;

  @Column({
    type: DataType.DATE,
    field: "password_token_expires",
  })
  public passwordTokenExpires?: Date;

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

  // @HasMany(() => Order)
  // public orders?: Order[];

  @BeforeCreate
  static hashPassword = async (user: User) => {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 12);
    }
  };

  @BeforeUpdate
  static checkPasswordChanged = async (user: User) => {
    if (user.changed("password")) {
      user.password = await bcrypt.hash(user.password, 12);
    }
  };

  @BeforeValidate
  static addAvatar = (user: User) => {
    if (!user.avatar) {
      if (user.lastname) {
        user.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
          user.firstname
        )}+${encodeURIComponent(user.lastname)}&size=128`;
      } else {
        user.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
          user.firstname
        )}&size=128`;
      }
    }
  };

  public compareInDb = async (str: string, strDB: string): Promise<boolean> => {
    return await bcrypt.compare(str, strDB);
  };

  public compareTimestamp = async (
    varTimestamp: number,
    dbTimestamp: Date
  ): Promise<boolean> => {
    const changedTimestamp = dbTimestamp.getTime() / 1000;
    return varTimestamp < changedTimestamp;
  };

  public createPwdToken = async (): Promise<string> => {
    const resetToken = crypto.randomBytes(32).toString("hex");

    this.passwordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    this.passwordTokenExpires = new Date(Date.now() + 10 * 60 * 1000);

    return resetToken;
  };
}
