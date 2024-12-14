import {
    Table,
    Model,
    Column,
    DataType,
    BelongsToMany,
} from 'sequelize-typescript';
import UserRole from './user-role';
import User from './user';
import { RoleEnum } from '../enums';

//3rd party imports
import * as _ from "lodash";
const roles: string[] = _.values(RoleEnum);

@Table({ schema: 'public', timestamps: true })
class Role extends Model {
    @Column({
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    declare roleId: string;

    @Column({
        type: DataType.ENUM({
            values: roles
        }),

        validate: {
            isIn: [roles]
        },
    })
    declare name: RoleEnum;

    @BelongsToMany(() => User, () => UserRole)
    declare users: User[];
}

export default Role;