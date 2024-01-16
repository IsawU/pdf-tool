<script lang="ts">
    import { PDFDocument } from "pdf-lib";
    import FileSelect from "../components/FileSelect.svelte";
    import type { PdfFile } from "../utils/file";

    let file: PdfFile | undefined = undefined;

    function downloadBase64File(contentBase64: string, fileName: string) {
        const linkSource = `data:application/pdf;base64,${contentBase64}`;
        const downloadLink = document.createElement('a');
        document.body.appendChild(downloadLink);

        downloadLink.href = linkSource;
        downloadLink.target = '_self';
        downloadLink.download = fileName;
        downloadLink.click(); 
    }

    async function save(output: Output) {
        if (file == null) return;

        const start = output.start - 1;
        const stop = output.stop - 1;
        const indicies = [];
        for (let i = start; i <= stop; ++i) {
            indicies.push(i)
        }
        const document = await PDFDocument.create();

        document.setAuthor(file.pdf.getAuthor() ?? '');
        document.setCreationDate(file.pdf.getCreationDate() ?? new Date());
        document.setCreator(file.pdf.getCreator() ?? '');
        document.setKeywords(file.pdf.getKeywords()?.split(' ') ?? []);
        // document.setLanguage();
        document.setModificationDate(new Date());
        document.setProducer(file.pdf.getProducer() ?? '');
        document.setSubject(file.pdf.getSubject() ?? '');
        document.setTitle(file.pdf.getTitle() ?? '');

        const pages = await document.copyPages(file.pdf, indicies);
        for (const page of pages) {
            document.addPage(page);
        }

        const data = await document.saveAsBase64();
        downloadBase64File(data, output.filename);
    }

    interface Output {
        uid: number;
        filename: string;
        start: number;
        stop: number;
    }

    let outputs: Output[] = [];
    let nextOutputUid = 1;

    function addOutput() {
        const uid = outputs
            .map((o) => o.uid)
            .reduce((a, v) => v > a ? v : a, 0) + 1;

        const start = (outputs[outputs.length - 1]?.stop ?? 0) + 1;
        outputs.push({
            uid: uid,
            filename: `${filename}-${uid}`,
            start: start,
            stop: start,
        });
        outputs = outputs;
    }

    function removeOutput(uid: number) {
        outputs = outputs.filter((o: Output) => o.uid != uid);
    }

    function onOutputStartChange(output: Output) {
        if (output.start > output.stop) {
            output.stop = output.start;
            outputs = outputs;
        }
    }

    let filename: string = 'output';
    let setFilename = (s: string) => filename = s;
    $: setFilename(file?.getFilename() ?? 'output');
</script>

<style>
    .container {
        margin-block-start: 2em;
        margin-block-end: 2em;
    }
</style>

<div>
    <slot/>
    <h1>Split</h1>

    <div class="container">
        <FileSelect bind:file></FileSelect>
    </div>

    <div class="container">
        <input type="text" bind:value={filename}>
    </div>

    <div class="container">
        {#each outputs as output}
            <div>
                <button on:click={() => removeOutput(output.uid)}>&times;</button>
                <input type="text" bind:value={output.filename}>
                <input
                    type="number"
                    min="1"
                    bind:value={output.start}
                    on:change={() => onOutputStartChange(output)}>
                <input
                    type="number"
                    min={output.start}
                    bind:value={output.stop}>
                <button on:click={() => save(output)}>Save</button>
            </div>
        {/each}
        <div>
            <button on:click={addOutput}>+ Add Output</button>
        </div>
    </div>
</div>
