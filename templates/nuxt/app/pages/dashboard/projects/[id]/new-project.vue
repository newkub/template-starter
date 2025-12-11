<script setup lang="ts">
import { ref, computed, defineComponent } from "vue";

// Components
const ProjectTemplateBrowser = defineComponent({
	props: ["templates"],
	emits: ["select"],
	setup(props, { emit }) {
		const selected = ref<Template | null>(null);

		interface Template {
			id: string;
			name: string;
			description: string;
			category: string;
			thumbnail: string;
		}

		const selectTemplate = (template: Template) => {
			selected.value = template;
			emit("select", template);
		};

		return { selected, selectTemplate };
	},
});

const GitHubImport = defineComponent({
	props: ["repoUrl"],
	emits: ["update:repoUrl", "import"],
	setup(props, { emit }) {
		const localRepoUrl = computed({
			get: () => props.repoUrl,
			set: (val) => emit("update:repoUrl", val),
		});

		return { localRepoUrl };
	},
});

// Data
const templates = ref<Template[]>([
	{
		id: "1",
		name: "WordPress Basic",
		description: "Standard WordPress installation",
		category: "WordPress",
		thumbnail: "i-mdi-wordpress",
	},
	{
		id: "2",
		name: "WooCommerce",
		description: "E-commerce ready template",
		category: "WordPress",
		thumbnail: "i-mdi-cart",
	},
	{
		id: "3",
		name: "Blog Theme",
		description: "Modern blog design",
		category: "WordPress",
		thumbnail: "i-mdi-blog",
	},
	{
		id: "4",
		name: "Corporate Site",
		description: "Professional business template",
		category: "WordPress",
		thumbnail: "i-mdi-briefcase",
	},
	{
		id: "5",
		name: "Portfolio",
		description: "Showcase your work",
		category: "WordPress",
		thumbnail: "i-mdi-image",
	},
	{
		id: "6",
		name: "News Magazine",
		description: "News portal template",
		category: "WordPress",
		thumbnail: "i-mdi-newspaper",
	},
	{
		id: "7",
		name: "Restaurant",
		description: "Food and menu template",
		category: "WordPress",
		thumbnail: "i-mdi-food",
	},
	{
		id: "8",
		name: "Hotel Booking",
		description: "Accommodation reservation system",
		category: "WordPress",
		thumbnail: "i-mdi-hotel",
	},
	{
		id: "9",
		name: "Learning Management",
		description: "Online course platform",
		category: "WordPress",
		thumbnail: "i-mdi-school",
	},
	{
		id: "10",
		name: "Multilingual",
		description: "Supports multiple languages",
		category: "WordPress",
		thumbnail: "i-mdi-translate",
	},
]);

const repoUrl = ref("");

// เพิ่ม state สำหรับ GitHub repos
const githubRepos = ref([
	{
		id: 1,
		name: "wordpress-starter",
		owner: "wrikka",
		description: "Basic WordPress starter template",
		stars: 42,
		lastUpdated: "2025-05-15",
	},
	{
		id: 2,
		name: "ecommerce-theme",
		owner: "wrikka",
		description: "WooCommerce ready theme",
		stars: 28,
		lastUpdated: "2025-06-10",
	},
	{
		id: 3,
		name: "portfolio-theme",
		owner: "wrikka",
		description: "Modern portfolio theme",
		stars: 15,
		lastUpdated: "2025-04-22",
	},
	{
		id: 4,
		name: "blog-template",
		owner: "wrikka",
		description: "Clean blog template",
		stars: 36,
		lastUpdated: "2025-06-18",
	},
]);

// เพิ่ม state สำหรับ GitHub repo filter
const repoFilter = ref("all");
const repoSearchQuery = ref("");

// เพิ่ม state สำหรับ dropdown
const showOwnerDropdown = ref(false);
const toggleOwnerDropdown = () => {
	showOwnerDropdown.value = !showOwnerDropdown.value;
};

const selectOwner = (owner: string) => {
	repoFilter.value = owner;
	showOwnerDropdown.value = false;
};

