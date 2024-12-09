import { AnswersRepository } from '../repositories//answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

export interface FetchQuestionAnswersUseCaseRequest {
  questionId: string
  page: number
}

export interface FetchQuestionAnswersUseCaseResponse {
  answers: Answer[]
}
export class FetchQuestionAnswersUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionAnswersUseCaseRequest): Promise<FetchQuestionAnswersUseCaseResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(
      questionId,
      { page },
    )

    return {
      answers,
    }
  }
}
