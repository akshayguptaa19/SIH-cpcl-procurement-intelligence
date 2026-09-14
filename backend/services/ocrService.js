/**
 * OCR Service Abstraction
 * Simulates high-fidelity multi-modal entity extraction from government procurement documents.
 */
export function extractDocumentData(docType, fileName, companyData = {}) {
  const normalizedType = (docType || "").toLowerCase();
  
  if (normalizedType.includes("gst")) {
    return {
      confidence: 0.985,
      fields: {
        registrationNumber: companyData.gstin || "27AABCS1429B1Z1",
        legalName: companyData.legalName || "Shakti Enterprises Private Limited",
        tradeName: companyData.tradeName || "Shakti Valve & Flow Systems",
        constitutionOfBusiness: "Private Limited Company",
        principalPlaceOfBusiness: companyData.address || "Plot 42, MIDC Industrial Area, Taloja, Navi Mumbai, Maharashtra - 410208",
        dateOfLiability: "01/07/2017",
        dateOfValidityFrom: "01/07/2017",
        typeOfRegistration: "Regular Taxpayer",
        jurisdictionState: companyData.state || "Maharashtra",
        jurisdictionCenter: "Range-IV, Division-II, Raigad Commissionerate",
        approvingAuthority: "Assistant Commissioner, Central Goods and Services Tax",
        dateOfIssueCertificate: "14/07/2017"
      },
      pageCount: 3,
      qualityScore: "HIGH_CONFIDENCE (98.5%)"
    };
  }

  if (normalizedType.includes("pan")) {
    return {
      confidence: 0.992,
      fields: {
        panNumber: companyData.pan || "AABCS1429B",
        legalName: companyData.legalName || "Shakti Enterprises Private Limited",
        entityType: "Company / Corporate",
        incorporationDate: "12/04/2012",
        issuingAuthority: "Income Tax Department, Govt of India"
      },
      pageCount: 1,
      qualityScore: "HIGH_CONFIDENCE (99.2%)"
    };
  }

  if (normalizedType.includes("turnover") || normalizedType.includes("financial") || normalizedType.includes("balance")) {
    return {
      confidence: 0.965,
      fields: {
        auditedFy22: "₹" + (companyData.turnover_fy22 || "18.40") + " Cr",
        auditedFy23: "₹" + (companyData.turnover_fy23 || "22.10") + " Cr",
        auditedFy24: "₹" + (companyData.turnover_fy24 || "24.60") + " Cr",
        threeYearAverage: "₹" + (companyData.average_turnover || "21.70") + " Cr",
        caFirmName: "M/s R. K. Agrawal & Co., Chartered Accountants",
        caMembershipNo: "084921",
        caFirmRegNo: "102839W",
        udinNumber: "UDIN-24084921AAAA-9812",
        auditOpinion: "Unqualified / Clean True & Fair View"
      },
      pageCount: 8,
      qualityScore: "HIGH_CONFIDENCE (96.5%)"
    };
  }

  if (normalizedType.includes("oem") || normalizedType.includes("authorization")) {
    return {
      confidence: 0.935,
      fields: {
        oemManufacturerName: "Rotork Flow Control International Ltd",
        authorizedRepresentative: companyData.legalName || "Shakti Enterprises Pvt Ltd",
        tenderReference: "CPCL/VALVE/2025/001",
        validityExpiryDate: "31/12/2026",
        warrantyCommitment: "Direct OEM 36 Months Operational Warranty",
        signatoryName: "Alistair Vance, Global Sales Director"
      },
      pageCount: 2,
      qualityScore: "MEDIUM_HIGH_CONFIDENCE (93.5%)"
    };
  }

  // Default Generic Document Extraction
  return {
    confidence: 0.920,
    fields: {
      documentTitle: docType || "Submitted Tender Document",
      entityName: companyData.legalName || "Verified Contractor Entity",
      submissionTimestamp: new Date().toISOString(),
      fileReference: fileName
    },
    pageCount: 1,
    qualityScore: "CONFIRMED (92.0%)"
  };
}

export function extractDocumentEntities(docType, fileName, companyData = {}) {
  const result = extractDocumentData(docType, fileName, companyData);
  return {
    entities: result.fields,
    confidence: result.confidence,
    pageCount: result.pageCount,
    qualityScore: result.qualityScore
  };
}
