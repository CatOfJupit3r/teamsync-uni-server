import { getModelForClass, prop } from '@typegoose/typegoose'
import { Types } from 'mongoose'

export class UserOnProjectClass {
    @prop({ required: true })
    userId: string

    @prop({ required: true, type: () => String })
    role: 'owner' | 'manager' | 'participant' | 'viewer'
}

export class Task {
    @prop({ required: true })
    name: string

    @prop({ required: true })
    description: string

    @prop({ required: true })
    dueDate: Date

    @prop({ required: true })
    completed: boolean

    @prop({ required: true, type: () => [String] })
    responsibleUsers: Array<string>

    @prop( { required: false } )
    _id: Types.ObjectId
}

export class ProjectClass {
    @prop()
    _id: Types.ObjectId

    @prop({ required: true })
    name: string

    @prop({ default: 'Wow... No description?...' })
    description: string

    @prop({ required: true })
    createdAt: Date

    @prop({
        required: true,
        type: () => [UserOnProjectClass],
        default: [],
        _id: false,
    })
    users: Array<UserOnProjectClass>

    @prop({ required: true, type: () => [Task], default: [] })
    tasks: Array<Task>

    @prop({ type: () => [String], default: [] })
    inviteCodes: Array<string>
}

export const ProjectModel = getModelForClass(ProjectClass, {
    schemaOptions: { collection: 'projects' },
})
