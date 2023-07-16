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

const brandName = ref<string | null>(null)
const brandNames = ref<string[]>([])
const categoryName = ref<string | null>(null)

const updateID = ref<string | null>(null)
const newCategoryName = ref<string | null>(null)

const categoryNames = ref<string[]>([])
const checkedItems = ref<string[]>([])
const isProduct = ref<boolean>(false)
const isBrand = ref<boolean>(false)

const deleteNames = ref<string[]>([])
const deleteName = ref<string | null>(null)




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
    // store에 저장
    if (isProduct.value) {
        await request.saveResult('product', response)
    } else if (isBrand.value) {
        await request.saveResult('brand', response)
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
        fullURL = `${path}/search${fullURL.replace('&', '?')}`;
    } else {
        fullURL = path;
    }

    const response = await request.get(fullURL)
    // store에 저장
    if (isProduct.value) {
        await request.saveResult('product', response)
    } else if (isBrand.value) {
        await request.saveResult('brand', response)
    } else {
        await request.saveResult(path, response)
    }
}

function addId() {
    if (brandName.value !== null && !brandNames.value.includes(brandName.value)) {
        brandNames.value.push(brandName.value);
        brandName.value = null;
    }
}

async function addCategory() {
    const path = 'category'
    let body: any = {}
    const IDs = Object.values(brandNames.value)

    body.category_name = categoryName.value
    if (IDs.length > 0) body.brand_ids = IDs

    body = JSON.stringify(body)

    categoryName.value = ''
    brandName.value = null
    brandNames.value = []

    await request.post(path, body)
    getCategories() // categories 갱신

}

async function updateCategory() {
    let fullURL: string = ''
    const path = 'category'
    let body: any = {}

    fullURL = `${path}/${updateID.value}`

    body.category_name = newCategoryName.value
    body = JSON.stringify(body)

    newCategoryName.value = ''

    const response = await request.update(fullURL, body);
    await request.saveResult(path, response);

}

function onCheckboxChange(checkbox) {
    if (checkbox === 'na') {
        this.checkedItems = ['na'];
    } else if (checkbox === 'brand' || checkbox === 'product') {
        if (this.checkedItems.includes('na')) {
            this.checkedItems = [checkbox];
        }
    }
}

async function searchCategories() {
    // 맨 마지막 콤마 제거 -> 콤마 나오면 분리
    const values: string[] = categoryNames.value.replace(/,\s*$/, '').split(",")
    // 각 값의 앞뒤 공백 제거
    const cNames = values.map((value) => value.trim())

    const tables = Object.values(checkedItems.value)
    const product = tables.includes('product')
    const brand = tables.includes('brand')

    if (product && brand) {
        isProduct.value = true
        isBrand.value = true
        await getCategories('category', cNames, true, true)
    } else if (product) {
        isProduct.value = true
        await getCategories('category', cNames, undefined, true)
    } else if (brand) {
        isProduct.value = false
        isBrand.value = true
        await getCategories('category', cNames, true)
    } else {
        isProduct.value = false
        await getCategories('category', cNames)
    }
}

function getImage(name: string) {
    const path = `../../${name}`
    return new URL(path, import.meta.url).href
}

async function deleteId() {
    if (deleteName.value !== null && !deleteNames.value.includes(deleteName.value)) {
        deleteNames.value.push(deleteName.value);
        deleteName.value = null;
    }
}

async function deleteCategory() {
    let fullURL: string = ''
    const path = 'category'
    const IDs = Object.values(deleteNames.value)

    for (const el of IDs) {
        console.log(el)
        fullURL = `category/${el}`
        const response = await request.delete(fullURL);
        await request.saveResult(path, response);
    }

    deleteNames.value = ''
    getCategories() // categories 갱신
}

onMounted(() => {
    if (!brands.value.length && !categories.value.length) {
        getBrands()
        getCategories()
    }
})

</script>

