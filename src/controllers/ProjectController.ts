import { Request, Response } from 'express'
import { BadRequest } from '../models/ErrorModels'
import AuthService from '../services/AuthService'
import DatabaseService from '../services/DatabaseService'
import InputValidator from '../services/InputValidator'

class ProjectController {
    async getAllProjects(req: Request, res: Response) {
        const token = AuthService.removeBearerPrefix(req.headers.authorization as string)
        const user = AuthService.verifyAccessToken(token)

        res.json(await DatabaseService.getJoinedProjects(user._id)).status(200)
    }

    async getProjectInfo(req: Request, res: Response) {
        const { projectId } = req.params
        const token = AuthService.removeBearerPrefix(req.headers.authorization as string)
        const user = AuthService.verifyAccessToken(token)
        res.json(await DatabaseService.getProjectInfo(user._id, projectId)).status(200)
    }

    async getProjectTasks(req: Request, res: Response) {
        const { projectId } = req.params
        const token = AuthService.removeBearerPrefix(req.headers.authorization as string)
        const user = AuthService.verifyAccessToken(token)

        res.json(await DatabaseService.getProjectTasks(user._id, projectId)).status(200)
    }

    async getTaskInfo(req: Request, res: Response) {
        const { projectId, taskId } = req.params
        const token = AuthService.removeBearerPrefix(req.headers.authorization as string)
        const user = AuthService.verifyAccessToken(token)
        res.json(await DatabaseService.getTaskInfo(user._id, projectId, taskId)).status(200)
    }

    async createProject(req: Request, res: Response) {
        const { name, description } = req.body
        InputValidator.validateObject({ name, description }, { name: 'string', description: 'string' }, true)
        const token = AuthService.removeBearerPrefix(req.headers.authorization as string)
        const user = AuthService.verifyAccessToken(token)
        res.json(await DatabaseService.createProject(user._id, name, description)).status(200)
    }

    async joinProject(req: Request, res: Response) {
        const { inviteCode } = req.body
        if (!inviteCode) throw new BadRequest('Invite code is required')
        const token = AuthService.removeBearerPrefix(req.headers.authorization as string)
        const user = AuthService.verifyAccessToken(token)
        res.json(await DatabaseService.joinProject(user._id, inviteCode)).status(200)
    }

    async newInvite(req: Request, res: Response) {
        const { projectId } = req.params
        const token = AuthService.removeBearerPrefix(req.headers.authorization as string)
        const user = AuthService.verifyAccessToken(token)
        res.json({ inviteCode: await DatabaseService.newInvite(user._id, projectId) }).status(200)
    }

    async createTask(req: Request, res: Response) {
        const { name, description, assignee, dueDate } = req.body
        const { projectId } = req.params
        InputValidator.validateObject(
            { name, description, assignee, dueDate },
            { name: 'string', description: 'string', assignee: 'string', dueDate: 'string' },
            true
        )
        const token = AuthService.removeBearerPrefix(req.headers.authorization as string)
        const user = AuthService.verifyAccessToken(token)
        res.json(await DatabaseService.createTask(user._id, projectId, name, description, assignee, dueDate)).status(200)
    }

    async changeTaskStatus(req: Request, res: Response) {
        const { projectId, taskId } = req.params
        const { completed } = req.body
        InputValidator.validateField({ key: 'completed', value: completed }, 'boolean', true)
        const token = AuthService.removeBearerPrefix(req.headers.authorization as string)
        const user = AuthService.verifyAccessToken(token)
        res.json(await DatabaseService.changeTaskStatus(user._id, projectId, taskId, completed)).status(200)
    }

    async changeTaskAssignee(req: Request, res: Response) {
        const { projectId, taskId } = req.params
        const { assigneeId } = req.body
        InputValidator.validateField({ key: 'assigneeId', value: assigneeId }, 'string', true)
        const token = AuthService.removeBearerPrefix(req.headers.authorization as string)
        const user = AuthService.verifyAccessToken(token)
        res.json(await DatabaseService.changeTaskAssignee(user._id, projectId, taskId, assigneeId)).status(200)
    }

    async changeTaskDueDate(req: Request, res: Response) {
        const { projectId, taskId } = req.params
        const { dueDate } = req.body
        InputValidator.validateField({ key: 'dueDate', value: dueDate }, 'string', true)
        const token = AuthService.removeBearerPrefix(req.headers.authorization as string)
        const user = AuthService.verifyAccessToken(token)
        res.json(await DatabaseService.changeTaskDueDate(user._id, projectId, taskId, dueDate)).status(200)
    }

    async changeProjectName(req: Request, res: Response) {
        const { projectId } = req.params
        const { name } = req.body
        InputValidator.validateField({ key: 'name', value: name }, 'string', true)
        const token = AuthService.removeBearerPrefix(req.headers.authorization as string)
        const user = AuthService.verifyAccessToken(token)
        res.json(await DatabaseService.changeProjectName(user._id, projectId, name)).status(200)
    }

    async changeProjectDescription(req: Request, res: Response) {
        const { projectId } = req.params
        const { description } = req.body
        InputValidator.validateField({ key: 'description', value: description }, 'string', true)
        const token = AuthService.removeBearerPrefix(req.headers.authorization as string)
        const user = AuthService.verifyAccessToken(token)
        res.json(await DatabaseService.changeProjectDescription(user._id, projectId, description)).status(200)
    }

    async changeUserRole(req: Request, res: Response) {
        const { projectId, userId } = req.params
        const { role } = req.body
        InputValidator.validateField({ key: 'role', value: role }, 'string', true)
        const token = AuthService.removeBearerPrefix(req.headers.authorization as string)
        const user = AuthService.verifyAccessToken(token)
        res.json(await DatabaseService.changeUserRole(user._id, projectId, userId, role)).status(200)
    }

    async kickUser(req: Request, res: Response) {
        const { projectId, userId } = req.params
        const token = AuthService.removeBearerPrefix(req.headers.authorization as string)
        const user = AuthService.verifyAccessToken(token)
        res.json(await DatabaseService.kickUser(user._id, projectId, userId)).status(200)
    }

    async deleteTask(req: Request, res: Response) {
        const { projectId, taskId } = req.params
        const token = AuthService.removeBearerPrefix(req.headers.authorization as string)
        const user = AuthService.verifyAccessToken(token)
        res.json(await DatabaseService.deleteTask(user._id, projectId, taskId)).status(200)
    }

    async deleteInvite(req: Request, res: Response) {
        const { projectId } = req.params
        const token = AuthService.removeBearerPrefix(req.headers.authorization as string)
        const user = AuthService.verifyAccessToken(token)
        res.json(await DatabaseService.deleteInvite(user._id, projectId)).status(200)
    }

    async leaveProject(req: Request, res: Response) {
        const { projectId } = req.params
        const token = AuthService.removeBearerPrefix(req.headers.authorization as string)
        const user = AuthService.verifyAccessToken(token)
        res.json(await DatabaseService.leaveProject(user._id, projectId)).status(200)
    }
}

export default new ProjectController()
