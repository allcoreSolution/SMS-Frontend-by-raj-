import { studyService } from './studyService';

export const homeworkService = {
  getHomework: (params) => studyService.getHomework(params),
  assignHomework: (payload) => studyService.createHomework(payload),
  updateHomework: (id, payload) => studyService.updateHomework(id, payload),
  evaluateHomework: (id, data) => studyService.evaluateHomework(id, data),
  deleteHomework: (id) => studyService.deleteHomework(id),
  
  // Also pass through classwork and resource methods for convenience
  getClasswork: (params) => studyService.getClasswork(params),
  createClasswork: (payload) => studyService.createClasswork(payload),
  updateClasswork: (id, payload) => studyService.updateClasswork(id, payload),
  deleteClasswork: (id) => studyService.deleteClasswork(id),
  
  getResources: (params) => studyService.getResources(params),
  createResource: (payload) => studyService.createResource(payload),
  updateResource: (id, payload) => studyService.updateResource(id, payload),
  deleteResource: (id) => studyService.deleteResource(id),
  downloadResource: (id) => studyService.downloadResource(id)
};

export default homeworkService;
