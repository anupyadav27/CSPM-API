import ExcelJS from "exceljs";
import puppeteer from "puppeteer";
import { Buffer } from "buffer";

const jsonReplacer = (key, value) => {
    if (value && typeof value === "object" && value._bsontype === "ObjectID") {
        return value.toString();
    }
    if (value instanceof Date) {
        return value.toISOString();
    }
    return value;
};

const normalizeData = (data) => {
    const jsonString = JSON.stringify(data, jsonReplacer);
    return JSON.parse(jsonString);
};

const flattenObject = (obj, prefix = "", separator = "__") => {
    const flattened = {};
    for (const [key, value] of Object.entries(obj)) {
        const newKey = prefix ? `${prefix}${separator}${key}` : key;
        if (value && typeof value === "object" && !Array.isArray(value)) {
            Object.assign(flattened, flattenObject(value, newKey, separator));
        } else if (Array.isArray(value)) {
            flattened[newKey] = value.length;
        } else {
            flattened[newKey] = value;
        }
    }
    return flattened;
};

export const exportToExcel = (data, labels = {}) => {
    const normalizedData = normalizeData(data);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data");

    if (!Array.isArray(normalizedData) || normalizedData.length === 0) {
        worksheet.addRow(["No data available"]);
        return workbook.xlsx.writeBuffer();
    }

    const flattenedRows = normalizedData.map((row) => flattenObject(row));

    const allKeys = new Set();
    flattenedRows.forEach((row) => Object.keys(row).forEach((key) => allKeys.add(key)));

    const headers = [];
    const usedKeys = new Set();

    for (const [key, label] of Object.entries(labels)) {
        if (allKeys.has(key)) {
            headers.push({ key, label });
            usedKeys.add(key);
        }
    }

    for (const key of allKeys) {
        if (!usedKeys.has(key)) {
            const autoLabel = key.replace(/__/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
            headers.push({ key, label: autoLabel });
        }
    }

    worksheet.addRow(headers.map((h) => h.label));

    flattenedRows.forEach((flattenedRow) => {
        const row = [];
        for (const { key } of headers) {
            const value = flattenedRow[key];
            row.push(value ?? "");
        }
        worksheet.addRow(row);
    });

    worksheet.columns.forEach((col, i) => {
        let maxWidth = headers[i]?.label?.length || 10;
        flattenedRows.forEach((row) => {
            const cellLength = String(row[headers[i].key] ?? "").length;
            if (cellLength > maxWidth) maxWidth = cellLength;
        });
        col.width = Math.min(maxWidth + 2, 50);
    });

    return workbook.xlsx.writeBuffer();
};

export const exportToPDFBuffer = async (data, labels = {}) => {
    const normalizedData = normalizeData(data);

    if (!Array.isArray(normalizedData) || normalizedData.length === 0) {
        const { PDFDocument } = await import("pdfkit");
        const chunks = [];
        const doc = new PDFDocument({ margin: 30 });

        doc.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
        doc.on("end", () => {});

        doc.text("No data available", { align: "center" });
        doc.end();

        return Buffer.concat(chunks);
    }

    const flattenedRows = normalizedData.map((row) => flattenObject(row));

    const allKeys = new Set();
    flattenedRows.forEach((row) => Object.keys(row).forEach((key) => allKeys.add(key)));

    const headers = [];
    const usedKeys = new Set();

    for (const [key, label] of Object.entries(labels)) {
        if (allKeys.has(key)) {
            headers.push({ key, label });
            usedKeys.add(key);
        }
    }

    for (const key of allKeys) {
        if (!usedKeys.has(key)) {
            const autoLabel = key.replace(/__/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
            headers.push({ key, label: autoLabel });
        }
    }

    let html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 10px;
                    font-size: 8px;
                }
                table {
                    border-collapse: collapse;
                    width: 100%;
                    table-layout: fixed;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 4px;
                    text-align: left;
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                }
                th {
                    background-color: #f2f2f2;
                    font-weight: bold;
                    font-size: 9px;
                }
                tr:nth-child(even) {
                    background-color: #f9f9f9;
                }
                @media print {
                    @page {
                        size: A4 landscape;
                        margin: 0.4in;
                    }
                    body {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                }
            </style>
        </head>
        <body>
            <h1 style="font-size: 14px; text-align: center;">Exported Data</h1>
            <table>
                <thead>
                    <tr>
    `;

    headers.forEach((header) => {
        html += `<th>${header.label}</th>`;
    });

    html += `
                    </tr>
                </thead>
                <tbody>
    `;

    flattenedRows.forEach((row) => {
        html += "<tr>";
        headers.forEach((header) => {
            const value = row[header.key];
            const safeValue = value !== null ? String(value) : "";
            html += `<td>${safeValue}</td>`;
        });
        html += "</tr>";
    });

    html += `
                </tbody>
            </table>
        </body>
        </html>
    `;

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
        format: "A4",
        landscape: true,
        printBackground: true,
        margin: {
            top: "0.4in",
            right: "0.4in",
            bottom: "0.4in",
            left: "0.4in",
        },
        omitBackground: false,
        tagged: false,
    });

    await browser.close();

    return pdfBuffer;
};
