<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import CommonApi from '@/api/common'
import { useCounterStore } from '@/stores/counter'
import { type AxiosError } from 'axios'
import { handleErrorResponse } from '@/api/interceptors'

const request = new CommonApi
const counterStore = useCounterStore()


// store를 감시하고, 값이 변경될 때마다 변수 업데이트
const brands = computed(() => counterStore.brandList)
const categories = computed(() => counterStore.categoryList)
const products = computed(() => counterStore.productList)


const categoryName = ref<string | null>(null)
const selectedBrand = ref<string | null>(null)
const selectedBrands = ref<string[]>([])
const updateID = ref<string | null>(null)
const newCategoryName = ref<string | null>(null)
const searchNames = ref<string>('')
const checkedItems = ref<string[]>([])
const isProduct = ref<boolean>(false)
const isBrand = ref<boolean>(false)
const deleteNames = ref<string[]>([])
const deleteName = ref<string | null>(null)
const errMsgSearch = ref<string>()
const errMsgCreate = ref<string>()

const sortOrder = ref('asc');
const sortColumn = ref('');




function makeBrandList() {
    if (selectedBrand.value !== null && !selectedBrands.value.includes(selectedBrand.value)) {
        selectedBrands.value.push(selectedBrand.value)
        selectedBrand.value = null
    }
}

function getBrandNameById(id: string) {
    const numberId = Number(id);
    const matchedBrand = brands.value.find(brand => brand.brand_id === numberId);
    return matchedBrand ? matchedBrand.brand_name : '';
}

function clearBrands() {
    selectedBrands.value = [];
}

async function createCategory() {
    const path = 'category'
    let body: any = {}
    const IDs = Object.values(selectedBrands.value)

    body.category_name = categoryName.value
    if (IDs.length > 0) body.brand_ids = IDs

    body = JSON.stringify(body)

    categoryName.value = ''
    selectedBrand.value = null
    selectedBrands.value = []

    try {
        const response = await request.post(path, body)
        await request.saveResult(path, response)
        errMsgCreate.value = ''; // 에러가 없을 경우 에러메세지를 빈 문자열로 초기화
        getCategories() // categories 갱신
    } catch (error) {
        const axiosError = error as AxiosError<any, any>; // 'error' 변수를 명시적으로 AxiosError<any, any> 타입으로 지정
        errMsgCreate.value = handleErrorResponse(axiosError)
    }
}



async function updateCategory() {
    let fullURL: string = ''
    const path = 'category'
    let body: any = {}

    fullURL = `${path}/${updateID.value}`

    body.category_name = newCategoryName.value
    body = JSON.stringify(body)

    newCategoryName.value = ''

    const response = await request.update(fullURL, body)
    await request.saveResult(path, response)

    getCategories() // categories 갱신
}



function onCheckboxChange(checkbox: string) {
    checkedItems.value = [checkbox];
}

async function searchCategories() {

    // 맨 마지막 콤마 제거 -> 콤마 나오면 분리
    const values = searchNames.value.replace(/,\s*$/, '').split(",")

    // 각 값의 앞뒤 공백 제거하고 중복 제거
    const cNames = Array.from(new Set(values.map((value) => value.trim()))).filter(Boolean)

    // 단어가 한 개만 들어오는 경우, 두 개로 복사하여 추가(백엔드 설계 결함)
    if (cNames.length === 1) {
        cNames.push(cNames[0])
    }

    const tables = Object.values(checkedItems.value)
    const product = tables.includes('product')
    const brand = tables.includes('brand')


    if (!product && !brand) {
        isProduct.value = false
        isBrand.value = false
        await getCategories('category', cNames)
    } else if (brand) {
        isProduct.value = false
        isBrand.value = true
        await getCategories('category', cNames, true)
    } else if (product) {
        isProduct.value = true
        isBrand.value = false
        await getCategories('category', cNames, false, true)
    }
}



async function makeCategoryList() {
    if (deleteName.value !== null && !deleteNames.value.includes(deleteName.value)) {
        deleteNames.value.push(deleteName.value)
        deleteName.value = null
    }
}

function clearDeleteList() {
    deleteNames.value = [];
}

function getCategoryNameById(id: string) {
    const numberId = Number(id);
    const categoryArray = Array.isArray(categories.value) ? categories.value : [];

    const namesToDelete = categoryArray.find(category => category.category_id === numberId);
    return namesToDelete ? namesToDelete.category_name : '';
}

