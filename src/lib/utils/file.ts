import { PDFDocument } from "pdf-lib";

function readFile(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.onload = () => {
            if (reader.result == null || !(reader.result instanceof ArrayBuffer)) {
                reject('Could not read file.');
            } else {
                resolve(reader.result);
            }
        };
        reader.onerror = () => reject('Error reading file.');
        reader.readAsArrayBuffer(file);
    });
}

export class PdfFile {
    private filename: string;
    public pdf: PDFDocument;

    constructor (
        filename: string,
        pdf: PDFDocument,
    ) {
        this.filename = filename;
        this.pdf = pdf;

        console.log(this);
    }

    public static load(file: File) {
        return readFile(file).then((file: ArrayBuffer) => {
            return PDFDocument.load(file);
        }).then((pdf) => {
            return new PdfFile(file.name, pdf);
        });
    }

    public getFilename(): string {
        return this.filename;
    }
}
