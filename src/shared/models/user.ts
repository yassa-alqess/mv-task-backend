import { Table, Model, Column, DataType, BelongsToMany, AllowNull, HasMany } from 'sequelize-typescript';
import RefreshToken from './refresh-token';
import Role from './role';
import UserRole from './user-role';
import { IsLockedEnum, IsVerifiedEnum } from '../enums';

//3rd party dependinces
import * as _ from "lodash";

const isVerifiedEnumStatuses: string[] = _.values(IsVerifiedEnum);
const isLockedEnumStatuses: string[] = _.values(IsLockedEnum);

@Table({ schema: 'public', timestamps: true })
class User extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare userId: string;

  @Column({
    type: DataType.STRING(200),

  })
  declare username: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(200),
    unique: true,
    validate: {
      isEmail: true,
    },
  })
  declare email: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(20),
  })
  declare phone: string;

  @Column({
    type: DataType.STRING(200),
  })
  declare password: string;

  @Column({
    type: DataType.ENUM({
      values: isVerifiedEnumStatuses
    }),

    validate: {
      isIn: [isVerifiedEnumStatuses]
    },
  })
  declare isVerified: IsVerifiedEnum;

  @Column({
    type: DataType.ENUM({
      values: isLockedEnumStatuses
    }),

    validate: {
      isIn: [isLockedEnumStatuses]
    },
  })
  declare isLocked: IsLockedEnum;

  @HasMany(() => RefreshToken)
  declare refreshTokens: RefreshToken[];

  @BelongsToMany(() => Role, () => UserRole)
  declare roles: Role[];
}

export default User;
