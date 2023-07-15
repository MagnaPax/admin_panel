import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'

export default class CommonApi {
  host: string = 'http://localhost:5425/'
  config: AxiosRequestConfig = {
    baseURL: this.host,
    responseType: 'json',
    headers: { 'Content-Type': 'application/json' }
  }
  axiosInstance = axios.create(this.config)

  private settingURL(path: string): string {
    return `${this.host}${path}`
  }

  async get(path: string) {
    const requestURL = this.settingURL(path)
    const response = await this.axiosInstance.get(requestURL)
    return response.data
  }
}
