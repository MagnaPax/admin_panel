import { type AxiosInstance, type AxiosResponse, type AxiosError } from 'axios'

// 2xx 외의 범위에 있는 응답을 받은 후에 호출되는 함수
export function handleErrorResponse<T = any>(error: AxiosError<T>): string {
  let errorMessage: string = 'An error occurred'

  if (error.response && error.response.data && (error.response.data as any).message) {
    if (typeof (error.response.data as any).message === 'string') {
      // 응답이 문자열인 경우 그대로 사용
      errorMessage = (error.response.data as any).message
    } else if (Array.isArray((error.response.data as any).message)) {
      // 응답이 배열인 경우 배열의 요소들을 개행 문자로 합쳐서 사용
      errorMessage = (error.response.data as any).message.join('\n')
    }
  }

  return errorMessage
}

export function setInterceptors(instance: AxiosInstance) {
  // 요청 인터셉터 추가하기
  instance.interceptors.request.use(
    function (config) {
      // 요청이 전달되기 전에 작업 수행
      return config
    },
    function (error: AxiosError) {
      // 요청 오류가 있는 작업 수행
      return Promise.reject(error)
    }
  )

  // 응답 인터셉터 추가하기
  instance.interceptors.response.use(
    function (response: AxiosResponse) {
      // 2xx 범위에 있는 상태 코드는 이 함수를 트리거 합니다.
      // 응답 데이터가 있는 작업 수행
      return response
    },
    function (error: AxiosError) {
      // 2xx 외의 범위에 있는 상태 코드는 이 함수를 트리거 합니다.
      handleErrorResponse(error)
      return Promise.reject(error)
    }
  )
}
