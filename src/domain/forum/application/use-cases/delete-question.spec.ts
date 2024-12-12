import { DeleteQuestionUseCase } from './delete-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { makeQuestionAttachment } from 'test/factories/make-question-attachments'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let deleteQuestionUseCase: DeleteQuestionUseCase

describe('Delete Question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    deleteQuestionUseCase = new DeleteQuestionUseCase(
      inMemoryQuestionsRepository,
    )
  })

  it('should be able to delete a question', async () => {
    const authorId = 'author-1'
    const questionId = 'question-1'
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID(authorId),
      },
      new UniqueEntityID(questionId),
    )
    await inMemoryQuestionsRepository.create(newQuestion)

    for (let i = 1; i < 3; i++) {
      inMemoryQuestionAttachmentsRepository.items.push(
        makeQuestionAttachment({
          questionId: newQuestion.id,
          attachmentId: new UniqueEntityID(i.toString()),
        }),
      )
    }

    await deleteQuestionUseCase.execute({
      questionId,
      authorId,
    })

    expect(inMemoryQuestionsRepository.items).toHaveLength(0)
    expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a question from another user', async () => {
    const questionId = 'question-1'
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID(questionId),
    )
    await inMemoryQuestionsRepository.create(newQuestion)

    const result = await deleteQuestionUseCase.execute({
      questionId,
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
