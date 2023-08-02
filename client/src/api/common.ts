import axios, { type AxiosError, type AxiosResponse } from 'axios'
import { setInterceptors, handleErrorResponse } from './interceptors'
import { useCounterStore } from '@/stores/counter'

export default class CommonApi {
  counterStore = useCounterStore()

  host: string = 'http://localhost:5425/'
  axiosInstance = axios.create({
    baseURL: this.host,
    responseType: 'json',
    headers: { 'Content-Type': 'application/json' }
  })

  constructor() {
    setInterceptors(this.axiosInstance)
  }

  private settingURL(path: string): string {
    return `${this.host}${path}`
  }

  async saveResult(path: string, response: any) {
    switch (path) {
      case 'brand':
        await this.counterStore.setBrandList(response)
        break
      case 'category':
        await this.counterStore.setCategoryList(response)
        break
      case 'product':
        await this.counterStore.setProductList(response)
        break
      default:
        break
    }
  }

  async getOrigin(path: string): Promise<AxiosResponse<any, any>> {
    const requestURL = this.settingURL(path)
    const response = await this.axiosInstance.get(requestURL)
    return response
  }

  async get<D = any>(path: string): Promise<AxiosResponse<D>> {
    const requestURL = this.settingURL(path)

    try {
      const response = await this.axiosInstance.get<AxiosResponse<D>>(requestURL)
      return response.data // AxiosResponse 객체에서 응답 데이터만 반환
    } catch (error) {
      return Promise.reject(handleErrorResponse(error as AxiosError))
    }
  }

  async post(path: string, body: object) {
    const requestURL = this.settingURL(path)
    const response = await this.axiosInstance.post(requestURL, body)
    console.log('추가한 결과:', JSON.stringify(response.data))
    return response.data
  }

  async update(path: string, body: object) {
    const requestURL = this.settingURL(path)
    const response = await this.axiosInstance.patch(requestURL, body)
    console.log('바꾼 결과:', JSON.stringify(response.data))
    return response.data
  }

  async delete(path: string) {
    const requestURL = this.settingURL(path)
    const response = await this.axiosInstance.delete(requestURL)
    return response
  }
}
