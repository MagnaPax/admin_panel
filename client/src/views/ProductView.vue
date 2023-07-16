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

const inputName = ref('')
const selectedSex = ref('')
const inputQty = ref(0)
const selectedKidType = ref('')
const selectedBrand = ref('')
const selectedCategory = ref('')
const selectedFiles = ref([''])



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

async function addProduct() {
    const path = 'product'

    const newProduct = {
        product_name: inputName.value,
        brand_id: selectedBrand.value,
        category_id: selectedCategory.value,
        sex: selectedSex.value,
        is_kids: selectedKidType.value === 'children',
        sales_quantity: inputQty.value
    };

    await request.post(path, newProduct)
    getProducts() // products 갱신
}

function handleFileSelection(event) {
    const files = event.target.files;
    // 여러 개의 파일 선택 시, 기존에 선택한 파일 배열에 추가
    for (let i = 0; i < files.length; i++) {
        this.selectedFiles.push(files[i]);
    }
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
    if (!brands.value.length && !categories.value.length && !products.value.length) {
        getBrands()
        getCategories()
        getProducts()
    }
})
</script>

<template>
    <section class="wrapper">
        <article class="create">
            <h3>Add a new Product</h3>
            <form @submit.prevent="addProduct">
                <div class="input-container">
                    <input class="input" type="text" placeholder="제품이름" v-model="inputName">
                </div>
                <div class="input-container">
                    <input class="input" type="radio" name="sex" value="남" v-model="selectedSex">남
                    <input class="input" type="radio" name="sex" value="여" v-model="selectedSex">여
                    <input class="input" type="radio" name="sex" value="공용" v-model="selectedSex">공용
                </div>
                <div class="input-container">
                    <input class="input" type="number" placeholder="판매량" min="1" v-model="inputQty">
                </div>
                <div class="input-container">
                    <input class="input" type="radio" name="kid" value="children" v-model="selectedKidType">아동용
                    <input class="input" type="radio" name="kid" value="adults" v-model="selectedKidType">성인용
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
                    <input class="input" type="file" accept="image/*" multiple @change="handleFileSelection">
                    <div v-if="selectedFiles.length > 0">
                        <h4>선택한 파일:</h4>
                        <ul>
                            <li v-for="file in selectedFiles" :key="file.name">{{ file.name }}</li>
                        </ul>
                    </div>
                </div>
                <input class="button" type="submit" value="Create Product" :disabled="inputName.length === 0">
            </form>
        </article>







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