import type {
  ConversationProperties,
  MessageProperties,
  RecordLessonSummaryProperties,
  RoomProperties,
} from '../../../domain/collaboration/collaboration.models';
import type { ModelObjectId } from '../../../domain/model-contracts/model.entity';
import type { PageRequest } from '../../pagination/page-request';
import type { PaginatedResult } from '../../pagination/paginated-result';

type CreateModelInput<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;

export interface PrivateConversationResult {
  conversation: ConversationProperties;
  isNew: boolean;
}

export interface RecordingStartResult {
  egressId: string;
}

/** Application boundary mapped from V1 chat, room and recording services. */
export interface CollaborationServicePort {
  getConversations(
    userId: ModelObjectId,
  ): Promise<readonly ConversationProperties[]>;
  getConversationById(
    conversationId: ModelObjectId,
  ): Promise<ConversationProperties | null>;
  createPrivateConversation(
    userId: ModelObjectId,
    participantId: ModelObjectId,
  ): Promise<PrivateConversationResult>;
  getMessages(
    conversationId: ModelObjectId,
    pageRequest: PageRequest,
  ): Promise<PaginatedResult<MessageProperties>>;
  markMessagesAsRead(
    conversationId: ModelObjectId,
    userId: ModelObjectId,
  ): Promise<void>;
  getUnreadMessageCount(userId: ModelObjectId): Promise<number>;
  getUsersWithConversations(
    adminId: ModelObjectId,
  ): Promise<readonly ConversationProperties[]>;

  createRoom(input: CreateModelInput<RoomProperties>): Promise<RoomProperties>;
  getRoomById(roomId: ModelObjectId): Promise<RoomProperties | null>;
  getRoomByName(roomName: string): Promise<RoomProperties | null>;
  getRoomByJoinCode(joinCode: string): Promise<RoomProperties | null>;
  startRoom(roomId: ModelObjectId): Promise<RoomProperties | null>;
  endRoom(role: string, roomId: ModelObjectId): Promise<RoomProperties | null>;
  addRoomParticipant(
    roomId: ModelObjectId,
    participant: RoomProperties['participants'][number],
  ): Promise<RoomProperties | null>;
  removeRoomParticipant(
    roomId: ModelObjectId,
    userIdOrEmail: string,
  ): Promise<RoomProperties | null>;
  getRoomParticipants(
    roomId: ModelObjectId,
  ): Promise<readonly RoomProperties['participants'][number][]>;

  startClassRecording(
    roomName: string,
    classId: ModelObjectId,
  ): Promise<RecordingStartResult>;
  stopClassRecording(egressId: string): Promise<void>;
  getRecordingInfo(
    egressId: string,
  ): Promise<RecordLessonSummaryProperties | null>;
  listRecordings(
    classId: ModelObjectId,
  ): Promise<readonly RecordLessonSummaryProperties[]>;
  updateRecordingAiSummary(
    recordingId: ModelObjectId,
    aiSummary: string,
  ): Promise<RecordLessonSummaryProperties | null>;
  publishRecording(
    recordingId: ModelObjectId,
  ): Promise<RecordLessonSummaryProperties | null>;
}

export const COLLABORATION_SERVICE = Symbol('COLLABORATION_SERVICE');
