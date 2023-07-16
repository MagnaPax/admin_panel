<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import CommonApi from '@/api/common'
import { useCounterStore } from '@/stores/counter';


const request = new CommonApi
const counterStore = useCounterStore()

const brands = ref<{ brand_id: number; brand_name: string; }[]>([])
const categories = ref<{ brand_id: number; brand_name: string; }[]>([])
const products = ref<{ product_id: number; product_name: string; sex: string; brand_id: number; category_id: number; is_kids: boolean; sales_quantity: number; file_path: string[]; }[]>([])

// store를 감시하고, 값이 변경될 때마다 변수 업데이트
watch(() => counterStore.brandList, (newBrandList: { brand_id: number; brand_name: string; }[]) => {
    brands.value = newBrandList
})
watch(() => counterStore.categoryList, (newCategoryList: { category_id: number; category_name: string; }[]) => {
    categories.value = newCategoryList
})
watch(() => counterStore.productList, (newProductList: { product_id: number; product_name: string; sex: string; brand_id: number; category_id: number; is_kids: boolean; sales_quantity: number; file_path: string[]; }[]) => {
    products.value = newProductList
})



async function getProducts(path: string = 'product', productNames?: string[], sexes?: string[], brandIDs?: number[], categoryIDs?: number[], IsKids?: boolean[], Qtys: number[]) {
    let fullURL: string = ''

    if (productNames && productNames.length > 0) {
        productNames.forEach((productName) => {
            fullURL += `&product_name=${productName}`
        })
    }
    if (sexes && sexes.length > 0) {
        sexes.forEach((sex) => {
            fullURL += `&sex=${sex}`
        })
    }
    if (brandIDs && brandIDs.length > 0) {
        brandIDs.forEach((brandID) => {
            fullURL += `&brand_id=${brandID}`
        })
    }
    if (categoryIDs && categoryIDs.length > 0) {
        categoryIDs.forEach((categoryID) => {
            fullURL += `&category_id=${categoryID}`
        })
    }
    if (IsKids && IsKids.length > 0) {
        IsKids.forEach((kid) => {
            fullURL += `&is_kids=${kid}`
        })
    }
    if (Qtys && Qtys.length > 0) {
        Qtys.forEach((qty) => {
            fullURL += `&sales_quantity=${qty}`
        })
    }

    if (productNames || sexes || brandIDs || categoryIDs || IsKids || Qtys) {
        // 쿼리 문자열의 첫 번째 '&'를 '?'로 변경
        fullURL = `${path}/search${fullURL.replace('&', '?')}`;
    } else {
        fullURL = path;
    }


    const response = await request.get(fullURL)
    await request.saveResult(path, response) // store에 저장
}

async function getCategories(path: string = 'category', categoryNames?: string[], brand?: boolean, product?: boolean) {
    let fullURL: string = ''

    if (categoryNames && categoryNames.length > 0) {
        categoryNames.forEach((categoryName) => {
            fullURL += `&category_name=${categoryName}`
        })
    }
    if (typeof brand !== 'undefined') {
        fullURL += `&brand=${brand}`
    }
    if (typeof product !== 'undefined') {
        fullURL += `&product=${product}`
    }

    if (categoryNames || typeof brand !== 'undefined' || typeof product !== 'undefined') {
        // 쿼리 문자열의 첫 번째 '&'를 '?'로 변경
        fullURL = `${path}/search${fullURL.replace('&', '?')}`;
    } else {
        fullURL = path;
    }


    const response = await request.get(fullURL)
    await request.saveResult(path, response) // store에 저장
}

async function getBrands(path: string = 'brand', brandNames?: string[], category?: boolean, product?: boolean) {
    let fullURL: string = ''

    if (brandNames && brandNames.length > 0) {
        brandNames.forEach((brandName) => {
            fullURL += `&brand_name=${brandName}`
        })
    }
    if (typeof category !== 'undefined') {
        fullURL += `&category=${category}`
    }
    if (typeof product !== 'undefined') {
        fullURL += `&product=${product}`
    }

    if (brandNames || typeof category !== 'undefined' || typeof product !== 'undefined') {
        // 쿼리 문자열의 첫 번째 '&'를 '?'로 변경
        fullURL = `${path}/search${fullURL.replace('&', '?')}`;
    } else {
        fullURL = path;
    }

    const response = await request.get(fullURL)
    await request.saveResult(path, response) // store에 저장
}



onMounted(() => {
    if (!brands.value.length && !categories.value.length && !products.value.length) {
        getBrands()
        getCategories()
        getProducts()
    }
})
</script>

<template>
    <section class="wrapper">
        <article class="list">
            <h2>Products</h2>
            <div class="product-cards">
                <div v-for="product in products" :key="product.category_id" class="product-card">
                    <template v-if="product.file_paths && product.file_paths.length > 0">
                        <div v-for="filePath in product.file_paths" :key="filePath" class="image-container">
                            <img :src="filePath" alt="Product Image" class="product-image" />
                        </div>
                    </template>
                    <div class="product-details">
                        <h3>{{ product.product_name }}</h3>
                        <p v-if="product.brand_id !== null">
                            브랜드: {{ brands.find((b) => b.brand_id === product.brand_id).brand_name }}
                        </p>
                        <p>성별: {{ product.sex }}</p>
                        <p>용도: {{ product.is_kids ? '아동용' : '성인용' }}</p>
                        <p v-if="product.category_id !== null">
                            카테고리: {{ categories.find((c) => c.category_id === product.category_id).category_name }}
                        </p>
                        <p>판매량: {{ product.sales_quantity }}</p>
                    </div>
                </div>
            </div>
        </article>
    </section>
</template>