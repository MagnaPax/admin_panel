import axios, { type AxiosResponse } from 'axios'
import { setInterceptors } from './interceptors'
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

  async saveResult(path: string, response: AxiosResponse<any, any>) {
    switch (path) {
      case 'brand':
        await this.counterStore.setBrandList(response.data)
        break
      case 'category':
        await this.counterStore.setCategoryList(response.data)
        break
      case 'product':
        await this.counterStore.setProductList(response.data)
        break
      default:
        break
    }
  }

  async get(path: string): Promise<void> {
    const requestURL = this.settingURL(path)
    const response = await this.axiosInstance.get(requestURL)
    await this.saveResult(path, response)
    return response
  }

  async post(path: string, body: object) {
    const requestURL = this.settingURL(path)
    const response = await this.axiosInstance.post(requestURL, body)
    console.log('추가한 결과:', JSON.stringify(response.data))
    return response.data
  }
}
