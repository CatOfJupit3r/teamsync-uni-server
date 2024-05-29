import { getModelForClass, prop } from '@typegoose/typegoose'
import {Types} from "mongoose";

export class UserClass {
    @prop({ required: true })
    hashedPassword: string

    @prop({ required: true })
    handle: string

    @prop({ required: true })
    name: string

    @prop({ required: true })
    createdAt: Date

    @prop()
    _id: Types.ObjectId
}

export const UserModel = getModelForClass(UserClass, {
    schemaOptions: { collection: 'users' },
})
