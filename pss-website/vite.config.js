import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Replace 'repo-name' with your actual GitHub repository name
// If your repo is 'username.github.io', set base to '/'
export default defineConfig({
  plugins: [react()],
  base: "/pss-website/", 
})
