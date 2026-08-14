import type { DocumentProperties } from '../../../domain/knowledge/knowledge.models';
import type { ModelObjectId } from '../../../domain/model-contracts/model.entity';

type CreateDocumentInput = Omit<
  DocumentProperties,
  'id' | 'createdAt' | 'updatedAt'
>;
type UpdateDocumentInput = Partial<CreateDocumentInput>;

export interface RecommendedDocument {
  document: DocumentProperties;
  score: number;
}

/** Application boundary mapped from V1 recommendation/document and embedding services. */
export interface KnowledgeServicePort {
  createDocument(input: CreateDocumentInput): Promise<DocumentProperties>;
  listDocuments(): Promise<readonly DocumentProperties[]>;
  getDocumentById(
    documentId: ModelObjectId,
  ): Promise<DocumentProperties | null>;
  updateDocument(
    documentId: ModelObjectId,
    input: UpdateDocumentInput,
  ): Promise<DocumentProperties | null>;
  deleteDocument(documentId: ModelObjectId): Promise<void>;
  recommendDocuments(
    query: string,
    options?: { topK?: number; method?: string; useWeighted?: boolean },
  ): Promise<readonly RecommendedDocument[]>;
}

/** External embedding capability required by the knowledge feature; no provider is selected yet. */
export interface EmbeddingProviderPort {
  createEmbedding(text: string): Promise<readonly number[]>;
  createBatchEmbeddings(
    texts: readonly string[],
  ): Promise<readonly (readonly number[])[]>;
}

export const KNOWLEDGE_SERVICE = Symbol('KNOWLEDGE_SERVICE');
export const EMBEDDING_PROVIDER = Symbol('EMBEDDING_PROVIDER');