async function deleteCategory() {
    const path = 'category';
    const IDs = Object.values(deleteNames.value);

    for (const el of IDs) {
        console.log(el);
        const fullURL = `category/${el}`;
        try {
            const response = await request.delete(fullURL);
            if (response) {
                await request.saveResult(path, response);
                await getCategories(); // categories 갱신
            }
            deleteNames.value = [];
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    }
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
        fullURL = `${path}/search${fullURL.replace('&', '?')}`
    } else {
        fullURL = path
    }

    try {
        const response = await request.get(fullURL)
        // store에 저장
        if (isProduct.value) {
            await request.saveResult('product', response)
        } else if (isBrand.value) {
            await request.saveResult('brand', response)
        } else {
            await request.saveResult(path, response)
        }
        errMsgSearch.value = ''; // 에러가 없을 경우 에러메세지를 빈 문자열로 초기화
    } catch (error) {
        errMsgSearch.value = String(error); // error를 문자열로 변환하여 할당
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
    } else if (isBrand.value) {
        await request.saveResult('brand', response)
    } else {
        await request.saveResult(path, response)
    }
}

function getImage(fileName: string) {
    const path = `${import.meta.env.VITE_APP_SERVER_URL}${fileName}`
    return path
}

function getBrandName(brandId: number) {
    // brandId 가 null혹은 undefined일 때
    const brand = brands.value.find((b) => b.brand_id === brandId);
    return brand ? brand.brand_name : 'Unknown';
}

function getCategoryName(categoryId: number) {
    // categoryId가 null 혹은 undefined일 때
    const category = categories.value.find((c) => c.category_id === categoryId);
    return category ? category.category_name : 'Unknown';
}

const sortedProducts = computed(() => {
    const sorted = [...products.value];
    sorted.sort((a, b) => {
        const col = sortColumn.value;

        // Add an index signature to the object type
        const indexedA = a as Record<string, any>;
        const indexedB = b as Record<string, any>;

        if (sortOrder.value === 'asc') {
            return indexedA[col] < indexedB[col] ? -1 : 1;
        } else {
            return indexedA[col] > indexedB[col] ? -1 : 1;
        }
    });
    return sorted;
});

function sortProducts(column: string) {
    // 같은 column 을 또 눌렀다면 정렬순서(sortOrder)를 변경
    if (sortColumn.value === column) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    } else {
        // 새로운 column 이라면 정렬된 열(sortColumn)을 바꾼 뒤 정렬순서를 오름차순으로 설정
        sortColumn.value = column;
        sortOrder.value = 'asc';
    }
}

function showAllCategories() {
    isProduct.value = false
    isBrand.value = false
}

onMounted(async () => {
    await getBrands()
    await getCategories()
})

</script>

