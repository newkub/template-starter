<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-8 text-primary">Integrations</h1>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Google Analytics -->
      <div class="border border-border rounded-lg p-6 bg-card hover:shadow-md transition-shadow">
        <div class="flex items-center gap-4 mb-4">
          <img src="https://upload.wikimedia.org/wikipedia/commons/e/ef/Google_Analytics_logo.svg" 
               class="w-12 h-12 object-contain" 
               alt="Google Analytics" />
          <h2 class="text-lg font-semibold">Google Analytics</h2>
        </div>
        <p class="text-muted-foreground mb-4">Track website traffic and user behavior</p>
        <button class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
          Connect
        </button>
      </div>
      
      <!-- Mailchimp -->
      <div class="border border-border rounded-lg p-6 bg-card hover:shadow-md transition-shadow">
        <div class="flex items-center gap-4 mb-4">
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2e/Mailchimp_logo.svg" 
               class="w-12 h-12 object-contain" 
               alt="Mailchimp" />
          <h2 class="text-lg font-semibold">Mailchimp</h2>
        </div>
        <p class="text-muted-foreground mb-4">Email marketing and automation</p>
        <button class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
          Connect
        </button>
      </div>
      
      <!-- Stripe -->
      <div class="border border-border rounded-lg p-6 bg-card hover:shadow-md transition-shadow">
        <div class="flex items-center gap-4 mb-4">
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" 
               class="w-12 h-12 object-contain" 
               alt="Stripe" />
          <h2 class="text-lg font-semibold">Stripe</h2>
        </div>
        <p class="text-muted-foreground mb-4">Online payment processing</p>
        <button class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
          Connect
        </button>
      </div>
      
      <!-- Slack -->
      <div class="border border-border rounded-lg p-6 bg-card hover:shadow-md transition-shadow">
        <div class="flex items-center gap-4 mb-4">
          <div class="i-mdi-slack text-5xl text-[#E01E5A] w-12 h-12 flex items-center justify-center" />
          <h2 class="text-lg font-semibold">Slack</h2>
        </div>
        <p class="text-muted-foreground mb-4">Team communication and collaboration</p>
        <button class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
          Connect
        </button>
      </div>
      
      <!-- Zapier -->
      <div class="border border-border rounded-lg p-6 bg-card hover:shadow-md transition-shadow">
        <div class="flex items-center gap-4 mb-4">
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Zapier_logo.svg" 
               class="w-12 h-12 object-contain" 
               alt="Zapier" />
          <h2 class="text-lg font-semibold">Zapier</h2>
        </div>
        <p class="text-muted-foreground mb-4">Automate workflows between apps</p>
        <button class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
          Connect
        </button>
      </div>
      
      <!-- WooCommerce -->
      <div class="border border-border rounded-lg p-6 bg-card hover:shadow-md transition-shadow">
        <div class="flex items-center gap-4 mb-4">
          <img src="https://upload.wikimedia.org/wikipedia/commons/7/7e/WooCommerce_logo.svg" 
               class="w-12 h-12 object-contain" 
               alt="WooCommerce" />
          <h2 class="text-lg font-semibold">WooCommerce</h2>
        </div>
        <p class="text-muted-foreground mb-4">E-commerce platform for WordPress</p>
        <button class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
          Connect
        </button>
      </div>
      
      <!-- Cloudflare -->
      <div class="border border-border rounded-lg p-6 bg-card hover:shadow-md transition-shadow">
        <div class="flex items-center gap-4 mb-4">
          <img src="https://upload.wikimedia.org/wikipedia/commons/9/94/Cloudflare_Logo.svg" 
               class="w-12 h-12 object-contain" 
               alt="Cloudflare" />
          <h2 class="text-lg font-semibold">Cloudflare</h2>
        </div>
        <p class="text-muted-foreground mb-4">CDN and security services</p>
        <button class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
          Connect
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
	layout: "dashboard",
});
// สามารถเพิ่ม logic การเชื่อมต่อ integrations ที่นี่
</script>