<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import CommonApi from '@/api/common'
import { useCounterStore } from '@/stores/counter';


const request = new CommonApi
const counterStore = useCounterStore()


// store를 감시하고, 값이 변경될 때마다 변수 업데이트
const brands = computed(() => counterStore.brandList)
const categories = computed(() => counterStore.categoryList)
const products = computed(() => counterStore.productList)

const inputName = ref('')
const selectedSex = ref('')
const inputQty = ref<number>()
const selectedKidType = ref<boolean>()
const selectedBrand = ref('')
const selectedCategory = ref('')
const selectedFiles = ref<File[]>([])
const selectedFileError = ref({ isOverSized: false, isOverNumbers: false })

const selectedBrands = ref(0)
const selectedCategories = ref(0)
const searchWords = ref('')

let searchProductNames = ref<string[]>([])
let searchBrandIDs: number[] = []
let searchCategoryIDs: number[] = []
let searchSexes: string[] = []
let searchKids: { id: number, value: boolean }[] = []
let searchQtys: number[] = []



async function addProduct() {
    const path = 'product'

    const newProduct = {
        product_name: inputName.value,
        brand_id: selectedBrand.value,
        category_id: selectedCategory.value,
        sex: selectedSex.value,
        is_kids: selectedKidType.value,
        sales_quantity: inputQty.value,
        file_paths: JSON.stringify(selectedFiles.value) // 배열을 JSON 문자열로 변환
    }

    try {
        // 서버로 제품 추가 요청 보내기
        await request.post(path, newProduct)

        // 성공적으로 추가되면, 선택된 파일들 초기화
        selectedFiles.value = []

        // products 갱신
        getProducts()
    } catch (error) {
        console.error('제품 추가 중 에러 발생', error)
    }
}



function selectOption(column: string) {
    let values: string[] = []
    switch (column) {
        case 'product_name':
            values = searchWords.value.replace(/,\s*$/, '').split(",").map((value: string) => value.trim())
            searchProductNames.value.push(...values)
            searchWords.value = ''
            break;
        case 'brand':
            searchBrandIDs.push(selectedBrands.value)
            selectedBrands.value = 0
            break;
        case 'category':
            searchCategoryIDs.push(selectedCategories.value)
            selectedCategories.value = 0
            break;
        case 'sex':
            searchSexes.push(selectedSex.value)
            selectedSex.value = ''
            break;
        case 'isKid':
            selectedKidType.value !== undefined
                ? searchKids.push({ id: searchKids.length + 1, value: selectedKidType.value })
                : null;

            selectedKidType.value = undefined
            break;
        case 'sales_qty':
            typeof inputQty.value === 'number'
                ? searchQtys.push(inputQty.value)
                : undefined

            inputQty.value = undefined
            break;

        default:
            break;
    }
}

function getBrandNameById(id: number) {
    const brandsArray = Array.isArray(brands.value) ? brands.value : [];
    const matchedBrand = brandsArray.find(brand => brand.brand_id === id);

    return matchedBrand ? matchedBrand.brand_name : '';
}

function getCategoryNameById(id: number) {
    const matchedCategory = categories.value.find(category => category.category_id === id);
    return matchedCategory ? matchedCategory.category_name : '';
}

function getUsageByValue(isKid: boolean | string): string {
    const result = isKid === true || isKid === "true" ? 'For Kids(아동용)' : 'For Adults(성인용)';
    return result;
}

function clearSearchInputs() {
    searchProductNames.value = []
    searchSexes = []
    searchBrandIDs = []
    searchCategoryIDs = []
    searchKids = []
    searchQtys = []
}

async function searchProducts() {
    await getProducts('product', searchProductNames.value, searchSexes, searchBrandIDs, searchCategoryIDs, searchKids, searchQtys)
    clearSearchInputs() // 검색어 초기화
}



async function getProducts(path: string = 'product', productNames?: string[], sexes?: string[], brandIDs?: number[], categoryIDs?: number[], IsKids?: { id: number, value: boolean }[], Qtys?: number[]) {
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
            fullURL += `&is_kids=${kid.value}`
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


function accumulateList(e: any) {
    selectedFileError.value.isOverNumbers = false
    selectedFileError.value.isOverSized = false

    const files = e.target.files ? e.target.files : null
    const mergedFiles = [...selectedFiles.value, ...files]

    if (mergedFiles.length > 3) {
        console.error('파일 갯수가 3개보다 많다');
        selectedFileError.value.isOverNumbers = true;
        return;
    }

    for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (file.size > 1000000) {
            console.error('파일 크기가 1MB 넘는 파일이 있다')
            selectedFileError.value.isOverSized = true
            return;
        }
    }

    selectedFiles.value = mergedFiles
}

