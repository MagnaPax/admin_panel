import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    brandList: [] as {
      brand_id: number
      brand_name: string
    }[],
    categoryList: [] as {
      category_id: number
      category_name: string
    }[],
    productList: [] as {
      product_id: number
      product_name: string
      brand_id: number
      category_id: number
      sex: string
      is_kids: boolean
      sales_quantity: number
      file_paths: string[]
    }[]
  }),
  actions: {
    setBrandList(brandList: { brand_id: number; brand_name: string }[]): void {
      this.brandList = brandList
    },
    setCategoryList(categoryList: { category_id: number; category_name: string }[]): void {
      this.categoryList = categoryList
    },
    setProductList(
      productList: {
        product_id: number
        product_name: string
        brand_id: number
        category_id: number
        sex: string
        is_kids: boolean
        sales_quantity: number
        file_paths: string[]
      }[]
    ): void {
      this.productList = productList
    }
  }
})

export function setupStores() {
  return useCounterStore()
}
