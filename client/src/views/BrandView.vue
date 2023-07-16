<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import CommonApi from '@/api/common'
import { useCounterStore } from '@/stores/counter';


const request = new CommonApi
const counterStore = useCounterStore()

// store의 값이 변경될때마다 적용
const brands = computed(() => counterStore.brandList as { brand_id: number; brand_name: string; }[])
const categories = computed(() => counterStore.categoryList as { category_id: number; category_name: string; }[])

const brandName = ref<string | null>(null)
const brandNames = ref<string[]>([])
const categoryName = ref<string | null>(null)
const categoryNames = ref<string[]>([])
const checkedItems = ref<string[]>([])
const deleteName = ref<string | null>(null)
const deleteNames = ref<string[]>([])
const updateID = ref<string | null>(null)
const newBrandName = ref<string | null>(null)



async function getCategories(path: string = 'category') {
    await request.get(path)
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

    const response = await request.get(fullURL);
    await request.saveResult(path, response);
}

function addId() {
    if (categoryName.value !== null && !categoryNames.value.includes(categoryName.value)) {
        categoryNames.value.push(categoryName.value);
        categoryName.value = null;
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
    categoryName.value = null;

    await request.post(path, body)
}


function onCheckboxChange(checkbox) {
    if (checkbox === 'na') {
        this.checkedItems = ['na'];
    } else if (checkbox === 'category' || checkbox === 'product') {
        if (this.checkedItems.includes('na')) {
            this.checkedItems = [checkbox];
        }
    }
}

async function searchBrands() {
    // 맨 마지막 콤마 제거 -> 콤마 나오면 분리
    const values: string[] = brandNames.value.replace(/,\s*$/, '').split(",")
    // 각 값의 앞뒤 공백 제거
    const bNames = values.map((value) => value.trim())

    const tables = Object.values(checkedItems.value)
    const product = tables.includes('product')
    const category = tables.includes('category')


    if (product && category) {
        await getBrands('brand', bNames, true, true)
    } else if (product) {
        await getBrands('brand', bNames, undefined, true)
    } else if (category) {
        await getBrands('brand', bNames, true)
    } else {
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

    const response = await request.update(fullURL, body);
    await request.saveResult(path, response);

    newBrandName.value = ''
}

async function deleteId() {
    if (deleteName.value !== null && !deleteNames.value.includes(deleteName.value)) {
        deleteNames.value.push(deleteName.value);
        deleteName.value = null;
    }
}

async function deleteBrand() {
    let fullURL: string = ''
    const path = 'brand'
    const IDs = Object.values(deleteNames.value)

    for (const el of IDs) {
        console.log(el)
        fullURL = `brand/${el}`
        const response = await request.delete(fullURL);
        await request.saveResult(path, response);
    }

    brandName.value = ''
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
            <ul>
                <li v-for="(brand, i) in brands" :key="i">{{ brand.brand_name }}</li>
            </ul>
        </article>
    </section>
</template>