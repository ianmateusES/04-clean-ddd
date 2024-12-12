import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments'
import { makeAnswerComment } from 'test/factories/make-answer-comment'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let fetchAnswerCommentsUseCase: FetchAnswerCommentsUseCase

describe('Fetch Answer Comments', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    fetchAnswerCommentsUseCase = new FetchAnswerCommentsUseCase(
      inMemoryAnswerCommentsRepository,
    )
  })

  it('should be able to fetch answer comments', async () => {
    const answerId = 'answer-1'
    for (let i = 1; i <= 3; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID(answerId),
        }),
      )
    }

    const result = await fetchAnswerCommentsUseCase.execute({
      answerId,
      page: 1,
    })

    expect(result.value?.answerComments).toHaveLength(3)
  })

  it('should be able to fetch paginated answer comments', async () => {
    const answerId = 'answer-1'
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID(answerId),
        }),
      )
    }

    const result = await fetchAnswerCommentsUseCase.execute({
      answerId,
      page: 2,
    })

    expect(result.value?.answerComments).toHaveLength(2)
  })
})
