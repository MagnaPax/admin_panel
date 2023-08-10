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


const brandName = ref<string | null>(null)
const searchNames = ref<string>('')
const selectedCategory = ref<string | null>(null)
const selectedCategories = ref<string[]>([])
const checkedItems = ref<string[]>([])
const deleteName = ref<string | null>(null)
const deleteNames = ref<string[]>([])
const updateID = ref<string | null>(null)
const newBrandName = ref<string | null>(null)
const isProduct = ref<boolean>(false)
const isCategory = ref<boolean>(false)
const errMsgCreate = ref<string>()
const errMsgSearch = ref<string>()

const sortOrder = ref('asc');
const sortColumn = ref('');




function makeCategoryList() {
    if (selectedCategory.value !== null && !selectedCategories.value.includes(selectedCategory.value)) {
        selectedCategories.value.push(selectedCategory.value)
        selectedCategory.value = null
    }
}

function getCategoryNameById(id: string) {
    const numberId = Number(id);
    const matchedCategory = categories.value.find(category => category.category_id === numberId);
    return matchedCategory ? matchedCategory.category_name : '';
}

function clearCategories() {
    selectedCategories.value = [];
}

async function createBrand() {
    const path = 'brand'
    let body: any = {}
    const IDs = Object.values(selectedCategories.value)

    body.brand_name = brandName.value
    if (IDs.length > 0) body.category_ids = IDs

    body = JSON.stringify(body)

    brandName.value = ''
    selectedCategory.value = null
    selectedCategories.value = []

    try {
        const response = await request.post(path, body)
        await request.saveResult(path, response)
        errMsgCreate.value = ''; // 에러가 없을 경우 에러메세지를 빈 문자열로 초기화
        getBrands() // brands 갱신
    } catch (error) {
        const axiosError = error as AxiosError<any, any>; // 'error' 변수를 명시적으로 AxiosError<any, any> 타입으로 지정
        errMsgCreate.value = handleErrorResponse(axiosError)
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



function onCheckboxChange(checkbox: string) {
    checkedItems.value = [checkbox];
}

async function searchBrands() {

    // 맨 마지막 콤마 제거 -> 콤마 나오면 분리
    const values = searchNames.value.replace(/,\s*$/, '').split(",")

    // 각 값의 앞뒤 공백 제거하고 중복 제거
    const bNames = Array.from(new Set(values.map((value) => value.trim()))).filter(Boolean)

    // 단어가 한 개만 들어오는 경우, 두 개로 복사하여 추가(백엔드 설계 결함)
    if (bNames.length === 1) {
        bNames.push(bNames[0])
    }

    const tables = Object.values(checkedItems.value)
    const product = tables.includes('product')
    const category = tables.includes('category')


    if (!product && !category) {
        isProduct.value = false
        isCategory.value = false
        await getBrands('brand', bNames)
    } else if (category) {
        isProduct.value = false
        isCategory.value = true
        await getBrands('brand', bNames, true)
    } else if (product) {
        isProduct.value = true
        isCategory.value = false
        await getBrands('brand', bNames, false, true)
    }
}



async function makeBrandList() {
    if (deleteName.value !== null && !deleteNames.value.includes(deleteName.value)) {
        deleteNames.value.push(deleteName.value)
        deleteName.value = null
    }
}

function clearDeleteList() {
    deleteNames.value = [];
}

function getBrandNameById(id: string) {
    const numberId = Number(id);
    const brandsArray = Array.isArray(brands.value) ? brands.value : [];

    const nameToDelete = brandsArray.find(brand => brand.brand_id === numberId);
    return nameToDelete ? nameToDelete.brand_name : '';
}

async function deleteBrand() {
    const path = 'brand';
    const IDs = Object.values(deleteNames.value);

    for (const el of IDs) {
        console.log(el);
        const fullURL = `brand/${el}`;
        try {
            const response = await request.delete(fullURL);
            if (response) {
                await request.saveResult(path, response);
                await getBrands(); // brands 갱신
            }
            deleteNames.value = [];
        } catch (error) {
            console.error('Error deleting brand:', error);
        }
    }
}



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

    try {
        const response = await request.get(fullURL)
        // store에 저장
        if (isProduct.value) {
            await request.saveResult('product', response)
        } else if (isCategory.value) {
            await request.saveResult('category', response)
        } else {
            await request.saveResult(path, response)
        }
        errMsgSearch.value = ''; // 에러가 없을 경우 에러메세지를 빈 문자열로 초기화
    } catch (error) {
        errMsgSearch.value = String(error); // error를 문자열로 변환하여 할당
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

function showAllBrands() {
    isProduct.value = false
    isCategory.value = false
}

onMounted(async () => {
    await getBrands()
    await getCategories()
})
</script>

<template>
    <section class="wrapper">
        <article class="create">
            <h3>Add a new brand</h3>
            <form class="container">
                <!-- 추가할 새로운 브랜드 이름 입력 -->
                <div class="input-group">
                    <label for="newNameInput">Brand Name</label>
                    <input class="input" type="text" id="newNameInput" v-model="brandName" placeholder="Enter Brand Name">
                </div>
                <!-- 입력된 브랜드와 관련된 카테고리 선택 -->
                <div class="select-group">
                    <label for="categorySelect">Relative Category(Optional)</label>
                    <select id="categorySelect" v-model="selectedCategory" @change.prevent="makeCategoryList">
                        <option v-for="(category, i) in categories" :key="i" :value="category.category_id">
                            {{ category.category_name }}
                        </option>
                    </select>
                </div>
                <!-- 선택된 카테고리 목록 -->
                <div class="inputted-list">
                    <h4>Selected Categories:</h4>
                    <ul>
                        <li v-for="id in selectedCategories" :key="id">
                            {{ getCategoryNameById(id) }}
                        </li>
                    </ul>
                </div>
                <button class="button" @click.prevent="clearCategories">Clear Categories</button>
                <button class="button" @click.prevent="createBrand" :disabled="!brandName">Create Brand</button>
            </form>
            <div v-if="errMsgCreate" class="error-message">{{ errMsgCreate }}</div>
        </article>


        <article class="update">
            <h3>Update Brand Name</h3>
            <form @submit.prevent="updateBrand" class="container">
                <div class="select-group">
                    <!-- 수정할 브랜드 선택 -->
                    <label for="updateSelect">Original Brand Name</label>
                    <select id="updateSelect" v-model="updateID">
                        <option v-for="(brand, i) in brands" :key="i" :value="brand.brand_id">
                            {{ brand.brand_name }}
                        </option>
                    </select>
                </div>
                TO
                <!-- 바꿀 이름 입력 -->
                <input class="input" type="text" v-model="newBrandName" placeholder="New Brand name">
                <input class="button" type="submit" value="Update Brand">
            </form>
        </article>


        <article class="delete">
            <h3>Remove Brand Name</h3>
            <form @submit.prevent="deleteBrand" class="container">
                <!-- 삭제할 브랜드 이름들 선택 -->
                <div class="select-group">
                    <select id="deleteSelect" v-model="deleteName" @change.prevent="makeBrandList">
                        <option v-for="(brand, i) in brands" :key="i" :value="brand.brand_id">
                            {{ brand.brand_name }}
                        </option>
                    </select>
                </div>
                <!-- 선택된 브랜드 목록 -->
                <div class="inputted-list">
                    <h4>Selected Brands:</h4>
                    <ul>
                        <li v-for="id in deleteNames" :key="id">
                            {{ getBrandNameById(id) }}
                        </li>
                    </ul>
                </div>
                <!-- 선택된 목록 초기화 -->
                <button class="button" @click.prevent="clearDeleteList">Clear List</button>
                <input class="button" type="submit" value="Delete Brands" :disabled="deleteNames.length == 0">
            </form>
        </article>


        <article class="search">
            <h3>Look Up Brand Names</h3>
            <form @submit.prevent="searchBrands" class="container">
                <!-- 검색어 입력 필드 -->
                <div class="input-group">
                    <label for="searchNameInput">Search Names</label>
                    <input class="input" id="searchNameInput" type="text" v-model="searchNames"
                        placeholder="name, name, ...">
                </div>
                <!-- 입력한 검색어와 관련된 테이블 체크 -->
                <div class="check-group">
                    <input id="ch_category" type="checkbox" v-model="checkedItems" value="category"
                        @change="onCheckboxChange('category')" />
                    <label for="ch_category">For the categories(입력한 브랜드와 관련된 카테고리 목록)</label>

                    <input id="ch_product" type="checkbox" v-model="checkedItems" value="product"
                        @change="onCheckboxChange('product')" />
                    <label for="ch_product">For the products(입력한 브랜드와 관련된 제품 목록)</label>
                </div>
                <input class="button" type="submit" value="Submit" :disabled="searchNames.length === 0">
            </form>
            <div v-if="errMsgSearch" class="error-message">{{ errMsgSearch }}</div>
        </article>


        <article class="show">
            <!-- 전체 브랜드 목록 보이기 -->
            <label class="showAll-label clickable" @click="showAllBrands">Show All Brands</label>
        </article>


        <article class="list">
            <!-- 검색어가 입력되었을 때, 정렬된 제품 목록 표시 -->
            <div v-if="isProduct">
                <h2>Products</h2>
                <!-- 오름차순/내림차순 정렬 할 product 칼럼 선택 -->
                <div class="sort-labels">
                    <label @click="sortProducts('product_name')" class="sort-label clickable">Product Name</label>
                    <label @click="sortProducts('brand_id')" class="sort-label clickable">Brand</label>
                    <label @click="sortProducts('sex')" class="sort-label clickable">Sex</label>
                    <label @click="sortProducts('is_kids')" class="sort-label clickable">Kid/Adult</label>
                    <label @click="sortProducts('category_id')" class="sort-label clickable">Category</label>
                    <label @click="sortProducts('sales_quantity')" class="sort-label clickable">Sales
                        Quantity</label>
                </div>
                <!-- 정렬된 product 목록 보이기 -->
                <div class="product-cards">
                    <div v-for="product in sortedProducts" :key="product.product_id" class="product-card">
                        <template v-if="product.file_paths && product.file_paths.length > 0">
                            <div v-for="filePath in product.file_paths" :key="filePath" class="image-container">
                                <img :src="getImage(filePath)" alt="Product Image" class="product-image" />
                            </div>
                        </template>
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
                    </div>
                </div>
            </div>
            <!-- 카테고리 목록 보이기 -->
            <div v-else-if="isCategory" class="list-group">
                <h2>Categories</h2>
                <ul>
                    <li v-for="category in categories" :key="category.category_id">{{ category.category_name }}
                    </li>
                </ul>
            </div>
            <!-- 브랜드 목록 보이기 -->
            <div v-else class="list-group">
                <h2>Brands</h2>
                <ul>
                    <li v-for="brand in brands" :key="brand.brand_id">{{ brand.brand_name }}
                    </li>
                </ul>
            </div>
        </article>
    </section>
</template>

<style scoped>
.brand-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    text-align: center;
}

.brand-wrapper form {
    margin-bottom: 20px;
}

.brand-wrapper label {
    margin-bottom: 10px;
}

.brand-wrapper .menu {
    display: flex;
    align-items: center;
}

.brand-wrapper .inputted_category {
    margin-bottom: 20px;
}

.brand-wrapper .inputted_category ul {
    list-style: none;
    padding: 0;
}

.brand-wrapper .inputted_category li {
    margin-bottom: 5px;
}

.brand-wrapper .list {
    margin-top: 20px;
}

.brand-wrapper .list ul {
    list-style: none;
    padding: 0;
}

.brand-wrapper .list li {
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