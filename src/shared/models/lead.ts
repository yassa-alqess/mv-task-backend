import { Table, Model, Column, DataType } from 'sequelize-typescript';

@Table({ schema: 'public', timestamps: true })
class Lead extends Model {
    @Column({
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    declare leadId: string;

    @Column({
        type: DataType.STRING(200),
    })
    declare fullName: string;

    @Column({
        type: DataType.STRING(200),
        validate: {
            isEmail: true,
        },
    })
    declare email: string;

    @Column({
        type: DataType.STRING(11),
    })
    declare phone: string;

    @Column({
        type: DataType.STRING(14),
    })
    declare nid: string;
}

export default Lead;