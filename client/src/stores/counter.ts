import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    brandList: [] as object[],
    categoryList: [] as object[],
    productList: [] as object[]
  }),
  actions: {
    setBrandList(brandList: object[]): void {
      this.brandList = brandList
    },
    setCategoryList(categoryList: object[]): void {
      this.categoryList = categoryList
    },
    setProductList(productList: object[]): void {
      this.productList = productList
    }
  }
})

export function setupStores() {
  return useCounterStore()
}
