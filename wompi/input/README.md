# Input Files for Wompi Payment Links

This directory contains JSON files that define payment links to be created using the Wompi API.

## File Format

Each JSON file can contain either:
- A single payment link definition (JSON object)
- Multiple payment link definitions (JSON array)

## Required Fields

Every payment link must have these fields:

```json
{
  "name": "Link name (string)",
  "description": "Link description (string)",
  "single_use": false,
  "collect_shipping": false
}
```

## Optional Fields

### Amount
- `amount_in_cop`: Number, amount in Colombian pesos (e.g., 100000 = $100,000 COP) - **Recommended**
- `amount_in_cents`: Integer, amount in cents (e.g., 10000000 = $100,000 COP)
- `currency`: String, currently only "COP" is supported

**Note:** You can use either `amount_in_cop` or `amount_in_cents`. Using `amount_in_cop` is more convenient as you specify the actual peso amount (e.g., 65000 for $65,000 COP) instead of cents (6500000).

### Expiration
- `expires_at`: String, ISO 8601 format (e.g., "2025-12-31T23:59:59")

### Redirection
- `redirect_url`: String, URL to redirect after payment

### Image
- `image_url`: String, URL of image to display on payment page

### SKU
- `sku`: String, internal product identifier (max 36 characters)

### Custom Fields
```json
{
  "customer_data": {
    "customer_references": [
      {
        "label": "Field name (max 24 chars)",
        "is_required": true
      }
    ]
  }
}
```
Note: Maximum 2 custom fields allowed.

### Taxes

For **fixed amount** links:
```json
{
  "taxes": [
    {
      "type": "VAT",
      "amount_in_cents": 1900000
    }
  ]
}
```

For **open amount** links:
```json
{
  "taxes": [
    {
      "type": "VAT",
      "percentage": 19
    }
  ]
}
```

Tax types: "VAT" (IVA) or "CONSUMPTION" (Impuesto al consumo)

## Examples

See the example files in this directory:
- `example_basic.json` - Minimal required fields
- `example_fixed_amount.json` - Link with fixed amount
- `example_with_custom_fields.json` - Link with custom fields
- `example_with_expiration.json` - Link with expiration date
- `example_with_taxes.json` - Fixed amount with taxes
- `example_open_amount_with_taxes.json` - Open amount with percentage tax

## Usage

### Create links from all input files:
```bash
cd wompi
python lib/create_links.py
```

### Create links from a specific file:
```bash
cd wompi
python lib/create_links.py input/my_links.json
```

## Output

Generated payment links will be saved in the `data/` directory with timestamps.

