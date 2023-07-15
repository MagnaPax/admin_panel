import axios from 'axios'
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

  async get(path: string) {
    const requestURL = this.settingURL(path)
    const response = await this.axiosInstance.get(requestURL)

    this.counterStore.setBrandList(response.data)
  }
}
