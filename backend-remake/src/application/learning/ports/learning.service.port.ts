import type {
  AnnouncementProperties,
  AssignmentProperties,
  MaterialProperties,
  SubmissionProperties,
} from '../../../domain/learning/learning.models';
import type { ModelObjectId } from '../../../domain/model-contracts/model.entity';

type CreateModelInput<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;
type UpdateModelInput<T> = Partial<CreateModelInput<T>>;

/** Application boundary mapped from V1 announcement, assignment, material and submission services. */
export interface LearningServicePort {
  listAnnouncements(): Promise<readonly AnnouncementProperties[]>;
  getAnnouncementById(
    announcementId: ModelObjectId,
  ): Promise<AnnouncementProperties | null>;
  getAnnouncementsByClass(
    classId: ModelObjectId,
  ): Promise<readonly AnnouncementProperties[]>;
  getAnnouncementsByCreator(
    creatorId: ModelObjectId,
  ): Promise<readonly AnnouncementProperties[]>;
  createAnnouncement(
    input: CreateModelInput<AnnouncementProperties>,
  ): Promise<AnnouncementProperties>;
  updateAnnouncement(
    announcementId: ModelObjectId,
    input: UpdateModelInput<AnnouncementProperties>,
  ): Promise<AnnouncementProperties | null>;
  deleteAnnouncement(announcementId: ModelObjectId): Promise<void>;

  listAssignments(): Promise<readonly AssignmentProperties[]>;
  getAssignmentById(
    assignmentId: ModelObjectId,
  ): Promise<AssignmentProperties | null>;
  getAssignmentsByClass(
    classId: ModelObjectId,
  ): Promise<readonly AssignmentProperties[]>;
  createAssignment(
    input: CreateModelInput<AssignmentProperties>,
  ): Promise<AssignmentProperties>;
  updateAssignment(
    assignmentId: ModelObjectId,
    input: UpdateModelInput<AssignmentProperties>,
  ): Promise<AssignmentProperties | null>;
  deleteAssignment(assignmentId: ModelObjectId): Promise<void>;

  listMaterials(): Promise<readonly MaterialProperties[]>;
  getMaterialById(
    materialId: ModelObjectId,
  ): Promise<MaterialProperties | null>;
  getMaterialsByClass(
    classId: ModelObjectId,
  ): Promise<readonly MaterialProperties[]>;
  createMaterial(
    input: CreateModelInput<MaterialProperties>,
  ): Promise<MaterialProperties>;
  deleteMaterial(materialId: ModelObjectId): Promise<void>;

  listSubmissions(): Promise<readonly SubmissionProperties[]>;
  getSubmissionById(
    submissionId: ModelObjectId,
  ): Promise<SubmissionProperties | null>;
  getSubmissionsByAssignment(
    assignmentId: ModelObjectId,
  ): Promise<readonly SubmissionProperties[]>;
  getSubmissionsByStudent(
    studentId: ModelObjectId,
  ): Promise<readonly SubmissionProperties[]>;
  createSubmission(
    input: CreateModelInput<SubmissionProperties>,
  ): Promise<SubmissionProperties>;
  updateSubmission(
    submissionId: ModelObjectId,
    input: UpdateModelInput<SubmissionProperties>,
  ): Promise<SubmissionProperties | null>;
  deleteSubmission(submissionId: ModelObjectId): Promise<void>;
}

export const LEARNING_SERVICE = Symbol('LEARNING_SERVICE');
