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



onMounted(() => {
    if (!brands.value.length && !categories.value.length) {
        getBrands()
        getCategories()
    }
})

</script>

<template>
    <section class="wrapper">
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