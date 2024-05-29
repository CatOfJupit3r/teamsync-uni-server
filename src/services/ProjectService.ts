import DatabaseService from './DatabaseService'

class ProjectService {
    async createProject(userId: string, projectName: string, projectDescription: string) {
        return DatabaseService.createProject(userId, projectName, projectDescription)
    }

    async getAllProjects(userId: string) {
        return DatabaseService.getJoinedProjects(userId)
    }

    async createTask(userId: string, projectId: string, name: string, description: string, assignee: string, dueDate: string) {
        return DatabaseService.createTask(userId, projectId, name, description, assignee, dueDate)
    }

    async newInvite(userId: string, projectId: string) {
        return DatabaseService.newInvite(userId, projectId)
    }

    async joinProject(userId: string, projectId: string, inviteCode: string) {
        return DatabaseService.joinProject(userId, projectId, inviteCode)
    }

    async getProjectInfo(userId: string, projectId: string) {
        return DatabaseService.getProjectInfo(userId, projectId)
    }

    async getProjectTasks(userId: string, projectId: string) {
        return DatabaseService.getProjectTasks(userId, projectId)
    }

    async getTaskInfo(userId: string, projectId: string, taskId: string) {
        return DatabaseService.getTaskInfo(userId, projectId, taskId)
    }

    async changeTaskStatus(userId: string, projectId: string, taskId: string, completed: boolean) {
        return DatabaseService.changeTaskStatus(userId, projectId, taskId, completed)
    }

    async changeTaskAssignee(userId: string, projectId: string, taskId: string, assigneeId: string) {
        return DatabaseService.changeTaskAssignee(userId, projectId, taskId, assigneeId)
    }

    async changeTaskDueDate(userId: string, projectId: string, taskId: string, dueDate: string) {
        return DatabaseService.changeTaskDueDate(userId, projectId, taskId, dueDate)
    }

    async changeProjectName(userId: string, projectId: string, name: string) {
        return DatabaseService.changeProjectName(userId, projectId, name)
    }

    async changeProjectDescription(userId: string, projectId: string, description: string) {
        return DatabaseService.changeProjectDescription(userId, projectId, description)
    }

    async changeUserRole(userId: string, projectId: string, targetUserId: string, role: 'owner' | 'manager' | 'participant' | 'viewer') {
        return DatabaseService.changeUserRole(userId, projectId, targetUserId, role)
    }

    async kickUser(userId: string, projectId: string, targetUserId: string) {
        return DatabaseService.kickUser(userId, projectId, targetUserId)
    }

    async deleteTask(userId: string, projectId: string, taskId: string) {
        return DatabaseService.deleteTask(userId, projectId, taskId)
    }

    async deleteInvite(userId: string, projectId: string) {
        return DatabaseService.deleteInvite(userId, projectId)
    }

    async leaveProject(userId: string, projectId: string) {
        return DatabaseService.leaveProject(userId, projectId)
    }
}

export default new ProjectService()
