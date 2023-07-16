<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import CommonApi from '@/api/common'
import { useCounterStore } from '@/stores/counter'


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

const brandName = ref<string | null>(null)
const brandNames = ref<string[]>([])
const categoryName = ref<string | null>(null)
const categoryNames = ref<string[]>([])
const checkedItems = ref<string[]>([])
const deleteName = ref<string | null>(null)
const deleteNames = ref<string[]>([])
const updateID = ref<string | null>(null)
const newBrandName = ref<string | null>(null)
const isProduct = ref<boolean>(false)
const isCategory = ref<boolean>(false)



async function getCategories(path: string = 'category') {
    const fullURL = path
    const response = await request.get(fullURL)
    // store에 저장
    if (isProduct.value) {
        await request.saveResult('product', response)
    } else if (isCategory.value) {
        await request.saveResult('category', response)
    } else {
        await request.saveResult(path, response)
    }
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
        fullURL = `${path}/search${fullURL.replace('&', '?')}`
    } else {
        fullURL = path
    }

    const response = await request.get(fullURL)
    // store에 저장
    if (isProduct.value) {
        await request.saveResult('product', response)
    } else if (isCategory.value) {
        await request.saveResult('category', response)
    } else {
        await request.saveResult(path, response)
    }
}

function addId() {
    if (categoryName.value !== null && !categoryNames.value.includes(categoryName.value)) {
        categoryNames.value.push(categoryName.value)
        categoryName.value = null
    }
}

async function addBrand() {
    const path = 'brand'
    let body: any = {}
    const IDs = Object.values(categoryNames.value)

    body.brand_name = brandName.value
    if (IDs.length > 0) body.category_ids = IDs

    body = JSON.stringify(body)

    brandName.value = ''
    categoryName.value = null
    categoryNames.value = []

    await request.post(path, body)
    getBrands() // brands 갱신

}


function onCheckboxChange(checkbox) {
    if (checkbox === 'na') {
        this.checkedItems = ['na']
    } else if (checkbox === 'category' || checkbox === 'product') {
        if (this.checkedItems.includes('na')) {
            this.checkedItems = [checkbox]
        }
    }
}

async function searchBrands() {
    // 맨 마지막 콤마 제거 -> 콤마 나오면 분리
    const values: string[] = brandNames.value.replace(/,\s*$/, '').split(",")

    // 각 값의 앞뒤 공백 제거하고 중복 제거
    const bNames = Array.from(new Set(values.map((value) => value.trim()))).filter(Boolean)

    // 단어가 한 개만 들어오는 경우, 두 개로 복사하여 추가(백엔드 설계 결함)
    if (bNames.length === 1) {
        bNames.push(bNames[0])
    }

    const tables = Object.values(checkedItems.value)
    const product = tables.includes('product')
    const category = tables.includes('category')


    if (product && category) {
        isProduct.value = true
        isCategory.value = true
        await getBrands('brand', bNames, true, true)
    } else if (product) {
        isProduct.value = true
        await getBrands('brand', bNames, undefined, true)
    } else if (category) {
        isCategory.value = true
        await getBrands('brand', bNames, true)
    } else {
        isProduct.value = false
        await getBrands('brand', bNames)
    }
}

async function updateBrand() {
    let fullURL: string = ''
    const path = 'brand'
    let body: any = {}

    fullURL = `${path}/${updateID.value}`

    body.brand_name = newBrandName.value
    body = JSON.stringify(body)

    newBrandName.value = ''

    const response = await request.update(fullURL, body)
    await request.saveResult(path, response)

    getBrands() // brands 갱신
}

async function deleteId() {
    if (deleteName.value !== null && !deleteNames.value.includes(deleteName.value)) {
        deleteNames.value.push(deleteName.value)
        deleteName.value = null
    }
}

async function deleteBrand() {
    let fullURL: string = ''
    const path = 'brand'
    const IDs = Object.values(deleteNames.value)

    for (const el of IDs) {
        console.log(el)
        fullURL = `brand/${el}`
        const response = await request.delete(fullURL)
        await request.saveResult(path, response)
    }

    deleteNames.value = ''
    getBrands() // brands 갱신
}