// คำนวณ filtered repos
const filteredRepos = computed(() => {
	return githubRepos.value.filter((repo) => {
		const matchesSearch =
			repo.name.toLowerCase().includes(repoSearchQuery.value.toLowerCase()) ||
			repo.description
				.toLowerCase()
				.includes(repoSearchQuery.value.toLowerCase());
		const matchesFilter =
			repoFilter.value === "all" || repo.owner === repoFilter.value;
		return matchesSearch && matchesFilter;
	});
});

// ตัวเลือก filter
const repoOwners = computed(() => {
	return ["all", ...new Set(githubRepos.value.map((r) => r.owner))];
});

// Methods
interface Template {
	id: string;
	name: string;
	description: string;
	category: string;
	thumbnail: string;
}

const selected = ref<Template | null>(null);

const handleTemplateSelect = (template: Template) => {
	selected.value = template;
	console.log("Selected template:", template);
	// Handle template selection logic
};

const handleGitHubImport = (repo: any) => {
	console.log("Importing from GitHub:", repo);
	// Handle GitHub import logic
};

// เพิ่ม state สำหรับ filter
const activeCategory = ref<string>("all");
const searchQuery = ref<string>("");

// ฟังก์ชัน filter template
const filteredTemplates = computed(() => {
	return templates.value.filter((template) => {
		const matchesCategory =
			activeCategory.value === "all" ||
			template.category === activeCategory.value;
		const matchesSearch =
			template.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
			template.description
				.toLowerCase()
				.includes(searchQuery.value.toLowerCase());
		return matchesCategory && matchesSearch;
	});
});

// หมวดหมู่ทั้งหมด
const categories = computed(() => {
	const allCategories = [
		"all",
		...new Set(templates.value.map((t) => t.category)),
	];
	return allCategories;
});

// เพิ่ม state สำหรับ pagination
const currentPage = ref(1);
const itemsPerPage = 9; // แสดง 9 items ต่อหน้า (3x3 grid)

// คำนวณ template ที่แสดงตาม page
const paginatedTemplates = computed(() => {
	const start = (currentPage.value - 1) * itemsPerPage;
	const end = start + itemsPerPage;
	return filteredTemplates.value.slice(start, end);
});

// คำนวณจำนวนหน้าทั้งหมด
const totalPages = computed(() => {
	return Math.ceil(filteredTemplates.value.length / itemsPerPage);
});
</script>

