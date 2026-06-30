import { sanityAdminClient } from "@/sanity/lib/admin";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);

const MAX_FILE_SIZE = 8 * 1024 * 1024;

const allowedMimeTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

class BadRequestError extends Error {
  status = 400;

  constructor(message: string) {
    super(message);
    this.name = "BadRequestError";
  }
}

const directorShareholderSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name is required"),
  isDirector: z.boolean(),
  isShareholder: z.boolean(),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  houseAddress: z.string().min(3, "House address is required"),
  phone: z.string().min(5, "Phone number is required"),
  email: z.string().email("Valid email is required"),
  occupation: z.string().min(2, "Occupation is required"),
  nationality: z.string().min(2, "Nationality is required"),
  meansOfIdNumber: z.string().min(2, "Means of ID number is required"),
  shareholdingPercentage: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value) return true;

        const numericValue = Number(value);

        return (
          Number.isFinite(numericValue) &&
          numericValue >= 0 &&
          numericValue <= 100
        );
      },
      {
        message: "Shareholding percentage must be between 0 and 100",
      }
    ),
});

const registrationSchema = z.object({
  proposedNameOne: z.string().min(2, "First proposed name is required"),
  proposedNameTwo: z.string().min(2, "Second proposed name is required"),
  natureOfBusiness: z.string().min(3, "Nature of business is required"),
  businessAddress: z.string().min(3, "Business address is required"),
  companyEmail: z.string().email("Valid company email is required"),
  companyPhone: z.string().min(5, "Company phone number is required"),
  directorsShareholders: z.array(directorShareholderSchema).min(1),
});

type UploadedDocument = {
  _type: "object";
  _key: string;
  category: string;
  filename: string;
  mimeType: string;
  size: number;
  fileUrl: string;
  file: {
    _type: "file";
    asset: {
      _type: "reference";
      _ref: string;
    };
  };
};

type DirectorShareholderEmailInput = {
  name: string;
  isDirector: boolean;
  isShareholder: boolean;
  shareholdingPercentage?: string;
};

