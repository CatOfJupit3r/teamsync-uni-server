import { DocumentType } from '@typegoose/typegoose'
import mongoose, { Types } from 'mongoose'
import { ProjectClass, ProjectModel, UserClass, UserModel, UserOnProjectClass } from '../models/DatabaseModels'
import { BadRequest, Conflict, InternalServerError, NotFound } from '../models/ErrorModels'

class DatabaseService {
    public connect = async (): Promise<void> => {
        await mongoose.connect('mongodb://localhost:27017/main')
    }

    private saveDocument = async (document: DocumentType<UserClass | ProjectClass>) => {
        try {
            await document.save({
                validateBeforeSave: true,
            })
        } catch (e) {
            console.log(e)
            throw new InternalServerError('Error saving your document!')
        }
    }

    private getUserAndProject = async (userId: string, projectId: string) => {
        let project = null
        try {
            project = await ProjectModel.findOne({ _id: new Types.ObjectId(projectId) })
        } catch (e) {
            throw new BadRequest('Error finding project')
        }
        if (!project) throw new InternalServerError('Project not found')
        const user = project.users.find((user) => user.userId === userId)
        if (!user) throw new InternalServerError('User not found in project')
        return { user, project }
    }

    private checkIfUserIsAllowed = async (user: UserOnProjectClass) => {
        return user.role === 'owner' || user.role === 'manager'
    }

    public getUser = async (userId: string): Promise<UserClass | null> => {
        return UserModel.findOne({ _id: new Types.ObjectId(userId) })
    }

    public getUserByHandle = async (handle: string): Promise<UserClass | null> => {
        return UserModel.findOne({ handle })
    }

    public createNewUser = async (handle: string, hashedPassword: string, name: string): Promise<Types.ObjectId> => {
        const user = new UserModel({ handle, hashedPassword, name, createdAt: new Date(), _id: new Types.ObjectId() })
        await this.saveDocument(user)
        return user._id
    }

    public getJoinedProjects = async (userId: string) => {
        const joinedProjects: Array<ProjectClass> = await ProjectModel.find({
            'users.userId': userId,
        })
        return joinedProjects.map((project) => {
            const user = project.users.find((user) => user.userId === userId.toString())
            if (!user) throw new InternalServerError('User not found in project')
            return {
                projectId: project._id.toString(),
                projectName: project.name,
                role: user.role || 'viewer',
            }
        })
    }

    public createProject = async (userId: string, projectName: string, projectDescription: string) => {
        const project = new ProjectModel({
            name: projectName,
            description: projectDescription,
            users: [{ userId: userId, role: 'admin' }],
            createdAt: new Date(),
            _id: new Types.ObjectId(),
        })
        await this.saveDocument(project)
        return {
            projectId: project._id.toString(),
            projectName: project.name,
            role: 'admin',
        }
    }

    public createTask = async (
        userId: string,
        projectId: string,
        name: string,
        description: string,
        assignee: string,
        dueDate: string
    ) => {
        const task = {
            name,
            description,
            dueDate: new Date(dueDate),
            completed: false,
            responsibleUsers: [assignee],
            _id: new Types.ObjectId(),
        }
        const { user, project } = await this.getUserAndProject(userId, projectId)
        if (await this.checkIfUserIsAllowed(user)) throw new InternalServerError('User not allowed to create tasks')
        project.tasks.push(task)
        await this.saveDocument(project)
        return task
    }

    public newInvite = async (userId: string, projectId: string) => {
        const { user, project } = await this.getUserAndProject(userId, projectId)
        if (await this.checkIfUserIsAllowed(user)) throw new InternalServerError('User not allowed to create invites')
        const inviteCode = Math.random().toString(36).substring(2, 15)
        project.inviteCodes.push(inviteCode)
        await this.saveDocument(project)
        return inviteCode
    }

    public joinProject = async (userId: string, inviteCode: string) => {
        const projects = await ProjectModel.find({ name: 'My New Project!' })
        projects.forEach((project) => console.log(project.name, project.inviteCodes))
        const project = projects.find((project) => project.inviteCodes.includes(inviteCode))
        console.log(project, inviteCode, projects)
        if (!project) throw new NotFound('Project not found')
        if (project.users.find((user) => user.userId === userId)) throw new Conflict('User already in project')
        project.users.push({ userId, role: 'participant' })
        await this.saveDocument(project)
    }

    public getProjectInfo = async (userId: string, projectId: string) => {
        const { user, project } = await this.getUserAndProject(userId, projectId)
        const users = await Promise.all(
            project.users.map(async (user) => {
                const userDoc = await this.getUser(user.userId)
                if (!userDoc) return null
                return {
                    userId: user.userId,
                    role: user.role,
                    name: userDoc.name,
                }
            })
        )
        const tasks = project.tasks.map((task) => {
            return {
                name: task.name,
                description: task.description,
                dueDate: task.dueDate,
                completed: task.completed,
                responsibleUsers: task.responsibleUsers.map((userId) => {
                    const user = users.find((user) => user?.userId === userId)
                    return user ? user.name : null
                }),
                _id: task._id,
            }
        })
        return {
            name: project.name,
            description: project.description,
            createdAt: project.createdAt,
            role: user.role,
            tasks,
            users: users.filter((user) => user !== null),
        }
    }

