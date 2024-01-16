<script lang="ts">
    import SplitApp from './apps/SplitApp.svelte'

    enum App {
        Menu,
        Split,
    }

    function openApp(openApp: App) {
        app = openApp;
    }

    let app = App.Menu;
</script>

<style>
    .container {
        display: flex;
        flex-grow: 1;

        flex-direction: column;
        gap: 6px;
        padding: 6px;
    }

    .menu {
        justify-content: center;
        align-items: center;
    }
</style>

{#if app == App.Menu}
    <div class="menu container">
        <button on:click={() => openApp(App.Split)}>Split</button>
    </div>
{:else if app == App.Split}
    <div class="container">
        <SplitApp>
            <button class="back" on:click={() => openApp(App.Menu)}>&larr;</button>
        </SplitApp>
    </div>
{/if}
