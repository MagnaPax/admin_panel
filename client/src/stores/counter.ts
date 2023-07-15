import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    brandList: [] as object[],
    categoryList: [] as object[],
    productList: [] as object[]
  }),
  actions: {
    async setBrandList(brandList: object[]) {
      this.brandList = brandList
    },
    async setCategoryList(categoryList: object[]) {
      this.categoryList = categoryList
    },
    async setProductList(productList: object[]) {
      this.productList = productList
    }
  }
})

export function setupStores() {
  return useCounterStore()
}
