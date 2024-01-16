<script lang="ts">
    import Menu from './lib/Menu.svelte'
</script>

<style>
    .app {
        margin: 0 auto;

        display: flex;
        max-width: 1024px;
        min-height: 100vh;

        flex-direction: column;
    }
</style>

<main class="app">
    <Menu></Menu>
</main>