export async function POST(request: Request) {
  const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();

  console.info("[BusinessRegistrationAPI] Request received:", {
    requestId,
    method: request.method,
    url: request.url,
  });

  try {
    validateServerEnv();

    console.info("[BusinessRegistrationAPI] Environment validation passed:", {
      requestId,
      hasSanityProjectId: Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID),
      hasSanityDataset: Boolean(process.env.NEXT_PUBLIC_SANITY_DATASET),
      hasSanityApiVersion: Boolean(process.env.NEXT_PUBLIC_SANITY_API_VERSION),
      hasSanityToken: Boolean(process.env.NEXT_SANITY_API_TOKEN),
      hasResendApiKey: Boolean(process.env.RESEND_API_KEY),
      hasResendFromEmail: Boolean(process.env.RESEND_FROM_EMAIL),
      hasBusinessAdminEmail: Boolean(process.env.BUSINESS_ADMIN_EMAIL),
    });

    const formData = await request.formData();

    console.info("[BusinessRegistrationAPI] FormData received:", {
      requestId,
      keys: Array.from(formData.keys()),
    });

    const payload = registrationSchema.parse({
      proposedNameOne: getRequiredString(formData, "proposedNameOne"),
      proposedNameTwo: getRequiredString(formData, "proposedNameTwo"),
      natureOfBusiness: getRequiredString(formData, "natureOfBusiness"),
      businessAddress: getRequiredString(formData, "businessAddress"),
      companyEmail: getRequiredString(formData, "companyEmail"),
      companyPhone: getRequiredString(formData, "companyPhone"),
      directorsShareholders: parseDirectorsShareholders(formData),
    });

    console.info("[BusinessRegistrationAPI] Payload validation passed:", {
      requestId,
      proposedNameOne: payload.proposedNameOne,
      proposedNameTwo: payload.proposedNameTwo,
      companyEmail: payload.companyEmail,
      directorsShareholdersCount: payload.directorsShareholders.length,
    });

    const scannedSignatures = getFiles(formData, "scannedSignatures");
    const passportPhotographs = getFiles(formData, "passportPhotographs");
    const meansOfIdentification = getFiles(formData, "meansOfIdentification");

    console.info("[BusinessRegistrationAPI] Files extracted:", {
      requestId,
      scannedSignaturesCount: scannedSignatures.length,
      passportPhotographsCount: passportPhotographs.length,
      meansOfIdentificationCount: meansOfIdentification.length,
      files: [
        ...scannedSignatures.map((file) => formatFileForLog(file)),
        ...passportPhotographs.map((file) => formatFileForLog(file)),
        ...meansOfIdentification.map((file) => formatFileForLog(file)),
      ],
    });

    console.info("[BusinessRegistrationAPI] Starting Sanity file uploads:", {
      requestId,
    });

    const documents = [
      ...(await uploadFilesToSanity(
        scannedSignatures,
        "Scanned Signature",
        requestId
      )),
      ...(await uploadFilesToSanity(
        passportPhotographs,
        "Scanned Passport Photograph",
        requestId
      )),
      ...(await uploadFilesToSanity(
        meansOfIdentification,
        "Means of Identification",
        requestId
      )),
    ];

    console.info("[BusinessRegistrationAPI] Finished Sanity file uploads:", {
      requestId,
      uploadedDocumentsCount: documents.length,
    });

    console.info("[BusinessRegistrationAPI] Starting Sanity document create:", {
      requestId,
      proposedNameOne: payload.proposedNameOne,
    });

    const createdDocument = await sanityAdminClient.create({
      _type: "businessRegistration",
      status: "pending",
      proposedNameOne: payload.proposedNameOne,
      proposedNameTwo: payload.proposedNameTwo,
      natureOfBusiness: payload.natureOfBusiness,
      businessAddress: payload.businessAddress,
      companyEmail: payload.companyEmail,
      companyPhone: payload.companyPhone,
      directorsShareholders: payload.directorsShareholders.map((person) => ({
        _key: crypto.randomUUID(),
        name: person.name,
        isDirector: person.isDirector,
        isShareholder: person.isShareholder,
        dateOfBirth: person.dateOfBirth,
        gender: person.gender,
        houseAddress: person.houseAddress,
        phone: person.phone,
        email: person.email,
        occupation: person.occupation,
        nationality: person.nationality,
        meansOfIdNumber: person.meansOfIdNumber,
        shareholdingPercentage: Number(person.shareholdingPercentage || 0),
      })),
      documents,
      submittedAt: new Date().toISOString(),
    });

    console.info("[BusinessRegistrationAPI] Finished Sanity document create:", {
      requestId,
      documentId: createdDocument._id,
    });

    let emailSent = true;

    try {
      console.info("[BusinessRegistrationAPI] Starting Resend email send:", {
        requestId,
        documentId: createdDocument._id,
        to: process.env.BUSINESS_ADMIN_EMAIL,
        from: process.env.RESEND_FROM_EMAIL,
      });

      await sendRegistrationEmail({
        documentId: createdDocument._id,
        proposedNameOne: payload.proposedNameOne,
        proposedNameTwo: payload.proposedNameTwo,
        companyEmail: payload.companyEmail,
        companyPhone: payload.companyPhone,
        natureOfBusiness: payload.natureOfBusiness,
        businessAddress: payload.businessAddress,
        directorsShareholders: payload.directorsShareholders,
        documents,
      });

      console.info("[BusinessRegistrationAPI] Finished Resend email send:", {
        requestId,
        documentId: createdDocument._id,
      });
    } catch (emailError) {
      emailSent = false;

      console.error(
        "[BusinessRegistrationAPI] Email failed after Sanity save:",
        {
          requestId,
          documentId: createdDocument._id,
          error: serializeError(emailError),
        }
      );
    }

    console.info("[BusinessRegistrationAPI] Request completed successfully:", {
      requestId,
      documentId: createdDocument._id,
      emailSent,
    });

    return NextResponse.json(
      {
        success: true,
        message: emailSent
          ? "Business registration submitted successfully."
          : "Business registration submitted successfully, but notification email failed.",
        documentId: createdDocument._id,
        emailSent,
        requestId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[BusinessRegistrationAPI] Request failed:", {
      requestId,
      error: serializeError(error),
    });

    if (error instanceof z.ZodError) {
      console.error("[BusinessRegistrationAPI] Validation failed:", {
        requestId,
        errors: error.flatten(),
      });

      return NextResponse.json(
        {
          success: false,
          message: "Please check the form fields and try again.",
          errors: error.flatten(),
          requestId,
        },
        { status: 400 }
      );
    }

    if (error instanceof BadRequestError) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
          requestId,
          debug:
            process.env.NODE_ENV === "development"
              ? serializeError(error)
              : undefined,
        },
        { status: error.status }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: getSafeErrorMessage(error),
        requestId,
        debug:
          process.env.NODE_ENV === "development"
            ? serializeError(error)
            : undefined,
      },
      { status: 500 }
    );
  }
}

