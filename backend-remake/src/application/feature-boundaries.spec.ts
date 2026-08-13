import { ACADEMICS_MODEL_TOKENS } from './academics/ports/academics-model.tokens';
import { ASSESSMENTS_MODEL_TOKENS } from './assessments/ports/assessments-model.tokens';
import { COLLABORATION_MODEL_TOKENS } from './collaboration/ports/collaboration-model.tokens';
import { COMMUNITY_MODEL_TOKENS } from './community/ports/community-model.tokens';
import { KNOWLEDGE_MODEL_TOKENS } from './knowledge/ports/knowledge-model.tokens';
import { LEARNING_MODEL_TOKENS } from './learning/ports/learning-model.tokens';
import { AttendanceEntity } from '../domain/academics/academics.models';
import { OnlineTestEntity } from '../domain/assessments/assessments.models';
import { ConversationEntity } from '../domain/collaboration/collaboration.models';
import { TopicEntity } from '../domain/community/community.models';
import { DocumentEntity } from '../domain/knowledge/knowledge.models';
import { AssignmentEntity } from '../domain/learning/learning.models';

describe('feature model boundaries', () => {
  it('exposes the V1 model contracts and repository tokens per feature', () => {
    expect(AttendanceEntity).toBeDefined();
    expect(AssignmentEntity).toBeDefined();
    expect(OnlineTestEntity).toBeDefined();
    expect(TopicEntity).toBeDefined();
    expect(ConversationEntity).toBeDefined();
    expect(DocumentEntity).toBeDefined();

    expect(Object.keys(ACADEMICS_MODEL_TOKENS)).toHaveLength(5);
    expect(Object.keys(LEARNING_MODEL_TOKENS)).toHaveLength(4);
    expect(Object.keys(ASSESSMENTS_MODEL_TOKENS)).toHaveLength(4);
    expect(Object.keys(COMMUNITY_MODEL_TOKENS)).toHaveLength(3);
    expect(Object.keys(COLLABORATION_MODEL_TOKENS)).toHaveLength(4);
    expect(Object.keys(KNOWLEDGE_MODEL_TOKENS)).toEqual(['document']);
  });
});
