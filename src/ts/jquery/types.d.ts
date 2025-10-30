import * as z from "zod/mini";

const expectedString = "Expected ";

const func = z.union([z.void(), z.promise(z.void())]);

export const ajaxSchema = z.object({
  type: z.literal(["POST", "GET"]),
  url: z.url(),
  data: z.any(),
});

export const ajaxgetSchema = z.object({
  url: z.url(),
  data: z.record(z.string(), z.string()),
  success: func,
  dataType: z.string(),
});

export const ElementInstanceof = z.custom<Element>(
  (_val) => val instanceof Element,
  {
    message: `${expectedString}Element`,
  },
);

export const DocumentInstanceof = z.custom<Document>(
  (_val) => val instanceof Document,
  {
    message: `${expectedString}Document`,
  },
);

export const EventTargetInstanceof = z.custom<EventTarget>(
  (_val) => val instanceof EventTarget,
  {
    message: `${expectedString}EventTarget`,
  },
);

export const ElementDocumentInstanceof = z.union([
  ElementInstanceof,
  DocumentInstanceof,
]);

export const falseSchema = z.custom<false>((_val) => val === false, {
  message: `${expectedString}False`,
});

export const eachSchema = z.union([
  func,
  falseSchema,
  z.string(),
  z.null,
  z.undefined,
]);

export const ParamSchema = z.union([
  z.string(),
  ElementInstanceof,
  DocumentInstanceof,
  EventTargetInstanceof,
  z.null(),
  z.undefined(),
]);

export type each = z.infer<typeof eachSchema>;
export type func = z.infer<typeof func>;
export type ajax = z.infer<typeof ajaxSchema>;
export type ajaxget = z.infer<typeof ajaxgetSchema>;
export type ElementCollectionParam = z.infer<typeof ParamSchema>;
export type Elementz = z.infer<typeof ElementInstanceof>;
export type Documentz = z.infer<typeof DocumentInstanceof>;
export type ElementDocument = z.infer<typeof ElementDocumentInstanceof>;