<template>
    <section class="wrapper">
        <article class="create">
            <h3>Add a new category</h3>
            <form class="container">
                <div class="input-group">
                    <label for="newNameInput">Category Name</label>
                    <input class="input" type="text" id="newNameInput" v-model="categoryName"
                        placeholder="Enter Category Name">
                </div>
                <div class="select-group">
                    <label for="brandSelect">Relative Brands(Optional)</label>
                    <select id="brandSelect" v-model="selectedBrand" @change.prevent="makeBrandList">
                        <option v-for="(brand, i) in brands" :key="i" :value="brand.brand_id">
                            {{ brand.brand_name }}
                        </option>
                    </select>
                </div>
                <div class="inputted-list">
                    <label>Selected Brands</label>
                    <ul>
                        <li v-for="id in selectedBrands" :key="id">
                            {{ getBrandNameById(id) }}
                        </li>
                    </ul>
                    <!-- 선택된 목록 초기화 -->
                    <button class="input-reset-button" @click.prevent="clearBrands">Clear Brands</button>
                </div>
                <button class="button" @click.prevent="createCategory" :disabled="!categoryName">Create
                    Category</button>
            </form>
            <div v-if="errMsgCreate" class="error-message">{{ errMsgCreate }}</div>
        </article>


        <article class="update">
            <h3>Update Category Name</h3>
            <form class="container" @submit.prevent="updateCategory">
                <div class="select-group">
                    <label for="updateSelect">Original Category Name</label>
                    <select id="updateSelect" v-model="updateID">
                        <option v-for="(category, i) in categories" :key="i" :value="category.category_id">
                            {{ category.category_name }}
                        </option>
                    </select>
                </div>
                <label class="from-to">TO</label>
                <input class="input" type="text" v-model="newCategoryName" placeholder="New Category name">
                <input class="button" type="submit" value="Update Category">
            </form>
        </article>


        <article class="delete">
            <h3>Remove Category Name</h3>
            <form @submit.prevent="deleteCategory" class="container">
                <div class="select-group">
                    <select id="deleteSelect" v-model="deleteName" @change.prevent="makeCategoryList">
                        <option v-for="(category, i) in categories" :key="i" :value="category.category_id">
                            {{ category.category_name }}
                        </option>
                    </select>
                </div>

                <div class="inputted-list">
                    <label>Selected Categories:</label>
                    <ul>
                        <li v-for="id in deleteNames" :key="id">
                            {{ getCategoryNameById(id) }}
                        </li>
                    </ul>
                    <!-- 선택된 목록 초기화 -->
                    <button class="input-reset-button" @click.prevent="clearDeleteList">Clear List</button>
                </div>
                <input class="button" type="submit" value="Delete Categories" :disabled="deleteNames.length == 0">
            </form>
        </article>


        <article class="search">
            <h3>Look Up Category Names</h3>
            <form @submit.prevent="searchCategories" class="container">
                <div class="input-group">
                    <label for="searchNamesInput">Search Names</label>
                    <input class="input" id="searchNamesInput" type="text" v-model="searchNames"
                        placeholder="name, name, ...">
                </div>

                <div class="check-group">
                    <input id="ch_brand" type="checkbox" v-model="checkedItems" value="brand"
                        @change.prevent="onCheckboxChange('brand')" />
                    <label for="ch_brand">For the brands(입력한 카테고리와 관련된 브랜드 목록)</label>

                    <input id="ch_product" type="checkbox" v-model="checkedItems" value="product"
                        @change.prevent="onCheckboxChange('product')" />
                    <label for="ch_product">For the products(입력한 카테고리와 관련된 제품 목록)</label>
                </div>

                <input class="button" type="submit" value="Submit" :disabled="searchNames.length === 0">
            </form>
            <div v-if="errMsgSearch" class="error-message">{{ errMsgSearch }}</div>
        </article>


        <article class="show">
            <!-- 전체 브랜드 목록 보이기 -->
            <label class="showAll-label clickable" @click="showAllCategories">Show All Categories</label>
        </article>


        <article class="list">
            <!-- 검색어가 입력되었을 때, 정렬된 제품 목록 표시 -->
            <div v-if="isProduct" class="list-group">
                <h3>Products</h3>
                <!-- 오름차순/내림차순 정렬 할 product 칼럼 선택 -->
                <div class="sort-option-group">
                    <h4>Sort By</h4>
                    <div class="sort-labels">
                        <label @click="sortProducts('product_name')" class="sort-label clickable">Product Name</label>
                        <label @click="sortProducts('brand_id')" class="sort-label clickable">Brand</label>
                        <label @click="sortProducts('sex')" class="sort-label clickable">Sex</label>
                        <label @click="sortProducts('is_kids')" class="sort-label clickable">Kid/Adult</label>
                        <label @click="sortProducts('category_id')" class="sort-label clickable">Category</label>
                        <label @click="sortProducts('sales_quantity')" class="sort-label clickable">Sales
                            Quantity</label>
                    </div>
                </div>

                <!-- 정렬된 product 목록 보이기 -->
                <div class="product-cards">
                    <div v-for="product in sortedProducts" :key="product.product_id" class="product-card">

                        <div class="product-details">
                            <h3>{{ product.product_name }}</h3>
                            <p v-if="product.brand_id">
                                Brand: {{ getBrandName(product.brand_id) }}
                            </p>
                            <p>Sex: {{ product.sex }}</p>
                            <p>Kid/Adult: {{ product.is_kids ? 'For Kids' : 'For Adults' }}</p>
                            <p v-if="product.category_id">
                                Category: {{ getCategoryName(product.category_id) }}
                            </p>
                            <p>Sales Quantity: {{ product.sales_quantity }}</p>
                        </div>
                        <!-- 제품 사진 -->
                        <template v-if="product.file_paths && product.file_paths.length > 0">
                            <div v-for="filePath in product.file_paths" :key="filePath" class="image-container">
                                <img :src="getImage(filePath)" alt="Product Image" class="product-image" />
                            </div>
                        </template>
                    </div>
                </div>
            </div>
            <div v-else-if="isBrand" class="list-group">
                <h3>Brands</h3>
                <ul>
                    <li v-for="brand in brands" :key="brand.brand_id">{{ brand.brand_name }}</li>
                </ul>
            </div>
            <div v-else class="list-group">
                <h3>Categories</h3>
                <ul>
                    <li v-for="category in categories" :key="category.category_id">{{ category.category_name }}</li>
                </ul>
            </div>
        </article>
    </section>
</template>

<style scoped>
.category-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    text-align: center;
}

.category-wrapper form {
    margin-bottom: 20px;
}

.category-wrapper label {
    margin-bottom: 10px;
}

.category-wrapper .menu {
    display: flex;
    align-items: center;
}

.category-wrapper .inputted_brand {
    margin-bottom: 20px;
}

.category-wrapper .inputted_brand ul {
    list-style: none;
    padding: 0;
}

.category-wrapper .inputted_brand li {
    margin-bottom: 5px;
}

.category-wrapper .list {
    margin-top: 20px;
}

.category-wrapper .list ul {
    list-style: none;
    padding: 0;
}

.category-wrapper .list li {
    margin-bottom: 5px;
}

/* 에러 메시지 스타일 */
.error-message {
    color: red;
    font-weight: bold;
    margin-top: 10px;
}

/* 정렬 */
.sort-labels {
    display: flex;
    gap: 10px;
}

.clickable {
    cursor: pointer;
}

.sort-label:hover {
    color: red;
}
</style>