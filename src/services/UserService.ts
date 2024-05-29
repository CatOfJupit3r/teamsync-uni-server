import bcrypt from 'bcrypt'
import { omit } from 'lodash'
import { Types } from 'mongoose'
import { UserClass } from '../models/DatabaseModels'
import { Forbidden, NotFound } from '../models/ErrorModels'
import AuthService from './AuthService'
import DatabaseService from './DatabaseService'

class UserService {
    #privateFields = ['hashedPassword']

    #omitPrivateFields = (user: any) => omit(user, this.#privateFields)

    async createAccount({ handle, password }: { handle: string; password: string }) {
        const user = await this.findByHandle(handle, false)
        if (user) throw new Error(`User with handle ${handle} is already registered`)

        const hashedPassword = await bcrypt.hash(password, 10)

        const _id = await DatabaseService.createNewUser(handle, hashedPassword)

        console.log(`Registered new user with handle: ${handle}. Id: ${_id}`)
    }

    async loginWithPassword({ handle, password }: { handle: string; password: string }) {
        const user = (await this.findByHandle(handle, true)) as UserClass

        if (!user) throw new NotFound('User not found')

        const isPasswordCorrect = await bcrypt.compare(password, user.hashedPassword)
        if (!isPasswordCorrect) throw new Forbidden('Incorrect password')

        const userWithoutPrivateFields = this.#omitPrivateFields(user)

        const accessToken = AuthService.generateAccessToken(
            userWithoutPrivateFields as { _id: Types.ObjectId; handle: string }
        )
        const refreshToken = AuthService.generateRefreshToken(
            userWithoutPrivateFields as { _id: Types.ObjectId; handle: string }
        )

        return { accessToken, refreshToken, user: userWithoutPrivateFields }
    }

    loginWithRefreshToken(refreshToken: string) {
        const accessToken = AuthService.issueNewAccessToken(refreshToken)
        return { accessToken }
    }

    logout(refreshToken: string) {
        AuthService.invalidateRefreshToken(refreshToken)
    }

    async getProfile(token: string): Promise<{
        name: string
        handle: string
        createdAt: Date
    }> {
        const decoded = AuthService.verifyAccessToken(token)
        const user = await DatabaseService.getUser(decoded._id)
        if (!user) throw new NotFound('User not found')
        const { name, handle, createdAt } = user
        return {
            name,
            handle,
            createdAt,
        }
    }

    async findById(_id: string, shouldIncludePrivateFields: boolean) {
        const user = await DatabaseService.getUser(_id)
        if (!user) return null
        if (shouldIncludePrivateFields) return user
        return this.#omitPrivateFields(user)
    }

    async findByHandle(handle: string, shouldIncludePrivateFields: boolean) {
        const user = await DatabaseService.getUserByHandle(handle)
        if (!user) {
            return null
        }
        if (shouldIncludePrivateFields) {
            return user
        }
        return this.#omitPrivateFields(user)
    }
}

export default new UserService()
