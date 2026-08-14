import type {
  CommentProperties,
  PostProperties,
  TopicProperties,
} from '../../../domain/community/community.models';
import type { PageRequest } from '../../pagination/page-request';
import type { PaginatedResult } from '../../pagination/paginated-result';
import type { ModelObjectId } from '../../../domain/model-contracts/model.entity';

type CreateModelInput<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;
type UpdateModelInput<T> = Partial<CreateModelInput<T>>;

/** Application boundary mapped from V1 forum, topic and comment services. */
export interface CommunityServicePort {
  createPost(input: CreateModelInput<PostProperties>): Promise<PostProperties>;
  getPostById(postId: ModelObjectId): Promise<PostProperties | null>;
  getPostsByClass(classId: string): Promise<readonly PostProperties[]>;
  getPostsByTopic(topicId: ModelObjectId): Promise<readonly PostProperties[]>;
  getForumPosts(): Promise<readonly PostProperties[]>;
  updatePost(
    postId: ModelObjectId,
    input: UpdateModelInput<PostProperties>,
  ): Promise<PostProperties | null>;
  deletePost(postId: ModelObjectId): Promise<void>;

  createComment(
    input: CreateModelInput<CommentProperties>,
  ): Promise<CommentProperties>;
  getCommentsByPost(
    postId: string,
    pageRequest: PageRequest,
  ): Promise<PaginatedResult<CommentProperties>>;
  updateComment(
    commentId: ModelObjectId,
    input: UpdateModelInput<CommentProperties>,
  ): Promise<CommentProperties | null>;
  deleteComment(commentId: ModelObjectId): Promise<void>;

  createTopic(
    input: CreateModelInput<TopicProperties>,
  ): Promise<TopicProperties>;
  getTopics(): Promise<readonly TopicProperties[]>;
  updateTopic(
    topicId: ModelObjectId,
    input: UpdateModelInput<TopicProperties>,
  ): Promise<TopicProperties | null>;
  deleteTopic(topicId: ModelObjectId): Promise<void>;
}

export const COMMUNITY_SERVICE = Symbol('COMMUNITY_SERVICE');
