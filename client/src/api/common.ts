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
        this.counterStore.setBrandList(response.data)
        break
      case 'category':
        this.counterStore.setCategoryList(response.data)
        break
      case 'product':
        this.counterStore.setCategoryList(response.data)
        break
      default:
        break
    }
  }

  async get(path: string) {
    const requestURL = this.settingURL(path)
    const response = await this.axiosInstance.get(requestURL)
    this.saveResult(path, response)
  }
}
