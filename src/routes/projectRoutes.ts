import { Router } from 'express'
import ProjectController from '../controllers/ProjectController'
import { authenticationMiddleware } from '../middleware/AuthenticationMiddleware'

const router = Router()

router.use(authenticationMiddleware)

// GET

router.get('/', ProjectController.getAllProjects.bind(ProjectController)) // get all managed projects
router.get('/:projectId', ProjectController.getProjectInfo.bind(ProjectController))
router.get('/:projectId/tasks', ProjectController.getProjectTasks.bind(ProjectController))
router.get('/:projectId/tasks/:taskId', ProjectController.getTaskInfo.bind(ProjectController))

// POST

router.post('/create', ProjectController.createProject.bind(ProjectController))
router.post('/:projectId/join', ProjectController.joinProject.bind(ProjectController))
router.post('/:projectId/new_invite', ProjectController.newInvite.bind(ProjectController))
router.post('/:projectId/create_task', ProjectController.createTask.bind(ProjectController))

// PATCH

router.patch('/:projectId/tasks/:taskId/change_status', ProjectController.changeTaskStatus.bind(ProjectController))
router.patch('/:projectId/tasks/:taskId/change_assignee', ProjectController.changeTaskAssignee.bind(ProjectController))
router.patch('/:projectId/tasks/:taskId/change_due_date', ProjectController.changeTaskDueDate.bind(ProjectController))

router.patch('/:projectId/change_name', ProjectController.changeProjectName.bind(ProjectController))
router.patch('/:projectId/change_description', ProjectController.changeProjectDescription.bind(ProjectController))

router.patch('/:projectId/:userId/change_role', ProjectController.changeUserRole.bind(ProjectController))

// DELETE

router.delete('/:projectId/:userId/kick_user', ProjectController.kickUser.bind(ProjectController))
router.delete('/:projectId/tasks/:taskId/delete', ProjectController.deleteTask.bind(ProjectController))
router.delete('/:projectId/delete_invite', ProjectController.deleteInvite.bind(ProjectController))
router.delete('/:projectId/leave', ProjectController.leaveProject.bind(ProjectController))

export default router
