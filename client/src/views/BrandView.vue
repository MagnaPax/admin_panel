<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import CommonApi from '@/api/common'
import { useCounterStore } from '@/stores/counter';

const request = new CommonApi
const counterStore = useCounterStore()

const brandName = ref('')
const categoryName = ref<string | null>(null)
const categoryNames = ref<string[]>([])
// store의 값이 변경될때마다 적용
const brands = computed(() => counterStore.brandList)
const categories = computed(() => counterStore.categoryList as { category_id: number; category_name: string; }[])

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

    await request.get(fullURL)
}

function addId() {
    if (categoryName.value !== null && !categoryNames.value.includes(categoryName.value)) {
        categoryNames.value.push(categoryName.value);
        categoryName.value = null;
    }
}

function addBrand() {
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
                <label for="categorySelect">Select Relative Category</label>
                <div class="menu">
                    <select id="categorySelect" v-model="categoryName">
                        <option v-for="(category, i) in categories" :key="i" :value="category.category_id"
                            placeholder="Select Relative Category">
                            {{ category.category_name }}
                        </option>
                    </select>
                    <button @click="addId">Add</button>
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
    </section>
</template>