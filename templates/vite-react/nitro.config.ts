import { defineNitroConfig } from "nitro/config";

export default defineNitroConfig({
  routeRules: {
    '/**': { headers: { 'x-nitro': 'first' } }
  }
})