<template>
  <div class="max-w-6xl mx-auto p-6 bg-background rounded-lg shadow">
    <h1 class="text-3xl font-bold mb-8 text-primary">Create New Project</h1>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Left Column: Template Browser -->
      <div class="border border-border rounded-lg p-6 bg-card">
        <!-- Header และ Filter -->
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-primary">Choose a Template</h2>
          <div class="flex items-center gap-4">
            <div class="relative w-64">
              <input 
                v-model="searchQuery"
                placeholder="Search templates..."
                class="w-full pl-8 pr-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-primary bg-background text-sm"
              />
              <div class="absolute left-2 top-2.5 i-mdi-magnify text-muted-foreground" />
            </div>
          </div>
        </div>
        
        <!-- Category Filters -->
        <div class="flex flex-wrap gap-2 mb-6">
          <button
            v-for="category in categories"
            :key="category"
            @click="activeCategory = category"
            :class="{
              'bg-primary text-primary-foreground': activeCategory === category,
              'bg-muted text-muted-foreground hover:bg-muted/80': activeCategory !== category
            }"
            class="px-3 py-1 rounded-full text-sm capitalize transition-colors"
          >
            {{ category }}
          </button>
        </div>
        
        <!-- Template Grid แบบ 3 คอลัมน์ -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="template in paginatedTemplates" 
            :key="template.id"
            @click="handleTemplateSelect(template)"
            class="border border-border rounded-lg p-4 cursor-pointer transition-colors hover:border-primary"
            :class="{ 'border-primary': selected?.id === template.id }"
          >
            <div class="flex items-center justify-center bg-muted/20 rounded-lg h-32 mb-3">
              <div class="i-mdi-package-variant text-5xl text-muted-foreground" />
            </div>
            <h3 class="font-medium text-primary">{{ template.name }}</h3>
            <p class="text-sm text-muted-foreground mt-1">{{ template.description }}</p>
            <span class="inline-block mt-2 px-2 py-1 bg-muted/20 text-muted-foreground rounded-full text-xs">
              {{ template.category }}
            </span>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-if="filteredTemplates.length === 0" class="text-center py-8">
          <div class="i-mdi-file-search-outline text-4xl text-muted-foreground mx-auto mb-3" />
          <p class="text-muted-foreground">No templates found matching your criteria</p>
        </div>
        
        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex justify-center mt-6">
          <div class="flex items-center gap-1">
            <button 
              @click="currentPage = Math.max(1, currentPage - 1)"
              :disabled="currentPage === 1"
              class="p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
            >
              <div class="i-mdi-chevron-left text-lg" />
            </button>
            
            <button
              v-for="page in totalPages"
              :key="page"
              @click="currentPage = page"
              :class="{
                'bg-primary text-primary-foreground': currentPage === page,
                'hover:bg-muted': currentPage !== page
              }"
              class="w-10 h-10 rounded-md flex items-center justify-center text-sm transition-colors"
            >
              {{ page }}
            </button>
            
            <button 
              @click="currentPage = Math.min(totalPages, currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
            >
              <div class="i-mdi-chevron-right text-lg" />
            </button>
          </div>
        </div>
      </div>

      <!-- Right Column: GitHub Import -->
      <div class="border border-border rounded-lg p-6 bg-card h-fit">
        <!-- Header และ Filter -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h2 class="text-xl font-semibold text-primary">Import from GitHub</h2>
          
          <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <!-- Custom Dropdown Filter -->
            <div class="relative">
              <button 
                @click="toggleOwnerDropdown"
                class="flex items-center gap-2 pl-3 pr-8 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-primary bg-background text-sm min-w-[120px]"
              >
                <span class="capitalize truncate">
                  {{ repoFilter === 'all' ? 'All Repos' : repoFilter }}
                </span>
                <div class="absolute right-2 top-2.5 i-mdi-chevron-down text-muted-foreground transition-transform" 
                     :class="{ 'transform rotate-180': showOwnerDropdown }" />
              </button>
              
              <!-- Dropdown Menu -->
              <div 
                v-show="showOwnerDropdown"
                class="absolute z-10 mt-1 w-full bg-card border border-border rounded-md shadow-lg py-1 text-sm"
              >
                <button 
                  v-for="owner in repoOwners" 
                  :key="owner"
                  @click="selectOwner(owner)"
                  class="w-full text-left px-3 py-1.5 hover:bg-muted/50 transition-colors capitalize"
                  :class="{ 'bg-muted/30': repoFilter === owner }"
                >
                  {{ owner === 'all' ? 'All Repos' : owner }}
                </button>
              </div>
            </div>
            
            <!-- Search Input -->
            <div class="relative w-full sm:w-48">
              <input 
                v-model="repoSearchQuery"
                placeholder="Search repos..."
                class="w-full pl-8 pr-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-primary bg-background text-sm"
              />
              <div class="absolute left-2 top-2.5 i-mdi-magnify text-muted-foreground" />
            </div>
          </div>
        </div>
        
        <!-- Repository List -->
        <div class="space-y-4">
          <h3 class="font-medium text-primary">Your GitHub Repositories</h3>
          
          <div class="space-y-3">
            <div 
              v-for="repo in filteredRepos" 
              :key="repo.id"
              class="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
            >
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="font-medium">{{ repo.owner }}/{{ repo.name }}</h4>
                  <p class="text-sm text-muted-foreground mt-1">{{ repo.description }}</p>
                  <div class="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <div class="flex items-center gap-1">
                      <div class="i-mdi-star" />
                      <span>{{ repo.stars }}</span>
                    </div>
                    <span>Updated {{ repo.lastUpdated }}</span>
                  </div>
                </div>
                <button 
                  @click="handleGitHubImport(repo)"
                  class="px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm whitespace-nowrap"
                >
                  Import
                </button>
              </div>
            </div>
          </div>
          
          <!-- Empty State -->
          <div v-if="filteredRepos.length === 0" class="text-center py-8">
            <div class="i-mdi-github text-4xl text-muted-foreground mx-auto mb-3" />
            <p class="text-muted-foreground">No repositories found</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>