function getImage(fileName: string) {
    const path = `${import.meta.env.VITE_APP_SERVER_URL}${fileName}`
    return path
}

onMounted(async () => {
    if (!brands.value.length && !categories.value.length && !products.value.length) {
        await getBrands()
        await getCategories()
        await getProducts()
    }

})
</script>

<template>
    <section class="wrapper">
        <article class="create">
            <h3>Add a new Product</h3>
            <form @submit.prevent="addProduct" method="post" enctype="multipart/form-data">
                <div class="input-container">
                    <input class="input" type="text" placeholder="제품이름" v-model="inputName">
                </div>
                <div class="input-container">
                    <input class="input" type="radio" name="sex" value="남" v-model="selectedSex">남
                    <input class="input" type="radio" name="sex" value="여" v-model="selectedSex">여
                    <input class="input" type="radio" name="sex" value="공용" v-model="selectedSex">공용
                </div>
                <div class="input-container">
                    <input class="input" type="number" min="1" v-model="inputQty">
                </div>
                <div class="input-container">
                    <input class="input" type="radio" name="kid" :value="true" v-model="selectedKidType">아동용
                    <input class="input" type="radio" name="kid" :value="false" v-model="selectedKidType">성인용
                </div>

                <div class="menu">
                    <select id="brandSelect" v-model="selectedBrand">
                        <option v-for="(brand, i) in brands" :key="i" :value="brand.brand_id">
                            {{ brand.brand_name }}
                        </option>
                    </select>
                </div>
                <div class="menu">
                    <select id="categorySelect" v-model="selectedCategory">
                        <option v-for="(category, i) in categories" :key="i" :value="category.category_id">
                            {{ category.category_name }}
                        </option>
                    </select>
                </div>

                <div class="input-container">
                    <input class="input" type="file" name="imgs" accept="image/*" @change="accumulateList" max="3" multiple>
                    <span v-if="selectedFileError.isOverSized">선택한 파일 중 1MB를 초과하는 파일이 있습니다.</span>
                    <span v-if="selectedFileError.isOverNumbers">최대 3개의 파일까지 저장 가능합니다.</span>
                    <div v-if="selectedFiles.length > 0">
                        <h4>선택한 파일:</h4>
                        <ul>
                            <li v-for="file in selectedFiles" :key="file.name">{{ file.name }}</li>
                        </ul>
                    </div>
                </div>

                <input class="button" type="submit" value="Create Product"
                    :disabled="inputName.length === 0 || selectedBrand.length === 0 || selectedCategory.length === 0">
            </form>
        </article>


        <article class="search">
            <h3>Look Up Product Names</h3>
            <form @submit.prevent="searchProducts" class="container">
                <!-- 검색어 입력 필드 -->
                <div class="input-group">
                    <label for="searchNamesInput">Enter Names</label>
                    <input class="input" id="searchNamesInput" type="text" v-model="searchWords"
                        placeholder="name, name, ..." @keydown.enter.prevent="selectOption('product_name')">
                    <button @click.prevent="selectOption('product_name')">Enter Names</button>
                </div>
                <!-- 검색 브랜드 선택 -->
                <div class="select-group">
                    <label for="brandSelect">Select Brands(optional)</label>
                    <select id="brandSelect" v-model="selectedBrands" @change.prevent="selectOption('brand')">
                        <option v-for="(brand, i) in brands" :key="i" :value="brand.brand_id">
                            {{ brand.brand_name }}
                        </option>
                    </select>
                </div>
                <!-- 검색 카테고리 선택 -->
                <div class="select-group">
                    <label for="categorySelect">Select Categories(optional)</label>
                    <select id="categorySelect" v-model="selectedCategories" @change.prevent="selectOption('category')">
                        <option v-for="(category, i) in categories" :key="i" :value="category.category_id">
                            {{ category.category_name }}
                        </option>
                    </select>
                </div>
                <!-- 검색 성별 선택 -->
                <div class="radio-group">
                    <label>Choose Sexes(optional)</label>

                    <input class="input" id="radio-male" type="radio" name="sex" value="Male(남)" v-model="selectedSex"
                        @change.prevent="selectOption('sex')">
                    <label for="radio-male">Male(남)</label>

                    <input class="input" id="radio-female" type="radio" name="sex" value="Female(여)" v-model="selectedSex"
                        @change.prevent="selectOption('sex')">
                    <label for="radio-female">Female(여)</label>

                    <input class="input" id="radio-unisex" type="radio" name="sex" value="Unisex(공용)" v-model="selectedSex"
                        @change.prevent="selectOption('sex')">
                    <label for="radio-unisex">Unisex(공용)</label>
                </div>
                <!-- 검색 성인용/아동용 선택 -->
                <div class="check-group">
                    <label>Choose Usages(optional)</label>

                    <input class="input" id="check-kid" type="radio" name="kid" value="true" v-model="selectedKidType"
                        @change.prevent="selectOption('isKid')">
                    <label for="check-kid">For Kids(아동용)</label>

                    <input class="input" id="check-adult" type="radio" name="adult" value="false" v-model="selectedKidType"
                        @change.prevent="selectOption('isKid')">
                    <label for="check-adult">For Adults(성인용)</label>
                </div>
                <!-- 검색 판매량 입력 -->
                <div class="input-group">
                    <label for="salesQtyInput">Enter Quantities(optional)</label>
                    <input class="input" id="salesQtyInput" type="number" placeholder="판매량" min="0" v-model="inputQty"
                        @keydown.enter.prevent="selectOption('sales_qty')">
                    <button @click.prevent="selectOption('sales_qty')">Enter Quantity</button>
                </div>
                <!-- 선택된 카테고리 목록 -->
                <div class="inputted-list">
                    <h4>Selected Options:</h4>
                    <ul>
                        <label v-if="searchProductNames.length > 0" class="option-label">Entered Names</label>
                        <li v-for="name in searchProductNames" :key="name" class="option-item">
                            {{ name }}
                        </li>
                        <label v-if="searchBrandIDs.length > 0" class="option-label">Selected Brands</label>
                        <li v-for="id in searchBrandIDs" :key="id" class="option-item">
                            {{ getBrandNameById(id) }}
                        </li>
                        <label v-if="searchCategoryIDs.length > 0" class="option-label">Selected Categories</label>
                        <li v-for="id in searchCategoryIDs" :key="id" class="option-item">
                            {{ getCategoryNameById(id) }}
                        </li>
                        <label v-if="searchSexes.length > 0" class="option-label">Chosen Sexes</label>
                        <li v-for="sex in searchSexes" :key="sex" class="option-item">
                            {{ sex }}
                        </li>
                        <label v-if="searchKids.length > 0" class="option-label">Chosen Usages</label>
                        <li v-for="isKid in searchKids" :key="isKid.id" class="option-item">
                            {{ getUsageByValue(isKid.value) }}
                        </li>
                        <label v-if="searchQtys.length > 0" class="option-label">Entered Quantities</label>
                        <li v-for="qty in searchQtys" :key="qty" class="option-item">
                            {{ qty }}
                        </li>
                    </ul>
                </div>
                <!-- 입력한 조건 초기화 -->
                <button class="button" @click.prevent="clearSearchInputs">Clear Options & Inputs</button>
                <!-- 검색 버튼 -->
                <input class="button" type="submit" value="Search">
            </form>
        </article>


        <article class="list">
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
        </article>
    </section>
</template>

<style scoped>
.wrapper {
    color: #fff;
    background-color: #333;
}

.product-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    text-align: center;
}

.product-wrapper form {
    margin-bottom: 20px;
}

.product-wrapper label {
    margin-bottom: 10px;
}

.product-wrapper .input-container {
    margin-bottom: 10px;
}

.product-wrapper .menu {
    display: flex;
    align-items: center;
}

.product-wrapper .product-cards {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

.product-wrapper .product-card {
    width: 300px;
    margin: 10px;
    padding: 20px;
    background-color: #f2f2f2;
    text-align: center;
}

.product-wrapper .product-details {
    margin-top: 20px;
    text-align: left;
}

.product-wrapper .product-image {
    width: 100%;
    height: auto;
    margin-bottom: 10px;
}

.product-wrapper .list {
    margin-top: 20px;
}

.product-wrapper .list ul {
    list-style: none;
    padding: 0;
}

.product-wrapper .list li {
    margin-bottom: 5px;
}
</style>