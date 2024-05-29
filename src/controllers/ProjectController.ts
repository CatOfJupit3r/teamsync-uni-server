import { Request, Response } from 'express'
import AuthService from '../services/AuthService'
import InputValidator from '../services/InputValidator'
import ProjectService from '../services/ProjectService'

class ProjectController {
    async getAllProjects(req: Request, res: Response) {
        const token = AuthService.removeBearerPrefix(req.headers.authorization as string)
        res.json(await ProjectService.getAllProjects(token)).status(200)
    }

    async getProjectInfo(req: Request, res: Response) {
        const { projectId } = req.params
        const token = AuthService.removeBearerPrefix(req.headers.authorization as string)
        res.json(await ProjectService.getProjectInfo(token, projectId)).status(200)
    }

    async getProjectTasks(req: Request, res: Response) {
        const { projectId } = req.params
        const token = AuthService.removeBearerPrefix(req.headers.authorization as string)
        res.json(await ProjectService.getProjectTasks(token, projectId)).status(200)
    }

    async getTaskInfo(req: Request, res: Response) {
        const { projectId, taskId } = req.params
        const token = AuthService.removeBearerPrefix(req.headers.authorization as string)
        res.json(await ProjectService.getTaskInfo(token, projectId, taskId)).status(200)
    }

    async createProject(req: Request, res: Response) {
        const { name, description } = req.body
        InputValidator.validateObject({ name, description }, { name: 'string', description: 'string' }, true)
        const token = AuthService.removeBearerPrefix(req.headers.authorization as string)
        res.json(await ProjectService.createProject(token, name, description)).status(200)
    }

    async joinProject(req: Request, res: Response) {
        const { inviteCode } = req.body
        const { projectId } = req.params
        InputValidator.validateObject({ inviteCode }, { inviteCode: 'string' }, true)
        const token = AuthService.removeBearerPrefix(req.headers.authorization as string)
        res.json(await ProjectService.joinProject(token, projectId, inviteCode)).status(200)
    }

    async newInvite(req: Request, res: Response) {
        const { projectId } = req.params
        const token = AuthService.removeBearerPrefix(req.headers.authorization as string)
        res.json(await ProjectService.newInvite(token, projectId)).status(200)
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
        res.json(await ProjectService.createTask(token, projectId, name, description, assignee, dueDate)).status(200)
    }

    async changeTaskStatus(req: Request, res: Response) {
        const { projectId, taskId } = req.params
        const { completed } = req.body
        InputValidator.validateField({ key: 'completed', value: completed }, 'boolean', true)
        const token = AuthService.removeBearerPrefix(req.headers.authorization as string)
        res.json(await ProjectService.changeTaskStatus(token, projectId, taskId, completed)).status(200)
    }

    async changeTaskAssignee(req: Request, res: Response) {
        const { projectId, taskId } = req.params
        const { assigneeId } = req.body
        InputValidator.validateField({ key: 'assigneeId', value: assigneeId }, 'string', true)
        const token = AuthService.removeBearerPrefix(req.headers.authorization as string)
        res.json(await ProjectService.changeTaskAssignee(token, projectId, taskId, assigneeId)).status(200)
    }

    async changeTaskDueDate(req: Request, res: Response) {
        const { projectId, taskId } = req.params
        const { dueDate } = req.body
        InputValidator.validateField({ key: 'dueDate', value: dueDate }, 'string', true)
        const token = AuthService.removeBearerPrefix(req.headers.authorization as string)
        res.json(await ProjectService.changeTaskDueDate(token, projectId, taskId, dueDate)).status(200)
    }

    async changeProjectName(req: Request, res: Response) {
        const { projectId } = req.params
        const { name } = req.body
        InputValidator.validateField({ key: 'name', value: name }, 'string', true)
        const token = AuthService.removeBearerPrefix(req.headers.authorization as string)
        res.json(await ProjectService.changeProjectName(token, projectId, name)).status(200)
    }

    async changeProjectDescription(req: Request, res: Response) {
        const { projectId } = req.params
        const { description } = req.body
        InputValidator.validateField({ key: 'description', value: description }, 'string', true)
        const token = AuthService.removeBearerPrefix(req.headers.authorization as string)
        res.json(await ProjectService.changeProjectDescription(token, projectId, description)).status(200)
    }

    async changeUserRole(req: Request, res: Response) {
        const { projectId, userId } = req.params
        const { role } = req.body
        InputValidator.validateField({ key: 'role', value: role }, 'string', true)
        const token = AuthService.removeBearerPrefix(req.headers.authorization as string)
        res.json(await ProjectService.changeUserRole(token, projectId, userId, role)).status(200)
    }

    async kickUser(req: Request, res: Response) {
        const { projectId, userId } = req.params
        const token = AuthService.removeBearerPrefix(req.headers.authorization as string)
        res.json(await ProjectService.kickUser(token, projectId, userId)).status(200)
    }

    async deleteTask(req: Request, res: Response) {
        const { projectId, taskId } = req.params
        const token = AuthService.removeBearerPrefix(req.headers.authorization as string)
        res.json(await ProjectService.deleteTask(token, projectId, taskId)).status(200)
    }

    async deleteInvite(req: Request, res: Response) {
        const { projectId } = req.params
        const token = AuthService.removeBearerPrefix(req.headers.authorization as string)
        res.json(await ProjectService.deleteInvite(token, projectId)).status(200)
    }

    async leaveProject(req: Request, res: Response) {
        const { projectId } = req.params
        const token = AuthService.removeBearerPrefix(req.headers.authorization as string)
        res.json(await ProjectService.leaveProject(token, projectId)).status(200)
    }
}

export default new ProjectController()
