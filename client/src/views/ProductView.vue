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
const selectedSexForCreate = ref('')
const selectedSex = ref('')
const inputQty = ref<number>()
const selectedKidTypeForCreate = ref<boolean>()
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

const sortOrder = ref('asc');
const sortColumn = ref('');
const isSearched = ref<boolean>(false)

const errMsgSearch = ref<string>()





async function createProduct() {
    const path = 'product'

    const newProduct = {
        product_name: inputName.value,
        brand_id: selectedBrand.value,
        category_id: selectedCategory.value,
        sex: selectedSexForCreate.value,
        is_kids: selectedKidTypeForCreate.value,
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

function clearSelectedFiles() {
    selectedFiles.value = []
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
    // 기존에 있던 에러 메세지 없애기
    errMsgSearch.value = '';

    await getProducts('product', searchProductNames.value, searchSexes, searchBrandIDs, searchCategoryIDs, searchKids, searchQtys)

    // 검색어 초기화
    clearSearchInputs()

    // 검색 버튼 눌린것 표시
    isSearched.value = true
}

async function showAllProducts() {
    isSearched.value = false
    await getProducts()
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

    try {
        const response = await request.get(fullURL)
        await request.saveResult(path, response) // store에 저장
        errMsgSearch.value = ''; // 에러가 없을 경우 에러메세지를 빈 문자열로 초기화
    } catch (error) {
        errMsgSearch.value = String(error); // error를 문자열로 변환하여 할당
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
        if (file.size > 300000) {
            console.error('파일 크기가 300KB(0.3MB) 넘는 파일이 있다')
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
            <form class="container" @submit.prevent="createProduct" method="post" enctype="multipart/form-data">
                <!-- 제품 이름 -->
                <div class="input-group">
                    <label for="newNameInput">Product Name</label>
                    <input class="input" type="text" id="newNameInput" placeholder="제품이름" v-model="inputName">
                </div>
                <!-- 성별 -->
                <div class="radio-group">
                    <label class="title">Sex</label>

                    <div class="radio-inputs"> <!-- flex 에서 벗어나기 위한 div -->
                        <input class="input" id="radio-male-create" type="radio" name="sex" value="Male(남)"
                            v-model="selectedSexForCreate">
                        <label for="radio-male-create">Male</label>

                        <input class="input" id="radio-female-create" type="radio" name="sex" value="Female(여)"
                            v-model="selectedSexForCreate">
                        <label for="radio-female-create">Female</label>

                        <input class="input" id="radio-unisex-create" type="radio" name="sex" value="Unisex(공용)"
                            v-model="selectedSexForCreate">
                        <label for="radio-unisex-create">Unisex</label>
                    </div>
                </div>
                <!-- 아동용/성인용 -->
                <div class="radio-group">
                    <label class="title">Usage</label>

                    <div class="radio-inputs">
                        <input class="input" id="check-kid-create" type="radio" name="kid" value="true"
                            v-model="selectedKidTypeForCreate">
                        <label for="check-kid-create">For Kids</label>

                        <input class="input" id="check-adult-create" type="radio" name="adult" value="false"
                            v-model="selectedKidTypeForCreate">
                        <label for="check-adult-create">For Adults</label>
                    </div>
                </div>
                <!-- 판매 갯수 -->
                <div class="input-group">
                    <label class="title">Quantity</label>
                    <input class="input" type="number" min="1" v-model="inputQty">
                </div>
                <!-- 관련 브랜드 -->
                <div class="select-group">
                    <label>Relative Brand(Optional)</label>
                    <select v-model="selectedBrand">
                        <option v-for="(brand, i) in brands" :key="i" :value="brand.brand_id">
                            {{ brand.brand_name }}
                        </option>
                    </select>
                </div>
                <!-- 관련 카테고리 -->
                <div class="select-group">
                    <label>Relative Category(Optional)</label>
                    <select id="categorySelect" v-model="selectedCategory">
                        <option v-for="(category, i) in categories" :key="i" :value="category.category_id">
                            {{ category.category_name }}
                        </option>
                    </select>
                </div>
                <!-- 파일 업로드 -->
                <div class="img-upload-group">
                    <label class="title">Images(Optional)</label>

                    <input class="file" type="file" name="imgs" accept="image/*" @change="accumulateList" max="3" multiple>
                    <span v-if="selectedFileError.isOverSized">There are files selected that exceed 300KB</span>
                    <span v-if="selectedFileError.isOverNumbers">Up to 3 files can be saved</span>

                    <!-- 선택된 파일 목록 -->
                    <div v-if="selectedFiles.length > 0" class="inputted-list">
                        <label>Selected Files</label>
                        <ul>
                            <li v-for="file in selectedFiles" :key="file.name">
                                {{ file.name }}
                            </li>
                        </ul>
                        <!-- 선택된 목록 초기화 -->
                        <button class="input-reset-button" @click.prevent="clearSelectedFiles">Clear Files</button>
                    </div>
                </div>
                <!-- 제품 등록 버튼 -->
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
                    <div> <!-- flex 에서 벗어나기 위한 div -->
                        <input class="input" id="searchNamesInput" type="text" v-model="searchWords"
                            placeholder="name, name, ..." @keydown.enter.prevent="selectOption('product_name')">
                        <button @click.prevent="selectOption('product_name')">Enter Names</button>
                    </div>
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
                    <label class="title">Choose Sexes(optional)</label>
                    <div class="radio-inputs"> <!-- flex 에서 벗어나기 위한 div -->
                        <input class="input" id="radio-male" type="radio" name="sex" value="Male(남)" v-model="selectedSex"
                            @change.prevent="selectOption('sex')">
                        <label for="radio-male">Male</label>

                        <input class="input" id="radio-female" type="radio" name="sex" value="Female(여)"
                            v-model="selectedSex" @change.prevent="selectOption('sex')">
                        <label for="radio-female">Female</label>

                        <input class="input" id="radio-unisex" type="radio" name="sex" value="Unisex(공용)"
                            v-model="selectedSex" @change.prevent="selectOption('sex')">
                        <label for="radio-unisex">Unisex</label>
                    </div>

                </div>
                <!-- 검색 성인용/아동용 선택 -->
                <div class="radio-group">
                    <label class="title">Choose Usages(optional)</label>
                    <div class="radio-inputs"> <!-- flex 에서 벗어나기 위한 div -->
                        <input class="input" id="check-kid" type="radio" name="kid" value="true" v-model="selectedKidType"
                            @change.prevent="selectOption('isKid')">
                        <label for="check-kid">For Kids(아동용)</label>

                        <input class="input" id="check-adult" type="radio" name="adult" value="false"
                            v-model="selectedKidType" @change.prevent="selectOption('isKid')">
                        <label for="check-adult">For Adults(성인용)</label>
                    </div>

                </div>
                <!-- 검색 판매량 입력 -->
                <div class="input-group">
                    <label for="salesQtyInput">Enter Quantities(optional)</label>
                    <div> <!-- flex 에서 벗어나기 위한 div -->
                        <input class="input" id="salesQtyInput" type="number" placeholder="Sales Quantity" min="0"
                            v-model="inputQty" @keydown.enter.prevent="selectOption('sales_qty')">
                        <button @click.prevent="selectOption('sales_qty')">Enter Quantity</button>
                    </div>

                </div>
                <!-- 선택된 카테고리 목록 -->
                <div class="inputted-list">
                    <label>Selected Options:</label>
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
                    <!-- 입력한 조건 초기화 -->
                    <button class="input-reset-button" @click.prevent="clearSearchInputs">Clear Options & Inputs</button>
                </div>
                <!-- 검색 버튼 -->
                <input class="button" type="submit" value="Search">
            </form>
            <!-- 에러메시지 -->
            <div v-if="errMsgSearch" class="error-message">{{ errMsgSearch }}</div>
        </article>


        <article class="show">
            <!-- 전체 제품 목록 보이기 -->
            <label class="showAll-label clickable" @click="showAllProducts">Show All Products</label>
        </article>


        <article class="list">
            <!-- 검색 버튼이 클릭됐을 때 정렬된 제품 목록 표시 -->
            <div v-if="isSearched" class="list-group">
                <h3>Searched Products</h3>
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
            </div>
            <div v-else class="list-group">
                <h3>All Products</h3>
            </div>
            <!-- product 목록 보이기 -->
            <div class="product-cards list-group">
                <!-- 검색 버튼의 클릭 여부에 따라 정렬된목록 or 전체목록 보이기-->
                <div v-for="product in (isSearched ? sortedProducts : products)" :key="product.product_id"
                    class="product-card">
                    <div class="product-details">
                        <h3>{{ product.product_name }}</h3>
                        <div v-if="product.brand_id">
                            Brand: {{ getBrandName(product.brand_id) }}
                        </div>
                        <div>Sex: {{ product.sex }}</div>
                        <div>Kid/Adult: {{ product.is_kids ? 'For Kids' : 'For Adults' }}</div>
                        <div v-if="product.category_id">
                            Category: {{ getCategoryName(product.category_id) }}
                        </div>
                        <div>Sales Quantity: {{ product.sales_quantity }}</div>
                    </div>
                    <!-- 제품 사진 -->
                    <template v-if="product.file_paths && product.file_paths.length > 0">
                        <div v-for="filePath in product.file_paths" :key="filePath" class="image-container">
                            <img :src="getImage(filePath)" alt="Product Image" class="product-image" />
                        </div>
                    </template>
                </div>
            </div>
        </article>
    </section>
</template>