function validateServerEnv() {
  const requiredEnv = [
    "NEXT_PUBLIC_SANITY_PROJECT_ID",
    "NEXT_PUBLIC_SANITY_DATASET",
    "NEXT_PUBLIC_SANITY_API_VERSION",
    "NEXT_SANITY_API_TOKEN",
    "RESEND_API_KEY",
    "RESEND_FROM_EMAIL",
    "BUSINESS_ADMIN_EMAIL",
  ];

  const missing = requiredEnv.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing server environment variables: ${missing.join(", ")}`
    );
  }
}

function getRequiredString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string" || !value.trim()) {
    throw new BadRequestError(`Missing required field: ${key}`);
  }

  return value.trim();
}

function parseDirectorsShareholders(formData: FormData) {
  const rawValue = getRequiredString(formData, "directorsShareholders");

  try {
    return JSON.parse(rawValue);
  } catch {
    throw new BadRequestError("Invalid directors/shareholders data.");
  }
}

function getFiles(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .filter((value): value is File => value instanceof File && value.size > 0);
}

async function uploadFilesToSanity(
  files: File[],
  category: string,
  requestId: string
) {
  const uploadedDocuments: UploadedDocument[] = [];

  for (const file of files) {
    console.info("[BusinessRegistrationAPI] Validating file:", {
      requestId,
      category,
      file: formatFileForLog(file),
    });

    validateFile(file);

    console.info("[BusinessRegistrationAPI] Uploading file to Sanity:", {
      requestId,
      category,
      file: formatFileForLog(file),
    });

    const uploadedAsset = await uploadSanityFileWithRetry({
      file,
      category,
      requestId,
      maxAttempts: 3,
    });

    console.info("[BusinessRegistrationAPI] File uploaded to Sanity:", {
      requestId,
      category,
      filename: file.name,
      assetId: uploadedAsset._id,
      assetUrl: uploadedAsset.url,
    });

    uploadedDocuments.push({
      _type: "object",
      _key: crypto.randomUUID(),
      category,
      filename: file.name,
      mimeType: file.type,
      size: file.size,
      fileUrl: uploadedAsset.url,
      file: {
        _type: "file",
        asset: {
          _type: "reference",
          _ref: uploadedAsset._id,
        },
      },
    });
  }

  return uploadedDocuments;
}

async function uploadSanityFileWithRetry(input: {
  file: File;
  category: string;
  requestId: string;
  maxAttempts: number;
}) {
  const { file, category, requestId, maxAttempts } = input;

  let lastError: unknown;

  const buffer = Buffer.from(await file.arrayBuffer());

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.info("[BusinessRegistrationAPI] Sanity upload attempt:", {
        requestId,
        category,
        filename: file.name,
        attempt,
        maxAttempts,
      });

      return await sanityAdminClient.assets.upload("file", buffer, {
        filename: file.name,
        contentType: file.type || "application/octet-stream",
      });
    } catch (error) {
      lastError = error;

      console.error("[BusinessRegistrationAPI] Sanity upload attempt failed:", {
        requestId,
        category,
        filename: file.name,
        attempt,
        maxAttempts,
        error: serializeError(error),
      });

      if (attempt < maxAttempts) {
        await sleep(1000 * attempt);
      }
    }
  }

  throw new Error(
    `Failed to upload ${file.name} to Sanity after ${maxAttempts} attempts. Cause: ${
      lastError instanceof Error ? lastError.message : "Unknown error"
    }`
  );
}

function validateFile(file: File) {
  if (file.size > MAX_FILE_SIZE) {
    throw new BadRequestError(`${file.name} is larger than 8MB.`);
  }

  if (!allowedMimeTypes.has(file.type)) {
    throw new BadRequestError(`${file.name} has an unsupported file type.`);
  }
}

async function sendRegistrationEmail(input: {
  documentId: string;
  proposedNameOne: string;
  proposedNameTwo: string;
  companyEmail: string;
  companyPhone: string;
  natureOfBusiness: string;
  businessAddress: string;
  directorsShareholders: DirectorShareholderEmailInput[];
  documents: UploadedDocument[];
}) {
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.BUSINESS_ADMIN_EMAIL;

  console.info("[BusinessRegistrationAPI] Resend config:", {
    from,
    to,
  });

  if (!from) {
    throw new Error("Missing RESEND_FROM_EMAIL");
  }

  if (!to) {
    throw new Error("Missing BUSINESS_ADMIN_EMAIL");
  }

  const response = await resend.emails.send({
    from,
    to,
    subject: `New Business Registration: ${input.proposedNameOne}`,
    html: buildEmailHtml(input),
  });

  console.info("[BusinessRegistrationAPI] RAW RESEND RESPONSE:", response);

  if (response.error) {
    console.error("[BusinessRegistrationAPI] RESEND ERROR:", response.error);

    throw new Error(response.error.message);
  }

  console.info("[BusinessRegistrationAPI] RESEND SUCCESS:", {
    id: response.data?.id,
  });

  return response.data;
}

function buildEmailHtml(input: {
  documentId: string;
  proposedNameOne: string;
  proposedNameTwo: string;
  companyEmail: string;
  companyPhone: string;
  natureOfBusiness: string;
  businessAddress: string;
  directorsShareholders: DirectorShareholderEmailInput[];
  documents: UploadedDocument[];
}) {
  const peopleRows = input.directorsShareholders
    .map((person) => {
      const roles = [
        person.isDirector ? "Director" : null,
        person.isShareholder ? "Shareholder" : null,
      ]
        .filter(Boolean)
        .join(" / ");

      return `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${escapeHtml(
            person.name
          )}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${escapeHtml(
            roles || "Not specified"
          )}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${escapeHtml(
            person.shareholdingPercentage || "0"
          )}%</td>
        </tr>
      `;
    })
    .join("");

  const documentLinks = input.documents
    .map(
      (document) => `
        <li>
          <strong>${escapeHtml(document.category)}:</strong>
          <a href="${escapeHtml(document.fileUrl)}" target="_blank" rel="noreferrer">
            ${escapeHtml(document.filename)}
          </a>
        </li>
      `
    )
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.6;">
      <h2>New Business Registration Request</h2>

      <p>A new SME business registration form has been submitted.</p>

      <h3>Company Details</h3>

      <p><strong>Proposed Name 1:</strong> ${escapeHtml(
        input.proposedNameOne
      )}</p>

      <p><strong>Proposed Name 2:</strong> ${escapeHtml(
        input.proposedNameTwo
      )}</p>

      <p><strong>Company Email:</strong> ${escapeHtml(input.companyEmail)}</p>

      <p><strong>Company Phone:</strong> ${escapeHtml(input.companyPhone)}</p>

      <p><strong>Nature of Business:</strong> ${escapeHtml(
        input.natureOfBusiness
      )}</p>

      <p><strong>Business Address:</strong> ${escapeHtml(
        input.businessAddress
      )}</p>

      <h3>Directors / Shareholders</h3>

      <table style="border-collapse: collapse; width: 100%; border: 1px solid #eee;">
        <thead>
          <tr>
            <th align="left" style="padding: 10px; border-bottom: 1px solid #eee;">Name</th>
            <th align="left" style="padding: 10px; border-bottom: 1px solid #eee;">Role</th>
            <th align="left" style="padding: 10px; border-bottom: 1px solid #eee;">Shareholding</th>
          </tr>
        </thead>

        <tbody>
          ${peopleRows}
        </tbody>
      </table>

      <h3>Uploaded Documents</h3>

      <ul>
        ${documentLinks || "<li>No documents uploaded.</li>"}
      </ul>

      <p><strong>Sanity Document ID:</strong> ${escapeHtml(
        input.documentId
      )}</p>
    </div>
  `;
}

