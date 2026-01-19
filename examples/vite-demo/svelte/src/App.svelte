<script lang="ts">
  import typescriptLogo from '/typescript.svg'
  import viteLogo from '/vite.svg'
  import Counter from './Counter.svelte'
</script>

<main>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src={viteLogo} class="logo" alt="Vite Logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src={typescriptLogo} class="logo vanilla" alt="TypeScript logo" />
    </a>
  </div>

  <h1>Vite + TypeScript</h1>

  <div class="card">
    <Counter />
  </div>

  <p class="read-the-docs">
    Click on the Vite and TypeScript logos to learn more
  </p>
</main>