<template>
    <section class="wrapper">
        <article class="create">
            <h3>Add a new category name</h3>
            <form @submit.prevent="addCategory">
                <label for="brandSelect">Select Relative Brand with the Category</label>
                <div class="menu">
                    <select id="brandSelect" v-model="brandName">
                        <option v-for="(brand, i) in brands" :key="i" :value="brand.brand_id">
                            {{ brand.brand_name }}
                        </option>
                    </select>
                    <button @click.prevent="addId">Add</button>
                </div>

                <div class="inputted_brand">
                    <ul>
                        <li v-for="id in brandNames" :key="id">{{ id }}</li>
                    </ul>
                </div>
                <input class="input" type="text" v-model="categoryName" placeholder="Input Category name">
                <input class="button" type="submit" value="Create Category">
            </form>
        </article>


        <article class="update">
            <h3>Update Category Name</h3>
            <form @submit.prevent="updateCategory">
                <div class="menu">
                    <select id="updateSelect" v-model="updateID">
                        <option v-for="(category, i) in categories" :key="i" :value="category.category_id">
                            {{ category.category_name }}
                        </option>
                    </select>
                    TO
                </div>
                <input class="input" type="text" v-model="newCategoryName" placeholder="New Category name">
                <input class="button" type="submit" value="Update Category">
            </form>
        </article>


        <article class="search">
            <h3>Look Up Category Names</h3>
            <form @submit.prevent="searchCategories">
                <input class="input" type="text" v-model="categoryNames" placeholder="name, name, ...">

                <input id="ch_na" type="checkbox" v-model="checkedItems" value="na" @change="onCheckboxChange('na')" />
                <label for="ch_na">N/A</label>

                <input id="ch_brand" type="checkbox" v-model="checkedItems" value="brand"
                    @change="onCheckboxChange('brand')" />
                <label for="ch_brand">For the brands</label>

                <input id="ch_product" type="checkbox" v-model="checkedItems" value="product"
                    @change="onCheckboxChange('product')" />
                <label for="ch_product">For the products</label>

                <input class="button" type="submit" value="Submit" :disabled="categoryNames.length === 0">
            </form>
        </article>


        <article class="delete">
            <h3>Remove Category Name</h3>
            <form @submit.prevent="deleteCategory">
                <div class="menu">
                    <select id="deleteSelect" v-model="deleteName">
                        <option v-for="(category, i) in categories" :key="i" :value="category.category_id">
                            {{ category.category_name }}
                        </option>
                    </select>
                    <button @click.prevent="deleteId">Add to delete</button>
                </div>

                <ul>
                    <li v-for="id in deleteNames" :key="id">{{ id }}</li>
                </ul>
                <input class="button" type="submit" value="Delete Categories">
            </form>
        </article>


        <article class="list">
            <div v-if="isProduct">
                <h2>Products</h2>
                <div class="product-cards">
                    <div v-for="product in products" :key="product.category_id" class="product-card">
                        <template v-if="product.file_paths && product.file_paths.length > 0">
                            <div v-for="filePath in product.file_paths" :key="filePath" class="image-container">
                                <img :src="getImage(filePath)" alt="Product Image" class="product-image" />
                            </div>
                        </template>
                        <div class="product-details">
                            <h3>{{ product.product_name }}</h3>
                            <p>브랜드: {{
                                brands.find((b) => b.brand_id === product.brand_id).brand_name }}</p>
                            <p>성별: {{ product.sex }}</p>
                            <p>용도: {{ product.is_kids ? '아동용' : '성인용' }}</p>
                            <p>카테고리: {{
                                categories.find((c) => c.category_id === product.category_id).category_name }}</p>
                            <p>판매량: {{ product.sales_quantity }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else-if="isBrand">
                <h2>Brands</h2>
                <ul>
                    <li v-for="brand in brands" :key="brand.brand_id">{{ brand.brand_name }}</li>
                </ul>
            </div>
            <div v-else>
                <h2>Categories</h2>
                <ul>
                    <li v-for="category in categories" :key="category.category_id">{{ category.category_name }}</li>
                </ul>
            </div>
        </article>
    </section>
</template>