function escapeHtml(value: string) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatFileForLog(file: File) {
  return {
    name: file.name,
    type: file.type,
    size: file.size,
    sizeInMb: Number((file.size / 1024 / 1024).toFixed(2)),
  };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getSafeErrorMessage(error: unknown) {
  if (!(error instanceof Error)) {
    return "Something went wrong while submitting the registration.";
  }

  if (
    error.message.includes("Failed to upload") ||
    error.message.includes("Connect Timeout") ||
    error.message.includes("fetch failed")
  ) {
    return "We could not upload one or more files because the upload service timed out. Please check your internet connection and try again.";
  }

  return error.message;
}

function serializeError(error: unknown) {
  if (error instanceof Error) {
    const errorWithCause = error as Error & {
      cause?: unknown;
      code?: string;
      statusCode?: number;
      status?: number;
      response?: unknown;
    };

    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: errorWithCause.code,
      statusCode: errorWithCause.statusCode,
      status: errorWithCause.status,
      cause:
        errorWithCause.cause instanceof Error
          ? {
              name: errorWithCause.cause.name,
              message: errorWithCause.cause.message,
              stack: errorWithCause.cause.stack,
            }
          : errorWithCause.cause,
      response: errorWithCause.response,
    };
  }

  return {
    message: "Unknown error",
    error,
  };
}
