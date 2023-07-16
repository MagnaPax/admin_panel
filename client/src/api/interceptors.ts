// 응답을 받은 후에 호출되는 함수
function handleErrorResponse(error) {
  if (error.response && error.response.data && error.response.data.message) {
    const errorMessage = error.response.data.message.join('\n')
    console.log('Error:', errorMessage)
    alert(errorMessage)
  } else {
    console.log('An error occurred:', error.message)
  }
}

export function setInterceptors(instance) {
  // 요청 인터셉터 추가하기
  instance.interceptors.request.use(
    function (config) {
      // 요청이 전달되기 전에 작업 수행
      return config
    },
    function (error) {
      // 요청 오류가 있는 작업 수행
      return Promise.reject(error)
    }
  )

  // 응답 인터셉터 추가하기
  instance.interceptors.response.use(
    function (response) {
      // 2xx 범위에 있는 상태 코드는 이 함수를 트리거 합니다.
      // 응답 데이터가 있는 작업 수행
      return response
    },
    function (error) {
      // 2xx 외의 범위에 있는 상태 코드는 이 함수를 트리거 합니다.
      // validateStatus 함수를 사용하여 응답 상태 코드를 확인
      if (error.response && error.response.status && !validateStatus(error.response.status)) {
        handleErrorResponse(error)
      }
      return Promise.reject(error)
    }
  )
}
