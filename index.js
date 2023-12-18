const userName = document.getElementById("name");
const submitBtn = document.getElementById("submitBtn");

const { PDFDocument, rgb, degrees } = PDFLib;


const capitalize = (str, lower = false) =>
  (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, (match) =>
    match.toUpperCase()
  );

submitBtn.addEventListener("click", () => {
  const val = capitalize(userName.value);

  //check if the text is empty or not
  if (val.trim() !== "" && userName.checkValidity()) {
    // console.log(val);
    generatePDF(val);
  } else {
    userName.reportValidity();
  }
});

const generatePDF = async (name) => {
  const existingPdfBytes = await fetch("./cert.pdf").then((res) =>
    res.arrayBuffer()
  );

  // Load a PDFDocument from the existing PDF bytes
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  pdfDoc.registerFontkit(fontkit);

  //get font
  const fontBytes = await fetch("./boorsok.ttf").then((res) =>
    res.arrayBuffer()
  );

  // Embed our custom font in the document
  const boorsok = await pdfDoc.embedFont(fontBytes);

  // Get the first page of the document
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  // Assuming you have a PDFPage object named firstPage
// and a font object named SanChezFont

const text = name;
const textSize = 45;
const pageWidth = firstPage.getWidth();

// Measure the width of the text
const textWidth = boorsok.widthOfTextAtSize(text, textSize);

// Calculate the x-coordinate for centering the text
const x = (pageWidth / 2) - (textWidth / 2);

// Now draw the text at the calculated position
firstPage.drawText(text, {
  x: x, // use the calculated x-coordinate
  y: 350, // y-coordinate as per your requirement
  size: textSize,
  font: boorsok,
  color: rgb(0.941, 0.412, 0.392),
});


  // Draw a string of text diagonally across the first page
  // firstPage.drawText(name, {
  //   x: 345,
  //   y: 350,
  //   size: 58,
  //   font: SanChezFont,
  //   color: rgb(0.2, 0.84, 0.67),
  // });

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();
  console.log("Done creating");

  // this was for creating uri and showing in iframe

  // const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
  // document.getElementById("pdf").src = pdfDataUri;

  var file = new File(
    [pdfBytes],
    "certificate.pdf",
    {
      type: "application/pdf;charset=utf-8",
    }
  );
 saveAs(file);
};

// init();