    public getProjectTasks = async (userId: string, projectId: string) => {
        const { user, project } = await this.getUserAndProject(userId, projectId)
        return project.tasks
    }

    public getTaskInfo = async (userId: string, projectId: string, taskId: string) => {
        const { user, project } = await this.getUserAndProject(userId, projectId)
        const task = project.tasks.find((task) => task._id.toString() === taskId)
        if (!task) throw new InternalServerError('Task not found')
        return task
    }

    public changeTaskStatus = async (userId: string, projectId: string, taskId: string, completed: boolean) => {
        const { user, project } = await this.getUserAndProject(userId, projectId)
        if (await this.checkIfUserIsAllowed(user))
            throw new InternalServerError('User not allowed to change task status')
        const task = project.tasks.find((task) => task._id.toString() === taskId)
        if (!task) throw new InternalServerError('Task not found')
        task.completed = completed
        await this.saveDocument(project)
    }

    public changeTaskAssignee = async (userId: string, projectId: string, taskId: string, assigneeId: string) => {
        const { user, project } = await this.getUserAndProject(userId, projectId)
        if (await this.checkIfUserIsAllowed(user))
            throw new InternalServerError('User not allowed to change task assignee')
        const task = project.tasks.find((task) => task._id.toString() === taskId)
        if (!task) throw new InternalServerError('Task not found')
        task.responsibleUsers = [assigneeId]
        await this.saveDocument(project)
    }

    public changeTaskDueDate = async (userId: string, projectId: string, taskId: string, dueDate: string) => {
        const { user, project } = await this.getUserAndProject(userId, projectId)
        if (await this.checkIfUserIsAllowed(user))
            throw new InternalServerError('User not allowed to change task due date')
        const task = project.tasks.find((task) => task._id.toString() === taskId)
        if (!task) throw new InternalServerError('Task not found')
        task.dueDate = new Date(dueDate)
        await this.saveDocument(project)
    }

    public changeProjectName = async (userId: string, projectId: string, name: string) => {
        const { user, project } = await this.getUserAndProject(userId, projectId)
        if (await this.checkIfUserIsAllowed(user))
            throw new InternalServerError('User not allowed to change project name')
        project.name = name
        await this.saveDocument(project)
    }

    public changeProjectDescription = async (userId: string, projectId: string, description: string) => {
        const { user, project } = await this.getUserAndProject(userId, projectId)
        if (await this.checkIfUserIsAllowed(user))
            throw new InternalServerError('User not allowed to change project description')
        project.description = description
        await this.saveDocument(project)
    }

    public changeUserRole = async (
        userId: string,
        projectId: string,
        targetUserId: string,
        role: 'owner' | 'manager' | 'participant' | 'viewer'
    ) => {
        const { user, project } = await this.getUserAndProject(userId, projectId)
        if (await this.checkIfUserIsAllowed(user)) throw new InternalServerError('User not allowed to change user role')
        const targetUser = project.users.find((user) => user.userId === targetUserId)
        if (!targetUser) throw new InternalServerError('Target user not found')
        targetUser.role = role
        await this.saveDocument(project)
    }

    public kickUser = async (userId: string, projectId: string, targetUserId: string) => {
        const { user, project } = await this.getUserAndProject(userId, projectId)
        if (await this.checkIfUserIsAllowed(user)) throw new InternalServerError('User not allowed to kick user')
        project.users = project.users.filter((user) => user.userId !== targetUserId)
        await this.saveDocument(project)
    }

    public deleteTask = async (userId: string, projectId: string, taskId: string) => {
        const { user, project } = await this.getUserAndProject(userId, projectId)
        if (await this.checkIfUserIsAllowed(user)) throw new InternalServerError('User not allowed to delete tasks')
        project.tasks = project.tasks.filter((task) => task._id.toString() !== taskId)
        await this.saveDocument(project)
    }

    public deleteInvite = async (userId: string, projectId: string) => {
        const { user, project } = await this.getUserAndProject(userId, projectId)
        if (await this.checkIfUserIsAllowed(user)) throw new InternalServerError('User not allowed to delete invites')
        project.inviteCodes = []
        await this.saveDocument(project)
    }

    public leaveProject = async (userId: string, projectId: string) => {
        const { user, project } = await this.getUserAndProject(userId, projectId)
        if (user.role === 'owner') throw new BadRequest('Owner cannot leave project')
        project.users = project.users.filter((user) => user.userId !== userId)
        await this.saveDocument(project)
    }
}

export default new DatabaseService()
