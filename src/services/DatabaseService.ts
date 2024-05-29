import {DocumentType} from '@typegoose/typegoose'
import mongoose, {Types} from 'mongoose'
import {InternalServerError} from '../models/ErrorModels'
import {UserClass, UserModel} from '../models/userModel'

class DatabaseService {
    public connect = async (): Promise<void> => {
        await mongoose.connect('mongodb://localhost:27017/gameDB')
    }

    private saveDocument = async (
        document: DocumentType<UserClass>
    ) => {
        try {
            await document.save({
                validateBeforeSave: true,
            })
        } catch (e) {
            console.log(`Validation failed for creation of ${document.baseModelName}`, e)
            throw new InternalServerError()
        }
    }

    public getUser = async (userId: string): Promise<UserClass | null> => {
        return UserModel.findOne({_id: new Types.ObjectId(userId)})
    }

    public getUserByHandle = async (handle: string): Promise<UserClass | null> => {
        return UserModel.findOne({handle})
    }

    public createNewUser = async (handle: string, hashedPassword: string): Promise<Types.ObjectId> => {
        const user = new UserModel({handle, hashedPassword, createdAt: new Date()})
        console.log('Creating user', user)
        await this.saveDocument(user)
        return user._id
    }
}

export default new DatabaseService()