// null 혹은 undefined 처리
function getBrandName(brandId) {
    const brand = this.brands.find((b) => b.brand_id === brandId);
    return brand ? brand.brand_name : 'Unknown';
}

// null 혹은 undefined 처리
function getCategoryName(categoryId) {
    const category = this.categories.find((c) => c.category_id === categoryId);
    return category ? category.category_name : 'Unknown';
}

onMounted(() => {
    getBrands()
    getCategories()
})
</script>

<template>
    <section class="wrapper">
        <article class="create">
            <h3>Add a new brand name</h3>
            <form @submit.prevent="addBrand">
                <label for="categorySelect">Select Relative Category with the brand</label>
                <div class="menu">
                    <select id="categorySelect" v-model="categoryName">
                        <option v-for="(category, i) in categories" :key="i" :value="category.category_id">
                            {{ category.category_name }}
                        </option>
                    </select>
                    <button @click.prevent="addId">Add</button>
                </div>

                <div class="inputted_category">
                    <ul>
                        <li v-for="id in categoryNames" :key="id">{{ id }}</li>
                    </ul>
                </div>
                <input class="input" type="text" v-model="brandName" placeholder="Input Brand name">
                <input class="button" type="submit" value="Create Brand">
            </form>
        </article>


        <article class="update">
            <h3>Update Brand Name</h3>
            <form @submit.prevent="updateBrand">
                <div class="menu">
                    <select id="updateSelect" v-model="updateID">
                        <option v-for="(brand, i) in brands" :key="i" :value="brand.brand_id">
                            {{ brand.brand_name }}
                        </option>
                    </select>
                    TO
                </div>
                <input class="input" type="text" v-model="newBrandName" placeholder="New Brand name">
                <input class="button" type="submit" value="Update Brand">
            </form>
        </article>


        <article class="search">
            <h3>Look Up Brand Names</h3>
            <form @submit.prevent="searchBrands">
                <input class="input" type="text" v-model="brandNames" placeholder="name, name, ...">

                <input id="ch_na" type="checkbox" v-model="checkedItems" value="na" @change="onCheckboxChange('na')" />
                <label for="ch_na">N/A</label>

                <input id="ch_category" type="checkbox" v-model="checkedItems" value="category"
                    @change="onCheckboxChange('category')" />
                <label for="ch_category">For the categories</label>

                <input id="ch_product" type="checkbox" v-model="checkedItems" value="product"
                    @change="onCheckboxChange('product')" />
                <label for="ch_product">For the products</label>

                <input class="button" type="submit" value="Submit" :disabled="brandNames.length === 0">
            </form>
        </article>


        <article class="delete">
            <h3>Remove Brand Name</h3>
            <form @submit.prevent="deleteBrand">
                <div class="menu">
                    <select id="deleteSelect" v-model="deleteName">
                        <option v-for="(brand, i) in brands" :key="i" :value="brand.brand_id">
                            {{ brand.brand_name }}
                        </option>
                    </select>
                    <button @click.prevent="deleteId">Add to delete</button>
                </div>

                <ul>
                    <li v-for="id in deleteNames" :key="id">{{ id }}</li>
                </ul>
                <input class="button" type="submit" value="Delete Brands">
            </form>
        </article>


        <article class="list">
            <div v-if="isProduct">
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
                            <p v-if="product.brand_id">
                                브랜드: {{ getBrandName(product.brand_id) }}
                            </p>
                            <p>성별: {{ product.sex }}</p>
                            <p>용도: {{ product.is_kids ? '아동용' : '성인용' }}</p>
                            <p v-if="product.category_id">
                                카테고리: {{ getCategoryName(product.category_id) }}
                            </p>
                            <p>판매량: {{ product.sales_quantity }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else-if="isCategory">
                <h2>Categories</h2>
                <ul>
                    <li v-for="category in categories" :key="category.category_id">{{ category.category_name }}</li>
                </ul>
            </div>
            <div v-else>
                <h2>Brands</h2>
                <ul>
                    <li v-for="brand in brands" :key="brand.brand_id">{{ brand.brand_name }}</li>
                </ul>
            </div>
        </article>
    </section>
</template>