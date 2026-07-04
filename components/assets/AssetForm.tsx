"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { DEVICE_TYPES, ASSET_STATUSES, type AssetInput } from "@/lib/types";

interface AssetFormProps {
  initialValues?: Partial<AssetInput>;
  onSubmit: (values: AssetInput) => Promise<void>;
  submitLabel: string;
}

type FormErrors = Partial<Record<keyof AssetInput, string>>;

// The database stores empty optional fields as null, but a controlled text
// input needs a string (never null) or React treats it as uncontrolled.
// This fills in defaults for a new asset and turns any null into "".
function toFormValues(initial?: Partial<AssetInput>): AssetInput {
  return {
    asset_tag: initial?.asset_tag ?? "",
    device_type: initial?.device_type ?? "Laptop",
    brand: initial?.brand ?? "",
    model: initial?.model ?? "",
    serial_number: initial?.serial_number ?? "",
    assigned_to: initial?.assigned_to ?? "",
    location: initial?.location ?? "",
    purchase_date: initial?.purchase_date ?? "",
    warranty_expiry: initial?.warranty_expiry ?? "",
    status: initial?.status ?? "Available",
    notes: initial?.notes ?? "",
  };
}

function validate(values: AssetInput): FormErrors {
  const errors: FormErrors = {};
  if (!values.asset_tag.trim()) errors.asset_tag = "Asset tag is required.";
  if (!values.device_type) errors.device_type = "Device type is required.";
  if (!values.status) errors.status = "Status is required.";
  if (
    values.purchase_date &&
    values.warranty_expiry &&
    new Date(values.warranty_expiry) < new Date(values.purchase_date)
  ) {
    errors.warranty_expiry = "Warranty expiry can't be before the purchase date.";
  }
  return errors;
}

// Small layout helper so every field gets the same label/error treatment
// without repeating the markup ten times below.
function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

const inputClasses =
  "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

export default function AssetForm({ initialValues, onSubmit, submitLabel }: AssetFormProps) {
  const [values, setValues] = useState<AssetInput>(() => toFormValues(initialValues));
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function updateField<K extends keyof AssetInput>(field: K, value: AssetInput[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      // Convert blank optional fields back to null before hitting the database.
      const payload: AssetInput = {
        ...values,
        asset_tag: values.asset_tag.trim(),
        brand: values.brand?.trim() || null,
        model: values.model?.trim() || null,
        serial_number: values.serial_number?.trim() || null,
        assigned_to: values.assigned_to?.trim() || null,
        location: values.location?.trim() || null,
        purchase_date: values.purchase_date || null,
        warranty_expiry: values.warranty_expiry || null,
        notes: values.notes?.trim() || null,
      };
      await onSubmit(payload);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Asset tag *" htmlFor="asset_tag" error={errors.asset_tag}>
          <input
            id="asset_tag"
            type="text"
            value={values.asset_tag}
            onChange={(e) => updateField("asset_tag", e.target.value)}
            placeholder="e.g. LAP-0123"
            className={inputClasses}
          />
        </Field>

        <Field label="Device type *" htmlFor="device_type" error={errors.device_type}>
          <select
            id="device_type"
            value={values.device_type}
            onChange={(e) => updateField("device_type", e.target.value as AssetInput["device_type"])}
            className={inputClasses}
          >
            {DEVICE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Brand" htmlFor="brand">
          <input
            id="brand"
            type="text"
            value={values.brand ?? ""}
            onChange={(e) => updateField("brand", e.target.value)}
            placeholder="e.g. Dell"
            className={inputClasses}
          />
        </Field>

        <Field label="Model" htmlFor="model">
          <input
            id="model"
            type="text"
            value={values.model ?? ""}
            onChange={(e) => updateField("model", e.target.value)}
            placeholder="e.g. Latitude 5440"
            className={inputClasses}
          />
        </Field>

        <Field label="Serial number" htmlFor="serial_number">
          <input
            id="serial_number"
            type="text"
            value={values.serial_number ?? ""}
            onChange={(e) => updateField("serial_number", e.target.value)}
            className={inputClasses}
          />
        </Field>

        <Field label="Status *" htmlFor="status" error={errors.status}>
          <select
            id="status"
            value={values.status}
            onChange={(e) => updateField("status", e.target.value as AssetInput["status"])}
            className={inputClasses}
          >
            {ASSET_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Assigned to" htmlFor="assigned_to">
          <input
            id="assigned_to"
            type="text"
            value={values.assigned_to ?? ""}
            onChange={(e) => updateField("assigned_to", e.target.value)}
            placeholder="e.g. Jordan Lee, or IT Storage Room"
            className={inputClasses}
          />
        </Field>

        <Field label="Location" htmlFor="location">
          <input
            id="location"
            type="text"
            value={values.location ?? ""}
            onChange={(e) => updateField("location", e.target.value)}
            placeholder="e.g. Sydney Office - Level 2"
            className={inputClasses}
          />
        </Field>

        <Field label="Purchase date" htmlFor="purchase_date">
          <input
            id="purchase_date"
            type="date"
            value={values.purchase_date ?? ""}
            onChange={(e) => updateField("purchase_date", e.target.value)}
            className={inputClasses}
          />
        </Field>

        <Field label="Warranty expiry" htmlFor="warranty_expiry" error={errors.warranty_expiry}>
          <input
            id="warranty_expiry"
            type="date"
            value={values.warranty_expiry ?? ""}
            onChange={(e) => updateField("warranty_expiry", e.target.value)}
            className={inputClasses}
          />
        </Field>
      </div>

      <Field label="Notes" htmlFor="notes">
        <textarea
          id="notes"
          rows={4}
          value={values.notes ?? ""}
          onChange={(e) => updateField("notes", e.target.value)}
          placeholder="Anything worth remembering about this device..."
          className={inputClasses}
        />
      </Field>

      {submitError && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {submitError}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
