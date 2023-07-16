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

const updateID = ref<string | null>(null)
const newCategoryName = ref<string | null>(null)



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


        <article class="list">
            <ul>
                <li v-for="(category, i) in categories" :key="i">{{ category.category_name }}</li>
            </ul>
            <br><br>
            <ul>
                <li v-for="(brand, i) in brands" :key="i">{{ brand.brand_name }}</li>
            </ul>
        </article>
    </section>
</template>