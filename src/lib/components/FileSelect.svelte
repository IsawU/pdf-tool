<script lang="ts">
    import { PdfFile } from "../utils/file";

    export let file: PdfFile | undefined;
    let loading: boolean = false;

    function onFileChange(event: Event) {
        const file = fileInput.files?.[0];
        if (file == null) return;
        loadFile(file);
    }

    function loadFile(loadFile: File) {
        loading = true;
        PdfFile.load(loadFile).then((data) => {
            loading = false;
            file = data;
        }).catch(() => {
            loading = false;
        });
    }

    function changeFile() {
        file = undefined;
    }

    let fileInput: HTMLInputElement;
</script>

<div>
    {#if loading == false && file == null}
        <input type="file" on:change={onFileChange} bind:this={fileInput}>
    {:else}
        <button on:click={changeFile}>&times;</button>
        {#if loading}
            Loading…
        {:else}
            {file.getFilename()}
        {/if}
    {/if}
</div>
